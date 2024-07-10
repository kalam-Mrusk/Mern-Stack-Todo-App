import React, { useEffect, useState } from "react";
import "./loginOrSignin.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Signin = () => {
  const navigate = useNavigate();
  const loading = useSelector((state) => state.loading.status);
  const userExist = useSelector((state) => state.user.value);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const userRegistration = async (e) => {
    e.preventDefault();
    const inCompleteDetail = [fullname, username, email, password].some(
      (element) => {
        return element === null || element.trim() === "";
      }
    );
    if (inCompleteDetail) {
      return window.alert("incomplete details..");
    }
    try {
      const res = await axios.post(
        // "http://localhost:8080/api/todo-app/user/auth/register",
        "https://mern-stack-todo-server.onrender.com/api/todo-app/user/auth/register",
        {
          fullname,
          username,
          email,
          password,
        }
      );
      if (res) {
        window.alert("user register successfully.");
        setFullname("");
        setUsername("");
        setEmail("");
        setPassword("");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (userExist && !loading) {
      navigate("/todo");
    }
  }, [userExist]);
  return (
    <div className="signinPage">
      <form action="" className="signinForm">
        <h2>SignIn</h2>
        <input
          type="text"
          placeholder="fullname"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={(e) => userRegistration(e)}>signin</button>
      </form>
    </div>
  );
};

export default Signin;
