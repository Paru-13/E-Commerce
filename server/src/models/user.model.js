import mongoose from "mongoose";
import { GENDER, USER_ROLE } from "../constants/enums.constant.js";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name is required"], //msg send end first name is required
    },
    last_name: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique:[true,'User already existed with provided email.Please use another email address']
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: 8,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.USER,
      //   enum: ["ADMIN", "USER"],
      //   default: "USER",
    },
    gender: {
      type: String,
      enum: Object.values(GENDER),
      // default: GENDER.MALE
    },
    profile_picture: {
      type: {
        path: String,
        public_id: String,
      },
    },
    phone_Number: {
      type: Number
    }
  },
  { timestamps: true }
);

//creating user model
const User = mongoose.model('user',userSchema)
export default User
