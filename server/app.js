import express, { json, urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import todoRouter from "./routes/todo.routes.js";
dotenv.config({ path: "./.env" });
const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4173","https://mern-stack-todo-app-jxoy.onrender.com"],
    credentials: true,
  })
);
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/todo-app/user", userRouter);
app.use("/api/todo-app/todo", todoRouter);

export default app;
