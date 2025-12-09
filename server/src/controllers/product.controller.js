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

//*create
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

//*update
export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;

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

  const { cover_image, images } = req.files;
  const product = await Product.findById(id);
  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (description) product.description = description;
  if (is_featured) product.is_featured = is_featured;
  if (new_arrival) product.new_arrival = new_arrival;

  if (category) {
    const new_category = await Category.findById(category);
    if (!new_category) {
      throw new CustomError("Category not found", 404);
    }

    product.category = new_category._id;
  }

  if (brand) {
    const new_brand = await Brand.findById(brand);
    if (!new_brand) {
      throw new CustomError("Brand not found", 404);
    }

    product.brand = new_brand._id;
  }

  //cover_image
  if (cover_image) {
    if (product.cover_image) {
      //if cover image already exist xa vani delete garnay
      await deleteFile(product.cover_image.public_id);
    }
    const { path, public_id } = await uploadToCloud(cover_image[0].path, dir);

    product.cover_image = {
      path,
      public_id,
    };
  }

  //images
  if (images && Array.isArray(images) && images.length > 0) {
    if (product.images) {
      const promises = product.images.map(
        async (image) => await deleteFile(image.public_id)
      );
      await Promise.all(promises);

      // await Promise.all(images.map(async (image) => await deleteFile(image.public_id)))
    }


    //upload images
    const new_images = await Promise.all(
      images.map(async (img) => await uploadToCloud(img.path, dir))
    );

    product.images = new_images;
  }
    await product.save();
    res.status(200).json({
      message: "Product updated",
      status: "success",
      data: product,
    });
  
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
    data: null,
  });
});

//getByCategory
export const getBycategory = asyncHandler(async(req,res)=>{
  const {category_id} = req.params
  const product = await Product.find({category: category_id}).populate('category').populate('brand')

  res.status(200).json({
    message: 'Products fetched',
    status: "success",
    data: product

  })
})

//getByBrand
export const getBybrand = asyncHandler(async(req,res)=>{
  const {brand_id} = req.params
  const product = await Product.find({brand: brand_id}).populate('category').populate('brand')

  res.status(200).json({
    message: 'Products fetched',
    status: "success",
    data: product

  })
})

//getAlllFeatured
export const getAlllFeatured = asyncHandler(async(req,res)=>{
   const product = await Product.find({is_featured:true}).populate('category').populate('brand')

  res.status(200).json({
    message: 'Products fetched',
    status: "success",
    data: product

  })
})

//getAllNewArrivals
export const getNewArrivals = asyncHandler(async(req,res)=>{
   const product = await Product.find({new_arrival:true}).populate('category').populate('brand')

  res.status(200).json({
    message: 'Products fetched',
    status: "success",
    data: product

  })
})


