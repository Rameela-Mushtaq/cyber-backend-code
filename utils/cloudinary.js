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

// Function to upload file directly to Cloudinary
const imageOnCloudinary = async (buffer, folderName, fileName) => {
  try {
      const base64String = buffer.toString('base64');
      const dataUri = `data:image/jpeg;base64,${base64String}`; // Default to image/jpeg for safety

      // Dynamically detect content type and adjust
      const mimeType = buffer.readUInt8(0); // First byte helps determine content type
      let contentType = 'image/jpeg';

      if (mimeType === 0x66) {
          contentType = 'video/mp4'; // Assuming videos are mp4, could be dynamic
      }

      // Upload to Cloudinary with dynamic mime type
      const result = await cloudinary.uploader.upload(dataUri, {
          folder: folderName,
          public_id: fileName, // Optional: custom name
          resource_type: contentType.includes('video') ? 'video' : 'image',
      });

      return {
          secure_url: result.secure_url,
          public_id: result.public_id,
      };
  } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error(error);
  }
};
  
  export { imageOnCloudinary };