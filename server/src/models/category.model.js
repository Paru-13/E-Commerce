import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
name:{
    type:String,
    required:[true, 'Name is required']
},
description:{
    type:String
},
image:{
    type:{
        path:String,
        public_id: String
    }
}
},
{timestamps:true})

const Category = mongoose.model('category', categorySchema) 
export default Category