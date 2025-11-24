import CustomError from "../middlewares/errorHandler.middleware.js";
import Product from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";

//getAll
export const getAll = asyncHandler(async (req, res) => {
  const product = await Product.find({});
  res.status(200).json({
    message: "Product Fetched",
    status: "Success",
    data: product,
  });
});

//getByID
export const getByID = asyncHandler(async(req,res)=>{
    const {id} = id.params

    const product = await Product.findById({_id:id})

    if(!product){
        throw new CustomError('Product not found', 404)
    }
    res.status(200).json({
        message:'Product fetched',
        status:"success",
        data:product
    })
})
//create
export const create = asyncHandler(async(req,res)=>{
    const {name, price, stock, description} = req.body
    const file = req.file
    const product = new Product({name, price, stock, description})

    if(!name){
        throw new CustomError("Name is required",400)
    }
})

//update
//delete
//getByCategory
//getByBrand
//getAlllFeatured
//getAllNewArrivals
