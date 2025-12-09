import  mongoose from 'mongoose';
const wishlistSchema1 = new mongoose.Schema({
user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'User is required']
},
product:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: [true, 'Product is required']
}

},
{timestamps:true})

const Wishlist1 = mongoose.model('wishlist1', wishlistSchema1)
export default Wishlist1
