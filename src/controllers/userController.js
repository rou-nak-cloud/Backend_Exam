import { multerModel } from "../models/multerModel.js";
import { sessionModel } from "../models/sessionModel.js";
import { userModel } from "../models/userModel.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const existingUser = await userModel.findOne({
      $or: [{ email }, { userName }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `Users ${existingUser.email === email ? "Email" : "Username"} already exists.`,
      });
    }

    const hashPass = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      email,
      userName,
      password: hashPass,
    });

    return res.status(201).json({
      success: true,
      message: `User successfully registered.`,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error.`,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: `No user found please register first.`,
    });
  }
  const comparePass = await bcrypt.compare(password, user.password);
  if (!comparePass) {
    return res.status(400).json({
      success: false,
      message: `Invalid credentials.`,
    });
  } else if (comparePass) {
    const newSession = await sessionModel.create({ userId: user._id });
    const accessToken = jwt.sign(
      { id: user._id, sessionId: newSession._id },
      process.env.SECRET_KEY,
      { expiresIn: "10days" },
    );
    const refreshToken = jwt.sign(
      { id: user._id, sessionId: newSession._id },
      process.env.SECRET_KEY,
      { expiresIn: "30days" },
    );
    return res.status(200).json({
      success: true,
      message: `User ${user.userName} logged in successfully.`,
      accessToken: accessToken,
      refreshToken: refreshToken,
      data: user,
    });
  }
};

const logOut = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    const activeSession = await sessionModel.findOne({
      _id: req.sessionId,
      userId: req.userId,
    });
    if (activeSession) {
      await sessionModel.findOneAndDelete({
        _id: req.sessionId,
        userId: req.userId,
      });
      return res.status(200).json({
        success: true,
        message: `User ${user.userName} logged out.`,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `No session found.`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error.`,
    });
  }
};

const uploadPic = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(400).json({
        success: false,
        message: `Missing user context.`,
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: `missing file or Invalid file type. supported jpg,jpeg,png,svg,webp`,
      });
    }

    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found.`,
      });
    }

    const imageUrl = `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`;
    user.profilePic = imageUrl;
    await user.save();

    const multerPic = await multerModel.findOneAndUpdate(
      { userId: req.userId },
      { userId: req.userId, picture: imageUrl },
      { new: true, upsert: true },
    );
    return res.status(201).json({
      success: true,
      message: "Picture taken successfully.",
      data: user,
      multerData: multerPic,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error.`,
    });
  }
};

export { registerUser, login, logOut, uploadPic };
