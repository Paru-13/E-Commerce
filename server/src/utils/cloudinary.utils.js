import cloudinary from "../config/cloudinary.config.js"
import CustomError from "../middlewares/errorHandler.middleware.js"
import fs from 'fs'

// Function to upload a file to Cloudinary
export const uploadToCloud = async(file, dir = '/')=>{
    try {
        const folder = "E-commerce" + dir
        const {public_id, secure_url} = await cloudinary.uploader.upload(file,{   // Upload file to Cloudinary
            folder: folder,  // folder path in Cloudinary
            unique_filename: true  // auto-generate unique file name
        })

        //*delete image after uploading to Cloudinary
        if(fs.existsSync(file)){
            fs.unlinkSync(file)
        }

        // Return Cloudinary image details
        return{
            public_id,
            path: secure_url  // final image URL
        }
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new CustomError('upload file error', 500)
    }
}


//Delete file
export const deleteFile = async(public_id)=>{
try {
    await cloudinary.uploader.destroy(public_id)
} catch (error) {
    console.log(error)
    throw new CustomError('Delete file error', 500)
}
}