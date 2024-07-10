import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import {
  getCurrentUser,
  userLoggedOut,
  userLogin,
  userRegistration,
} from "../controllers/user.controller.js";

const userRouter = Router();
userRouter.get("/get-current-user", verifyUser, getCurrentUser);
userRouter.post("/auth/register", userRegistration);
userRouter.post("/auth/login", userLogin);
userRouter.get("/auth/logout", userLoggedOut);

export default userRouter;
