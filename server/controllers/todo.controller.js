import { ApiError } from "../utilities/ApiError.utility.js";
import { ApiResponse } from "../utilities/ApiResponse.utility.js";
import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import User from "../models/user.model.js";
import Todo from "../models/todo.model.js";

//TODO CONTROLLERS................

const createTodo = asyncHandler(async (req, res) => {
  const { todoTitle, todoDiscription } = req.body;
  const userId = req.user._id;
  const incompleteDetails = [todoTitle, todoDiscription].some((item) => {
    return item.trim() === "";
  });
  if (incompleteDetails) {
    throw new ApiError(409, "incomplete details");
  }
  if (!userId) {
    throw new ApiError(402, "user id not found");
  }
  const userExist = await User.findById(userId);
  if (!userExist) {
    throw new ApiError(403, "user not exist");
  }
  const createdTodo = await Todo.create({
    todoTitle,
    todoDiscription,
    userId,
  });
  res
    .status(200)
    .json(new ApiResponse(200, "todo created successfully", createdTodo));
});
const getTodo = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(401, "user id not found");
  }
  const alltodo = await Todo.find({ userId: userId });
  res.status(200).json(new ApiResponse(200, "all todos", alltodo));
});
const updateTodo = asyncHandler(async (req, res) => {
  const { todoTitle, todoDiscription } = req.body;
  const { todoId } = req.params;
  const incompleteDetails = [todoTitle, todoDiscription].some((item) => {
    return item.trim() === "";
  });
  if (incompleteDetails) {
    throw new ApiError(409, "incomplete details");
  }
  if (!todoId) {
    throw new ApiError(402, "todo id not found");
  }

  const upadatedTodo = await Todo.findByIdAndUpdate(
    todoId,
    {
      todoTitle,
      todoDiscription,
    },
    { new: true }
  );
  res.status(200).json(new ApiResponse(200, "todo updated.", upadatedTodo));
});

const deleteTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  if (!todoId) {
    throw new ApiError(402, "todo id not found");
  }
  const deletedTodo = await Todo.findByIdAndDelete(todoId);
  res.status(200).json(new ApiResponse(200, "todo deleted.", deletedTodo));
});

//SUB-TODO CONTROLLERS.............

const addSubTodo = asyncHandler(async (req, res) => {
  const { subTodoTitle, subTodoDiscription } = req.body;
  const { todoId } = req.params;
  const incompleteDetails = [subTodoTitle, subTodoDiscription].some((item) => {
    return item.trim() === "";
  });
  if (incompleteDetails) {
    throw new ApiError(409, "incomplete details");
  }
  if (!todoId) {
    throw new ApiError(402, "todo id not found");
  }
  const todo = await Todo.findById(todoId);
  if (!todo) {
    throw new ApiError(403, "todo not exist");
  }
  const newSubTodo = {
    subTodoTitle,
    subTodoDiscription,
  };
  todo.subTodos.push(newSubTodo);
  await todo.save();
  res.status(200).json(new ApiResponse(200, "subTodo added..", newSubTodo));
});

const updateSubTodo = asyncHandler(async (req, res) => {
  const { todoId, subTodoId } = req.params;
  const { subTodoTitle, subTodoDiscription } = req.body;
  const incompleteDetails = [subTodoTitle, subTodoDiscription].some((item) => {
    return item.trim() === "";
  });
  if (incompleteDetails) {
    throw new ApiError(409, "incomplete details");
  }
  if (!todoId || !subTodoId) {
    throw new ApiError(402, "todo or subTodo id not found");
  }
  const todo = await Todo.findById(todoId);
  if (!todo) {
    throw new ApiError(403, "todo not exist");
  }
  const subTodo = todo.subTodos.id(subTodoId);
  if (!subTodo) {
    throw new ApiError(403, "subTodo not exist");
  }
  subTodo.subTodoTitle = subTodoTitle;
  subTodo.subTodoDiscription = subTodoDiscription;
  await todo.save();
  res.status(200).json(new ApiResponse(200, "sub todo updated.", subTodo));
});
const deleteSubTodo = asyncHandler(async (req, res) => {
  const { todoId, subTodoId } = req.params;

  if (!todoId || !subTodoId) {
    throw new ApiError(402, "todo or subTodo id not found");
  }
  const todo = await Todo.findById(todoId);
  if (!todo) {
    throw new ApiError(403, "todo not exist");
  }

  const subTodoIndex = todo.subTodos.findIndex(
    (subTodo) => subTodo._id.toString() === subTodoId
  );
  if (subTodoIndex === -1) {
    throw new ApiError(403, "subTodo not exist");
  }
  const removedTodo = todo.subTodos.splice(subTodoIndex, 1);
  await todo.save();
  res.status(200).json(new ApiResponse(200, "sub todo removed.", removedTodo));
});

export {
  createTodo,
  addSubTodo,
  getTodo,
  updateTodo,
  deleteTodo,
  updateSubTodo,
  deleteSubTodo,
};
