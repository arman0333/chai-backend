import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
import { fileURLToPath } from "url";
import { ApiError } from "./apiError";

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME , 
  api_key:  process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const deleteImageCloudinary = async(url){
    try {
        cloudinary.uploader.destroy(url, function(error, result) {
            // console.log(result, error);
               throw new ApiError(400,"Cannot delete previous image in cloudinary ")
          });
    } catch (error) {

        throw new ApiError(400,error.message);
    }

}

export {deleteImageCloudinary};

