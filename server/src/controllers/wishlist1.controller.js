import CustomError from "../middlewares/errorHandler.middleware.js";
import Product from "../models/product.model.js";
import Wishlist1 from "../models/wishlist1.model.js";
import { asyncHandler } from "./../utils/asyncHandler.utils.js";

//create
export const createWishlist = asyncHandler(async (req, res) => {
  const user_id = req.user._id;
  const { product_id } = req.body;
  let productExist = null;
  let new_wishlist = null;

  const product = await Product.findById(product_id);
  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  //check id wishlist ma product already exist or not
  productExist = await Wishlist1.findOne({
    user: user_id,
    product: product_id,
  });
  //If exists → remove, else → add.
  if (productExist) {
    await productExist.deleteOne();
  } else {  //exist gardaina vani new wishlist create gardeko
    new_wishlist = await Wishlist1.create({
      user: user_id,
      product: product_id,
    });
  }

  res.status(201).json({
    message:`${product.name} ${productExist? 'removed from whislist': 'Added to wishlist'}`,
    status:'success',
    data: new_wishlist
  })
});

//*getAll  -> authenticate route  -> only user
// jun user login xa tesko mtra func return garnay ho, find and filter userid only
export const getAll = asyncHandler(async(req, res)=>{
    const user_id = req.user._id
    const lists = await Wishlist1.find({user:user_id}).populate('product').populate('user')
    res.status(200).json({
        message: 'Wishlist fetched',
        data:lists,
        status:'success'
    })
})

//*clearALL
export const clear = asyncHandler(async(req,res)=>{
    const user_id = req.user_id

   const deleted = await Wishlist1.deleteMany({user:user_id})
    if(!deleted){
        throw new CustomError('Error clearing list', 500)
    }
     res.status(200).json({
        message: 'Wishlist cleared',
        data:null,
        status:'success'
    })
})