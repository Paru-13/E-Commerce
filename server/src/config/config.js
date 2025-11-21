export const MONGO_CONFIG = {
  uri: process.env.MONGODB_URI,
  db_name: process.env.DB_NAME,
};


//cloudinary.config in config, take from env
export const cloudinary_config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
};


//JWT utils config
export const JWT_config ={
  secret: process.env.JWT_SECRET,
  expires_in: process.env.JWT_EXPIRES_IN
}