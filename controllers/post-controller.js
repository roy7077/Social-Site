const {Post,Tag,PostTagMapping}=require('../models');
const {errorResponse,successResponse}=require('../utils');
const {uploadImageToCloudinary}=require('../config');
require('dotenv').config();

/**
 * Create a Post with Tags
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

// Controller to create a new post
const createPost = async (req, res) => {
  try {
    
    // Extract data from the request body
    const { title, desc, image, tags } = req.body;
    
    // get image from req's body
    const thumbnail=req.files.image;

    // upload to cloudnary
    const imageLink= await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

    // Create the post
    const newPost = await Post.create({ title, desc, image:imageLink.secure_url });

    // Process tags: Ensure tags exist or create new ones
    const tagIds = await Promise.all(
      tags.map(async (tagName) => {
        const tag = await Tag.findOneAndUpdate(
          { name: tagName.toLowerCase().trim() }, // Normalize tag names
          { name: tagName.toLowerCase().trim() },
          { upsert: true, new: true }
        );
        return tag._id;
      })
    );

    // Map tags to the post
    await Promise.all(
      tagIds.map((tagId) => PostTagMapping.create({ postId: newPost._id, tagId }))
    );

    // Respond with the created post and its tags
    successResponse.message="Post created successfully."
    successResponse.data={
      newPost,
      tagIds
    }

    res.status(201).json(successResponse);
  } catch (error) {
    console.error("Error creating post:", error.message);
    errorResponse.message="Internal server error",
    errorResponse.error=error.message;
    res.status(500).json(errorResponse);
  }
};

module.exports = {
  createPost,
};
