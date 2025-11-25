import CustomError from "../middlewares/errorHandler.middleware.js";
import Brand from "../models/brand.model.js";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { deleteFile, uploadToCloud } from "../utils/cloudinary.utils.js";

const dir = "/products";

//getAll
export const getAll = asyncHandler(async (req, res) => {
  const product = await Product.find({}).populate("category").populate("brand");
  res.status(200).json({
    message: "Product Fetched",
    status: "Success",
    data: product,
  });
});

//getByID
export const getByID = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id })
    .populate("category")
    .populate("brand");

  if (!product) {
    throw new CustomError("Product not found", 404);
  }
  res.status(200).json({
    message: "Product fetched",
    status: "success",
    data: product,
  });
});
//create
export const create = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    stock,
    description,
    is_featured,
    new_arrival,
    category,
    brand,
  } = req.body;

  console.log(req.files);

  const { cover_image, images } = req.files;

  if (!category) {
    throw new CustomError("Category is required", 400);
  }
  if (!brand) {
    throw new CustomError("Brand is required", 400);
  }
  if (!cover_image) {
    throw new CustomError("Cover image is required", 400);
  }

  const product = new Product({
    name,
    price,
    stock,
    description,
    is_featured,
    new_arrival,
  });

  //id pass garxa ki gardaina check gareko
  const product_brand = await Brand.findOne({ _id: brand });
  if (!product_brand) {
    throw new CustomError("Brand is required", 400);
  }

  const product_category = await Category.findOne({ _id: category });
  if (!product_category) {
    throw new CustomError("Category is required", 400);
  }

  //if id pass garxa exist garxa vani
  product.category = product_category._id;
  product.brand = product_brand._id;

  // cover image
  const { path, public_id } = await uploadToCloud(cover_image[0].path, dir); //cover image ko 1st element ko path send garnay
  product.cover_image = {
    path,
    public_id,
  };

  //images
  if (images && Array.isArray(images) && images.length > 0) {
    // const promises = images.map(
    //   async (image) => await uploadToCloud(image.path, dir)
    // );
    // product.images = await Promise.all(promises);

    const product_images = await Promise.all(
      images.map(async (image) => await uploadToCloud(image.path, dir))
    ); //one line for upper code
    product.images = product_images;
  }

  await product.save();
  res.status(200).json({
    message: "Product created",
    status: "success",
    data: product,
  });
});

//update
export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const file = req.files;
  const { name, price, stock, description } = req.body;
});

//delete

export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id });
  if (!product) {
    throw new CustomError("Product not found", 400);
  }

  await deleteFile(product.cover_image.public_id);
  if (product.images) {
    await Promise.all(
      product.images.map(async (image) => await deleteFile(image.public_id))
    );
  }

  await product.deleteOne();
  res.status(200).json({
    message: "product deleted",
    status: "Success",
    data: product,
  });
});
//getByCategory
//getByBrand
//getAlllFeatured
//getAllNewArrivals
