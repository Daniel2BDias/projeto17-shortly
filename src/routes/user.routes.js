import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import validateToken from "../middlewares/validateToken.middleware.js";
import loginSchema from "../schemas/login.schema.js";
import signUpSchema from "../schemas/signUp.schema.js";
import {
  getRanking,
  getUserMe,
  logOutController,
  loginController,
  signUpController,
} from "../controllers/user.controllers.js";

const userRouter = Router();

userRouter.post("/signup", validateSchema(signUpSchema), signUpController);
userRouter.post("/signin", validateSchema(loginSchema), loginController);
userRouter.get("/users/me", validateToken, getUserMe);
userRouter.get("/ranking", getRanking);
userRouter.delete("/logout", validateToken, logOutController);

export default userRouter;
