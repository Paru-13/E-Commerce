import mongoose from "mongoose";
import { MONGO_CONFIG } from "./config.js";


//mongoDB connection
export const connectDB = () => {
  mongoose
    .connect(MONGO_CONFIG.uri, {
      dbName: MONGO_CONFIG.db_name,
      autoCreate: true,
    })
    .then(() => {
      console.log("Database Connected");
    })
    .catch((error) => {
      console.log(error);
    });
};
