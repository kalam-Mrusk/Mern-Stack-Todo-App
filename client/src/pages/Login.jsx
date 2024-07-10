import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./loginOrSignin.css";
import { useDispatch, useSelector } from "react-redux";
import { refresh } from "../redux/loading.slice.js";
import axios from "axios";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.status);
  const userExist = useSelector((state) => state.user.value);
  const [usernameORemail, setUsernameORemail] = useState("");
  const [password, setPassword] = useState("");
  const userLogIn = async (e) => {
    e.preventDefault();
    if (usernameORemail === "") {
      return window.alert("please enter username...");
    }
    if (password === "") {
      return window.alert("please enter password...");
    }
    try {
      const res = await axios.post(
        "http://localhost:8080/api/todo-app/user/auth/login",
        {
          usernameORemail,
          password,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(refresh());
      navigate("/todo");
    } catch (error) {
      console.log(error);
      window.alert("incorrect username or password...");
    }
  };

  useEffect(() => {
    if (userExist && !loading) {
      navigate("/todo");
    }
  }, [userExist]);
  return (
    <div className="loginPage">
      <form className="loginForm">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="username / email"
          value={usernameORemail}
          onChange={(e) => setUsernameORemail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={(e) => userLogIn(e)}>login</button>
      </form>
      <div className="dontHaveAccount">
        <p>Do not have a account</p>
        <NavLink to="signin">
          <button>signIn</button>
        </NavLink>
      </div>
    </div>
  );
};

export default Login;
