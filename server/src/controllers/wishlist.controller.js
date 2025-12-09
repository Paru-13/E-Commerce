import CustomError from "../middlewares/errorHandler.middleware.js";
import Product from "../models/product.model.js";
import Wishlist from "../models/wishlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";

// addToWishlist-> create
export const addWishlist = asyncHandler(async (req, res) => {
    // 1. get user and product
    const userID = req.user._id
    const {productID} = req.body

    // 2. check product exists
    const product = await Product.findById(productID)
    if(!product){
        throw new CustomError('Product not found', 404)
    }

    // 3. check duplicate

    const exists = await Wishlist.findOne({user:userID, product:productID})
    if(exists){
        throw new CustomError("Product already in wishlist", 409)
    }
    // 4. create save
    const wishlistItem = new Wishlist({user:userID, product:productID})
    
    await wishlistItem.save()

    res.status(201).json({
        message:"Added to wishlist",
        status:"success",
        data:wishlistItem
    })
});

// getWishlist
export const getWishlist = asyncHandler(async (req, res) => {
    // 1. find all wishlist items for this user
    // 2. populate product
    
       const userId = req.user._id;   //authmiddleware
    
      const wishlist = await Wishlist.find({ user: userId})
        .populate({
        path: "product",
        populate: [
            { path: "category" },  // populate the category inside product
            { path: "brand" }      // populate the brand inside product
        ]})
        
        res.status(200).json({
            message:"wishlist fetched",
            status:"success",
            data:wishlist
        })
});

// removeWishlistItem
export const removeWishlistItem = asyncHandler(async (req, res) => {
    // 1. get product id from params
    const userID = req.user._id
    const {productID} = req.params

  // find the wishlist entry
    const wishlistItem = await Wishlist.findOne({ user: userID, product: productID })
   
   if(!wishlistItem){
    throw new CustomError("Wishlist item not found", 404)
   }
    // 2. delete one wishlist item
    await wishlistItem.deleteOne()

    res.status(200).json({
        message:"Wishlist item removed",
        status:'success',
        data:wishlistItem
    })
});

// clearWishlist
export const clearWishlist = asyncHandler(async (req, res) => {
    const userID = req.user._id

    const result = await Wishlist.deleteMany({user:userID})
console.log(result.deletedCount);
res.status(200).json({
        message:"Wishlist cleared",
        status:'success',
        data: { deletedCount: result.deletedCount },  //"deletedCount": 5

})
})
