import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    description:{
        type:String
    },
    image:{
        type:{
            path: String,
            public_id: String
        }
    }
  },
  { timestamps: true }
);

const Brand = mongoose.model('brand',brandSchema)
export default Brand

//controller, route, utils

//postman
