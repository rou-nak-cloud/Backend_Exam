import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";
import { sessionModel } from "../models/sessionModel.js";

export const userToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(400).json({
        success: false,
        message: `Invalid token.`,
      });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, async (err, decode) => {
      if (err) {
        if (err.message === "ExpiredTokenError") {
          return res.status(400).json({
            success: false,
            message: `Expired token.`,
          });
        }
        return res.status(400).json({
          success: false,
          message: `Invalid token and expired.`,
        });
      }
      const { id, sessionId } = decode;

      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `User not found.`,
        });
      }
      const activeSession = await sessionModel.findOne({
        _id: sessionId,
        userId: id,
      });
      if (!activeSession) {
        return res.status(400).json({
          success: false,
          message: `Session not found.`,
        });
      }
      req.userId = id;
      req.sessionId = sessionId;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error.`,
    });
  }
};
