/*route middleware
request controller ma pugnu vanda yesma aauna paryo, 
-user login xa ki nai
-cookies aairxa ki nai check garxa
-cookies aairxa vani token nikalna paryo(access_token)
-token valid hoki nai (hamlay issue gareko hoki nai check garnay)
-if valid xa vani expire vayo ki nai check garnay
-after all this user login xa valid xa vanay paxi next call garera req lai controller ma pass garnay
-if mathi ko bata ewta pani milena vani error thrw garnu paryo
*/

import User from "../models/user.model.js";
import { verifyToken } from "../utils/JWT.utils.js";
import CustomError from "./errorHandler.middleware.js";

export const authenticate = (roles) => {
  return async (req, res, next) => {
    try {
      //*get cookies
      const cookies = req.cookies ?? {};
      const token = cookies["access_token"];

      if (!token) {
        throw new CustomError("Unauthorized. Access Denied", 401);
      }
      console.log(token);

      //* Validity
      // hamro system lay issue garera pathao token ho ki nai check garxa
      const payload = verifyToken(token);
      console.log(payload);

      //*expiry
      //token expiry xa ki nai check garnay
      if (payload?.exp && payload?.exp * 1000 < Date.now()) {
        //2nd ko payload?.exp-expiry time sec ma hunxa so *1000(milisec ma convert)Date.now(current time) vanda less xa vani token expire vaisakyo
        res.clearCookie("access_token", {
          httpOnly: true,
          sameSite: "none",
          secure: process.env.NODE_ENV === "development" ? false : true,
        });
        throw new CustomError("Token expired.Access denied", 401);
      }

      //*token valid xa, expired xaina ani jun user lay issue gareko ho tyo user xa ki nai check garna
      const user = await User.findOne({
        _id: payload._id,
        email: payload.email,
      });

      //user xaina vani chai
      if (!user) {
        throw new CustomError("Invalid token. User not found", 401);
      }

      //*role
      if (!roles.includes(user.role)) {
        throw new CustomError("Forbidden.Access denied", 403); //user login xa tara tyo user lai access xaina vaneko
      }

      //attach user to request
      req.user = {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role:user.role
      }

      next(); //try ko kam sakay c controller ma pass garxa
    } catch (error) {
      next(error);
    }
  };
};
