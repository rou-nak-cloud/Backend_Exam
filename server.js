import dotenv from "dotenv";

import express from "express";
import { dbConnect } from "./src/config/dbConnect.js";
import userRoute from "./src/routes/userRoute.js";
import notesRoute from "./src/routes/notesRoute.js";

const app = express();
dotenv.config();
dbConnect();

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/user", userRoute);
app.use("/api/note", notesRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running at port ${process.env.PORT}`);
});
