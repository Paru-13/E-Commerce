import { USER_ROLE } from "../constants/enums.constant.js";
import USER from "../models/user.model.js";
import { comparePW, hashPassword } from "../utils/bcrypt.utils.js";

//register user
export const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, phone_Number, gender } =
      req.body;

      //password chaina vani
    if(!password){
      throw new Error("Password is required")
    }

    //if password xa vani, pw lai hash garne
    const hassPW = await hashPassword(password)

    const user = await USER.create({
      first_name,
      last_name,
      email,
      password:hassPW,  //user create garnay time ma user ko orignal pw narakhera hashpw rakheko
      phone_Number,
      gender,
      role: USER_ROLE.USER,
    });
    res.status(201).json({
      message: "Account Created",
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

//login
export const login = async (req, res, next) => {
  try {
    //!email pw
    const { email, password } = req.body;
    if (!email) {
      const error = new Error("Email is required");
      next(error);
    }
    if (!password) {
      const error = new Error("Password is required");
      next(error);
    }

    //!check/get user by email
    const user = await USER.findOne({ email });
    //*throw error if user not found
    if (!user) {
      const error = new Error("Credentials doesnot match");
      throw error;
    }

    //!compare password
    const isMatch = await comparePW(password,user.password);

    //*throw error if pw doesnot match
    if (!isMatch) {
      const error = new Error("Credentials doesnot match");
      throw error;
    }

    //!Token create

    

    //!login success
    res.status(201).json({
      message: "login success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
