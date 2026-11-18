import express from "express";
import {
  loginUserValidate,
  registerUserValidate,
  validateUserSchema,
} from "../validators/userValidate.js";
import { login, logOut, registerUser } from "../controllers/userController.js";
import { userToken } from "../middlewares/userToken.js";
const userRoute = express.Router();

userRoute.post(
  "/register",
  validateUserSchema(registerUserValidate),
  registerUser,
);

userRoute.post("/login", validateUserSchema(loginUserValidate), login);
userRoute.delete("/logout", userToken, logOut);

export default userRoute;
