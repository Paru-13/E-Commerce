import express from "express";
import {
  create,
  getAll,
  getByID,
  remove,
  update,
} from "../controllers/product.controller.js";
import { uploadFile } from "../middlewares/multer.middleware.js";
import { USER_ROLE } from "./../constants/enums.constant.js";
import { authenticate } from './../middlewares/authenticate.middleware.js';

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
  authenticate([USER_ROLE.ADMIN]),
  create
);

//update
router.put(
  "/:id",
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
  // authenticate([USER_ROLE.ADMIN]),
  update
);

router.delete("/:id", authenticate([USER_ROLE.ADMIN]), remove);

export default router;
