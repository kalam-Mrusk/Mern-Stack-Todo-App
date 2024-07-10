import axios from "axios";
import "./todo.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadingEnd, loadingStart, refresh } from "../redux/loading.slice.js";
import TodoItem from "../components/TodoItem/TodoItem.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from "react-loader-spinner";
const Todo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.loading.status);
  const userExist = useSelector((state) => state.user.value);
  const [title, setTitle] = useState("");
  const [discription, setDiscription] = useState("");
  const [allTodos, setAllTodos] = useState([]);
  const userLogOut = async () => {
    try {
      const res = await axios.get(
        // "http://localhost:8080/api/todo-app/user/auth/logout",
        "https://mern-stack-todo-server.onrender.com/api/todo-app/user/auth/logout",

        {
          withCredentials: true,
        }
      );
      dispatch(refresh());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  const addTodo = async () => {
    const incompleteDetails = [title, discription].some((ele) => {
      return ele.trim === "";
    });
    if (incompleteDetails) return window.alert("incomplete details.");
    try {
      dispatch(loadingStart());
      const res = await axios.post(
        // "http://localhost:8080/api/todo-app/todo/create",
        "https://mern-stack-todo-server.onrender.com/api/todo-app/todo/create",
        {
          todoTitle: title,
          todoDiscription: discription,
        },
        { withCredentials: true }
      );
      if (res) {
        notify("todo added.");
        setTitle("");
        setDiscription("");
        getAllTodo();
      }
      dispatch(loadingEnd());
    } catch (error) {
      console.log(error);
      dispatch(loadingEnd());
    }
  };

  const getAllTodo = async () => {
    try {
      const res = await axios.get(
        // "http://localhost:8080/api/todo-app/todo/get",
        "https://mern-stack-todo-server.onrender.com/api/todo-app/todo/get",
        { withCredentials: true }
      );
      if (res) {
        setAllTodos(res.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const notify = (alert) => toast(alert);

  useEffect(() => {
    if (!userExist) {
      navigate("/");
    }
    getAllTodo();
  }, [userExist]);
  return (
    <div className="todoPageContainer">
      <div className="todoHeader">
        <h3 className="fullname">{userExist?.user.fullname}</h3>
        <button onClick={userLogOut}>logout</button>
      </div>
      <img
        src="https://cdn-icons-png.flaticon.com/128/14666/14666612.png"
        className="writeTodoImg"
      />
      <div className="todoPageInputSection">
        <input
          type="text"
          placeholder="todo title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          name=""
          id=""
          placeholder="todo discription..."
          value={discription}
          onChange={(e) => setDiscription(e.target.value)}
        ></textarea>
        {loading ? (
          <div style={{ margin: "auto" }}>
            <ThreeDots
              visible={true}
              height="59"
              width="80"
              color="#4fa94d"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : (
          <button onClick={addTodo}>add todo</button>
        )}
      </div>
      <h2>Todo List</h2>
      <div className="todoPageItemContainer">
        {allTodos.map((todo) => (
          <TodoItem
            key={todo._id}
            todoId={todo._id}
            subTodoData={todo.subTodos}
            todoTitle={todo.todoTitle}
            todoDiscription={todo.todoDiscription}
            getAllTodo={getAllTodo}
            createdAt={todo.createdAt}
            updatedAt={todo.updatedAt}
            notify={notify}
          />
        ))}
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
    </div>
  );
};

export default Todo;
