import CustomError from "../middlewares/errorHandler.middleware.js";
import Category from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { deleteFile, uploadToCloud } from "../utils/cloudinary.utils.js";

//create category
export const create = asyncHandler(async (req, res) => {
  const { name, description } = req.body; //get name & desc from req.body
  const file = req.file; //File uploaded from client (image)
  const category = new Category({ name, description }); //Create category object-new class

  if (!name) {
    throw new CustomError("Name is required", 400);
  }

  //image-If image is uploaded, upload it to Cloudinary
  if (file) {
    const { path, public_id } = await uploadToCloud(file.path, "/categories");
    category.image = {
      path,
      public_id,
    };
  }

  await category.save(); // Save category to database

  res.status(201).json({
    message: "Category created",
    status: "success",
    data: category, //model(Category) use garera create gareko data(category) lai pass garnay
  });
});

//get all
export const getAll = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.status(200).json({
    message: "Category fetched",
    status: "success",
    data: categories,
  });
});

//get by ID
export const getByID = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById({ _id: id });

  if (!category) {
    throw new CustomError("Category not found", 404);
  }

  res.status(200).json({
    message: "Category fetched",
    status: "success",
    data: category,
  });
});

//update
export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const file = req.file;

  const category = await Category.findOne({ id });
  if (!category) {
    throw new CustomError("Category not found", 404);
  }

  if (name) {
    category.name = name;
  }
  if (description) {
    category.description = description;
  }
  if (file) {
    if (category.image) {
      //paila ko img delete garnay
      await deleteFile(category.image?.public_id);
    }

    const { public_id, path } = await uploadToCloud(file.path,'/categories');
    category.image = {
      path,
      public_id,
    };
  }
  res.status(200).json({
    message: "Category updated",
    status: "success",
    data: category,
  });

  await category.save();
});

//delete
export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findOne({ _id: id });

  if (!category) {
    throw new CustomError("Category not found", 404);
  }

  if (category.image) {
    //image lai option ma rakheko, user lay jun category dlt garna khojeko ho tya img xa vani mtra dlt garnay otherwise yo part run hudaina
    await deleteFile(category.image?.public_id);
  }
  await category.deleteOne();

  res.status(200).json({
    message: "Category deleted",
    status: "success",
    data: null,
  });
});
