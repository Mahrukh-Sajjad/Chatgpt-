import React from "react";
import "./Login.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const submitHandler = async (user) => {
    axios
      .post("http://localhost:3000/api/auth/login", user, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const moveToSignUP = () => {
    navigate("/register");
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="background">
      <div className="container">
        <div className="heading">
          <h1>Welcome Back</h1>
          <p>Please Enter your credentials to continue</p>
        </div>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="Email">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: "email is required" })}
            />
            {errors.email && (
              <p style={{ color: "white" }}>{errors.email.message}</p>
            )}
          </div>
          <div className="password">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              {...register("password", { required: "password is required" })}
            />
            {errors.password && (
              <p style={{ color: "white" }}>{errors.password.message}</p>
            )}
          </div>
          <button>Sign In</button>
        </form>
        <div className="divider">
          <span>or</span>
        </div>
        <div className="moveToSignUp">
          <p>
            Don't have an account <span onClick={moveToSignUP}>Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
