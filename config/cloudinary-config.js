const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Function to upload image to Cloudinary
const uploadImageToCloudinary = async (file, folder, height, quality) => {
    try {
        // Ensure the 'file' and 'file.tempFilePath' exist
        if (!file || !file.tempFilePath) {
            throw new Error("No file or invalid file path provided.");
        }

        const options = {
            folder, // Folder in Cloudinary where the image will be stored
            resource_type: 'auto', // Automatically detect resource type (image, video, etc.)
        };

        // Optional parameters for image height and quality
        if (height) options.height = height;
        if (quality) options.quality = quality;

        // Upload the image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, options);
        
        return uploadResponse;
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error.message);
        throw new Error("Error uploading image to Cloudinary.");
    }
};

module.exports = uploadImageToCloudinary;
