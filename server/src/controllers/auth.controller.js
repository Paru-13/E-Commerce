import CustomError from "../middlewares/errorHandler.middleware.js";
import { USER_ROLE } from "../constants/enums.constant.js";
import USER from "../models/user.model.js";
import { comparePW, hashPassword } from "../utils/bcrypt.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";

//register user
export const register = asyncHandler(async (req, res, next) => {
  
    const { first_name, last_name, email, password, phone_Number, gender } =
      req.body;

    //password chaina vani
    if (!password) {
      /*
      const error = new Error("Password is required")
      //status code + status + msg(pw is required) aafai lay pathako error aauda
      error.statusCode = 400
      error.status = 'fail'
      throw error
      */
      throw new CustomError("Password is required", 400); //instead of upper long code
    }

    //if password xa vani, pw lai hash garne
    const hassPW = await hashPassword(password);

    const user = await USER.create({
      first_name,
      last_name,
      email,
      password: hassPW, //user create garnay time ma user ko orignal pw narakhera hashpw rakheko
      phone_Number,
      gender,
      role: USER_ROLE.USER,
    });
    res.status(201).json({
      message: "Account Created",
      status: "success",
      data: user,
    });
  
});

//login
export const login = asyncHandler(async (req, res, next) => {
      //!email pw
    const { email, password } = req.body;
    if (!email) {
      /*
      const error = new Error("Email is required");
      next(error);
      */
      throw new CustomError("Email is required", 400);
    }
    if (!password) {
      throw new CustomError("Password is required", 400);
    }

    //!check/get user by email
    const user = await USER.findOne({ email });
    //*throw error if user not found
    if (!user) {
      throw new CustomError("Credentials doesnot match", 400);
    }

    //!compare password
    const isMatch = await comparePW(password, user.password);

    //*throw error if pw doesnot match
    if (!isMatch) {
      throw new CustomError("Credentials doesnot match", 400);
    }

    //!Token create

    //!login success
    res.status(201).json({
      message: "login success",
      data: user,
    });
  
});
