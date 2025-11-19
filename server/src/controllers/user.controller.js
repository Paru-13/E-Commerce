import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";

export const getAll = (async (req, res, next) => {
  
    const users = await User.find({});
    res.status(200).json({
      message: "User Fetched",
      data: users,
    });
  
});

//!get By ID
export const getByID = asyncHandler(async(req,res,next)=>{

    const {id} = req.params
    const user = await User.findById(id);
    if(!user){
        throw new Error('User not found')
    }
    res.status(200).json({
        message:'User by ID',
        data:user
    })

})


//!update user profile
export const updateProfile = asyncHandler(async (req, res, next) => {
 
    const {id} = req.params
    const { first_name, last_name, phone_Number, gender } = req.body;

    //new:true -> update data dinxa
    const user = await User.findByIdAndUpdate(id, {first_name, last_name, phone_Number, gender },{new:true})
    if(!user){
        throw new Error('User not found')
    }

    res.status(200).json({
        message:'Profile Updated',
        data:user
    })
  
});
