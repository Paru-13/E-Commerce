import { create, getAll, getByID } from "../controllers/product.controller.js";
import express from "express";
import { uploadFile } from "../middlewares/multer.middleware.js";

const router = express.Router();
const upload = uploadFile();

//getAll
router.get("/", getAll);

//get By ID
router.get("/:id", getByID);

//create
router.post(
  "/",
  upload.fields([
    {
      name: "cover_image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  create
);

export default router;
