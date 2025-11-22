import jwt from "jsonwebtoken";
import CustomError from "../middlewares/errorHandler.middleware.js";
import { JWT_config } from "../config/config.js";

export const generateJWTToken = (payload) => {
  return jwt.sign(payload, JWT_config.secret, {
    expiresIn: JWT_config.expires_in,
  });
};

// verify jwt token
export const verifyToken = (token)=>{
  try {
    return jwt.verify(token, JWT_config.secret)  //verify garera token decode garera payload +data dinxa
    
  } catch (error) {
    throw new CustomError('JWT error', 500)
  }
}