# AI ChatGPT Clone

An AI-powered chatbot application inspired by ChatGPT, developed using the MERN stack and modern AI technologies. The application allows users to create multiple conversations, send messages, and receive AI-generated responses in real time.

## Features

- User Registration and Login
- Secure Authentication using JWT
- Create Multiple Chats
- View Previous Conversations
- Retrieve Chat Message History
- Real-Time Messaging using Socket.IO
- AI-Generated Responses using Google Gemini
- Conversation Memory using Pinecone
- Persistent Data Storage using MongoDB

## Technologies Used

### Frontend
- React.js
- CSS
- Axios
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT
- Google Gemini API
- Pinecone Vector Database

## Project Structure

```text
AI-ChatGPT-Clone/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── sockets/
│   │   └── db/
│   ├── app.js
│   └── server.js
│
└── frontend/
    ├── src/
    ├── public/
    └── package.json
```

## Getting Started

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd AI-ChatGPT-Clone
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
```

Start the backend server:

```bash
node server.js
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the application in your browser:

```text
http://localhost:5173
```

## Real-Time Communication

Socket.IO is used to enable real-time communication between the frontend and backend.

- `ai-message`: Sends user messages to the backend.
- `ai-response`: Delivers AI-generated responses to the frontend.

## Database

- **Mongo
