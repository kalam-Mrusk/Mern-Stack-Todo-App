import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import {
  addSubTodo,
  createTodo,
  deleteSubTodo,
  deleteTodo,
  getTodo,
  updateSubTodo,
  updateTodo,
} from "../controllers/todo.controller.js";

const todoRouter = Router();
todoRouter.post("/create", verifyUser, createTodo);
todoRouter.get("/get", verifyUser, getTodo);
todoRouter.put("/:todoId/update", updateTodo);
todoRouter.delete("/:todoId/delete", deleteTodo);
todoRouter.post("/:todoId/subtodo", addSubTodo);
todoRouter.put("/:todoId/subtodo/:subTodoId/update", updateSubTodo);
todoRouter.delete("/:todoId/subtodo/:subTodoId/delete", deleteSubTodo);
export default todoRouter;
