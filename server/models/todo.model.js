import mongoose from "mongoose";

const TodoSchema = await mongoose.Schema(
  {
    todoTitle: {
      type: String,
      require: true,
    },
    todoDiscription: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subTodos: [
      {
        subTodoTitle: {
          type: String,
          require: true,
        },
        subTodoDiscription: {
          type: String,
        },
      },
    ],
  },

  { timestamps: true }
);

const Todo = mongoose.model("Todo", TodoSchema);
export default Todo;
