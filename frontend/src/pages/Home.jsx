import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import "./Home.css";

const Home = () => {
  const messageInput = useRef(null);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  const [chatsDiv, setChatsDiv] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // Fetch all chats and connect socket
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/chat", {
          withCredentials: true,
        });

        setChatsDiv(response.data.chats);
      } catch (error) {
        setError(error.response?.data?.message || "Unable to load chats");
      }
    };

    fetchChats();

    const tempSocket = io("http://localhost:3000", {
      withCredentials: true,
    });

    socketRef.current = tempSocket;

    tempSocket.on("connect", () => {
      setSocketConnected(true);
    });

    tempSocket.on("disconnect", () => {
      setSocketConnected(false);
    });

    tempSocket.on("ai-response", (response) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          _id: `ai-${Date.now()}`,
          role: "model",
          content: response.content,
          createdAt: new Date(),
        },
      ]);

      setIsGenerating(false);
    });

    return () => {
      tempSocket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isGenerating]);

  // Create new chat
  const newChatHandler = async () => {
    let title = prompt("Enter Title");

    if (title) title = title.trim();
    if (!title) return;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/chat",
        { title },
        { withCredentials: true },
      );

      const newChat = response.data.chat;

      setChatsDiv((prevChats) => [...prevChats, newChat]);

      setActiveChatId(newChat._id);
      setMessages([]);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Unable to create chat");
    }
  };

  // Select chat and fetch its messages
  const selectChatHandler = async (chatId) => {
    setActiveChatId(chatId);
    setMessages([]);
    setError("");

    try {
      setIsLoadingMessages(true);

      const response = await axios.get(
        `http://localhost:3000/api/chat/messages/${chatId}`,
        { withCredentials: true },
      );

      // Avoid displaying a response for a chat that is no longer selected
      setMessages(response.data.messages);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load messages");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Send message through Socket.IO
  const sendMessage = (e) => {
    e.preventDefault();

    const inputValue = messageInput.current.value;
    const trimmedMessage = inputValue.trim();

    if (!trimmedMessage) return;

    if (!activeChatId) {
      setError("Please create or select a chat first");
      return;
    }

    if (isGenerating) return;

    if (!socketRef.current || !socketConnected) {
      setError("Server connection is not available");
      return;
    }

    const userMessage = {
      _id: `user-${Date.now()}`,
      role: "user",
      content: trimmedMessage,
      createdAt: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setIsGenerating(true);
    setError("");

    messageInput.current.value = "";

    socketRef.current.emit("ai-message", {
      chat: activeChatId,
      content: trimmedMessage,
    });
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="homeBG">
      {/* Sidebar */}
      <div className="sideBar" style={{ color: "white" }}>
        <div className="chatsBtn">
          <p>Chats</p>
          <button onClick={newChatHandler}>New</button>
        </div>

        <div className="allChats">
          {chatsDiv.map((item) => (
            <button
              key={item._id}
              className={`chat ${
                activeChatId === item._id ? "activeChat" : ""
              }`}
              onClick={() => selectChatHandler(item._id)}
            >
              <h5>{item.title}</h5>
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="main">
        {/* Messages */}
        {activeChatId && (
          <div className="messagesContainer">
            <div className="messages">
              {isLoadingMessages ? (
                <p className="loadingMessage">Loading messages...</p>
              ) : (
                messages.map((item) => (
                  <div
                    key={item._id}
                    className={`message ${
                      item.role === "user" ? "userMessage" : "aiMessage"
                    }`}
                  >
                    <p>{item.content}</p>

                    <span className="messageTime">
                      {formatTime(item.createdAt)}
                    </span>
                  </div>
                ))
              )}

              {isGenerating && (
                <p className="loadingMessage">ChatGPT is thinking...</p>
              )}

              <div ref={bottomRef} />
            </div>
          </div>
        )}

        {/* Error */}
        {error && <p className="loadingMessage">{error}</p>}

        {/* Input */}
        <form className="inputContainer" onSubmit={sendMessage}>
          <input
            ref={messageInput}
            type="text"
            placeholder="Message Chatgpt ..."
            disabled={!activeChatId || isGenerating}
          />

          <button
            type="submit"
            disabled={!activeChatId || isGenerating || !socketConnected}
          >
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
