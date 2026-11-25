import React from "react";
import "./Register.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const submitHandler = async (user) => {
    console.log(user);
    const { firstName, lastName, email, password } = user;
    const newObj = {
      email: email,
      password: password,
      fullName: {
        firstName: firstName,
        lastName: lastName,
      },
    };
    axios
      .post("http://localhost:3000/api/auth/register", newObj, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        alert("Registration failed");
      });
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const moveToSignIn = () => {
    navigate("/login");
  };
  return (
    <div className="background">
      <div className="container">
        <div className="heading">
          <h1>Create Account</h1>
          <p>Fill in your details to get started</p>
        </div>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="fullName">
            <div className="firstName">
              <label htmlFor="firstName">First Name</label>
              <input
                style={{ width: "160px" }}
                type="text"
                id="firstName"
                placeholder="First Name"
                {...register("firstName", {
                  required: "FirstName is required",
                })}
              />
              {errors.firstName && <p>{errors.firstName.message}</p>}
            </div>
            <div className="lastName">
              <label htmlFor="lastName">Last Name</label>
              <input
                style={{ width: "160px" }}
                type="text"
                id="lastName"
                placeholder="Last Name"
                {...register("lastName", {
                  required: "Last Name  is required",
                })}
              />
              {errors.lastName && <p>{errors.lastName.message}</p>}
            </div>
          </div>
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
          <button>Sign Up</button>
        </form>
        <div className="divider">
          <span>or</span>
        </div>
        <div className="moveToSignUp">
          <p>
            Already have and account <span onClick={moveToSignIn}>Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
