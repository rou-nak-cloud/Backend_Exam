import express from "express";
import {
  createNoteValidate,
  noteValidateSchema,
  updateNoteValidate,
} from "../validators/notesValidate.js";
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from "../controllers/notesController.js";
import { userToken } from "../middlewares/userToken.js";
const notesRoute = express.Router();

notesRoute.post(
  "/create",
  userToken,
  noteValidateSchema(createNoteValidate),
  createTask,
);
notesRoute.get("/getAll", userToken, getAllTasks);
notesRoute.put(
  "/update/:id",
  userToken,
  noteValidateSchema(updateNoteValidate),
  updateTask,
);
notesRoute.delete("/delete/:id", userToken, deleteTask);

export default notesRoute;
