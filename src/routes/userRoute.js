import express from "express";
import {
  loginUserValidate,
  registerUserValidate,
  validateUserSchema,
} from "../validators/userValidate.js";
import {
  login,
  logOut,
  registerUser,
  uploadPic,
} from "../controllers/userController.js";
import { userToken } from "../middlewares/userToken.js";
import { upload } from "../middlewares/multer.js";
const userRoute = express.Router();

userRoute.post(
  "/register",
  validateUserSchema(registerUserValidate),
  registerUser,
);

userRoute.post("/upload", userToken, upload.single("picture"), uploadPic);
userRoute.post("/login", validateUserSchema(loginUserValidate), login);
userRoute.delete("/logout", userToken, logOut);

export default userRoute;
