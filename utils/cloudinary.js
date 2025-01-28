import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()
 // Configuration
 cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET // Click 'View API Keys' above to copy your API secret
});

const imageOnCloudinary = async (filePath, folderName) =>  {
    try {
        //upload image from server to cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folderName
        });

        //delete image from server
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            console.log("Failed to delete image from server", error)
        }
        
        console.log(result);
        return {
            secure_url: result.secure_url,
            public_id: result.public_id,
        }
    } catch (error) {
        throw new Error(error);
    }
}

export {imageOnCloudinary};