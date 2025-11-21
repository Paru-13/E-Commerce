import jwt from "jsonwebtoken";
import CustomError from "../middlewares/errorHandler.middleware.js";
import { JWT_config } from "../config/config.js";

export const generateJWTToken = (payload) => {
  return jwt.sign(payload, JWT_config.secret, {
    expiresIN: JWT_config.expires_in,
  });
};

// ? verify jwt token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwt_config.secret);
  } catch (error) {
    throw new CustomError("jwt error", 500);
  }
};