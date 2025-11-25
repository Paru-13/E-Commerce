import mongoose from "mongoose";

const wishSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:[true, 'User is required']
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required:[true, 'Product is required']
    }
},{timestamps:true})

const Wishlist = mongoose.model('wishlist', wishSchema)
export default Wishlist