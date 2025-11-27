import CustomError from "../middlewares/errorHandler.middleware.js";
import { USER_ROLE } from "../constants/enums.constant.js";
import USER from "../models/user.model.js";
import { comparePW, hashPassword } from "../utils/bcrypt.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { uploadToCloud } from "../utils/cloudinary.utils.js";
import { generateJWTToken } from "../utils/JWT.utils.js";
import { sendEmail } from "../utils/nodemailer.utils.js";

//register user
export const register = asyncHandler(async (req, res, next) => {
  const { first_name, last_name, email, password, phone_Number, gender } =
    req.body;
  const image = req.file;
  console.log(image);
  console.log(req.file);

  //password chaina vani
  if (!password) {
    /*
      const error = new Error("Password is required")
      status code + status + msg(pw is required) aafai lay pathako error aauda
      error.statusCode = 400
      error.status = 'fail'
      throw error
      */
    throw new CustomError("Password is required", 400); //instead of upper long code
  }

  //if password xa vani, pw lai hash garne
  const hassPW = await hashPassword(password);

  //user vannay object banako USER vannay class ma
  const user = new USER({
    first_name,
    last_name,
    email,
    password: hassPW, //user create garnay time ma user ko orignal pw narakhera hashpw rakheko
    phone_Number,
    gender,
    role: USER_ROLE.USER,
  });

  //if image aairako cha vani
  if (image) {
    const { path, public_id } = await uploadToCloud(
      image.path,
      "/profile_image"
    ); //upload to cloud, file-image, folder name where to upload in cloud-profile_image
    user.profile_image = {
      path,
      public_id,
    };
  }

  await user.save();

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

  //NODEMAILER
  await sendEmail({
    to: user?.email,
    subject:'Login Successful',
    html:'<h1>New Login</h1>'

  })

  //!Token create(payload)
  const access_token = generateJWTToken({
    _id: user._id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
  });

  //!login success
  res.cookie('access_token', access_token, {  // Set the access token in a cookie
    httpOnly: true,
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'development' ? false :true,
     // Set cookie expiry (defaults to 7 days)
   maxAge: parseInt(process.env.COOKIE_EXPIRY || '7') * 24 * 60 * 60 * 1000 
// Convert COOKIE_EXPIRY (in days) to milliseconds → days * 24h * 60m * 60s * 1000ms
}).status(201).json({
    message: "login success",
    data: user,
    access_token
  });
});

//!logout
export const logout = asyncHandler(async(req,res)=>{
  res.clearCookie("access_token",{
    httpOnly: true,
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'development' ? false :true,
  })
  res.status(200).json({
    message:"Logout succesfully",
    status:"success",
    data:null
  })
})
