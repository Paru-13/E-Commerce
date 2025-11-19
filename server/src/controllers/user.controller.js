import User from "../models/user.model.js";

export const getAll = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      message: "User Fetched",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

//!get By ID
export const getByID = async(req,res,next)=>{
try {
    const {id} = req.params
    const user = await User.findById(id);
    if(!user){
        throw new Error('User not found')
    }
    res.status(200).json({
        message:'User by ID',
        data:user
    })
} catch (error) {
    next(error)
}
}


//!update user profile
export const updateProfile = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
