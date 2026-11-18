import mongoose from "mongoose";

const multerSchema = new mongoose.Schema(
  {
    picture: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true },
);

export const multerModel = mongoose.model("multer", multerSchema);
