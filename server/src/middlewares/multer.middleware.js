import multer from "multer";
import fs from "fs";
import path from "path";
import CustomError from "./errorHandler.middleware.js";

/*-creating middleware so we can use same code for multiple router to upload images/files
-upload logic to reuse multiple times
*/
export const uploadFile = (dir = "/") => {
  //path connect garera check garnay file exist garxa ki gardaina
  const upload_path = "./uploads" + dir; //uploads vitra kun folder rakhnay

  const file_size = 5 * 1024 * 1024; //5 * kilobyte * megabyte = 5MB Fileszie

  const allowed_ext = ["png", "jpg", "jpeg", "pdf", "webp", "svg"];

  //file exist gardaina vani, file same folder ma create garna paryo
  if (!fs.existsSync(upload_path)) {
    fs.mkdirSync(upload_path, { recursive: true });
  }

  //diskStorage create garera, kata upload garnay & file ko name k dinay
  const my_storage = multer.diskStorage({
    destination: (req, file, cb) => {
      //upload kata garnay, cb=callback function
      cb(null, upload_path); //if error=null pass garxa, thikxa vani kun path folder create garnay ho
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });

  //fileFilter- kasto file extension lai support garnay
  const file_filter = (req, file, cb) => {
    const file_ext = path.extname(file.originalname).replace(".", "");
    const is_allowed = allowed_ext.includes(file_ext);

    if (is_allowed) {
      cb(null, true);
    } else {
      cb(
        new CustomError(
          `${file_ext} format is not allowed.${allowed_ext.join(
            ","
          )}formats allowed`
        ),
        400
      );
    }
  };

  //creating multer upload instance
  const upload = multer({storage: my_storage,limits: { fileSize: file_size },fileFilter: file_filter,}); //destination- filename where image store garxa
  return upload;
};
