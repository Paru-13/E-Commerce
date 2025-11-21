import CustomError from "../middlewares/errorHandler.middleware.js";
import Brand from "../models/brand.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { deleteFile, uploadToCloud } from "../utils/cloudinary.utils.js";

//getALL
export const getAll = asyncHandler(async (req, res) => {
  const brands = await Brand.find({});
  res.status(200).json({
    message: "Brand fetched",
    status: "Success",
    data: brands,
  });
});

//get by ID
export const getByID = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const brand = await Brand.findById({ _id: id });

  if (!brand) {
    throw new CustomError("Brand not found", 400);
  }
  res.status(200).json({
    message: "Brand fetched",
    status: "Success",
    data: brand,
  });
});

//create
export const create = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const file = req.file;
  const brand = new Brand({ name, description });

  if (!file) throw new CustomError("Image is required", 400);

  const { public_id, path } = await uploadToCloud(file.path, "/brands");
  brand.image = {
    path,
    public_id,
  };

  await brand.save();

  res.status(201).json({
    message: "Brand created",
    status: "Success",
    data: brand,
  });
});

//update
export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const file = req.file;
  const { name, description } = req.body;

  const brand = await Brand.findOne({_id:id });
  if (!brand) {
    throw new CustomError("Brand not found", 400);
  }

  if (name) {
    brand.name = name;
  }

  if (description) brand.description = description;

  if (file) {
    const { public_id, path } = await uploadToCloud(file.path, "/brands");
    if (brand.image) {
      await deleteFile(brand.image?.public_id);
    }
    brand.image = {
      path,
      public_id,
    };
  }
  await brand.save();

  res.status(200).json({
    message: "Brand updated",
    status: "Success",
    data: brand,
  });
});

//delete
export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const brand = await Brand.findOne({ _id: id });

  if (!brand) {
    throw new CustomError("Brand not dfound", 400);
  }

  if (brand.image) {
    await deleteFile(brand.image?.public_id);
  }

  await brand.deleteOne();
  res.status(200).json({
    message: "Brand deleted",
    status: "Success",
    data: brand,
  });
});
