const {Post,Tag,PostTagMapping}=require('../models');
const {errorResponse,successResponse}=require('../utils');
const {uploadImageToCloudinary}=require('../config');
const mongoose = require('mongoose');
const {logger}=require('../config');
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
    logger.error(`Error creating post:, ${error.message}`)
    console.error("Error creating post:", error.message);
    errorResponse.message="Internal server error",
    errorResponse.error=error.message;
    res.status(500).json(errorResponse);
  }
};



// get all post on different filtering
const getAllPosts = async (req, res) => {
  try {
      const {
          page = 1, // Default page number
          limit = 10, // Default posts per page
          sort = 'createdAt', // Default sorting field
          order = 'desc', // Default sorting order
          keyword, // Keyword to filter posts
          tag // Tag to filter posts
      } = req.query;

      // Validate query parameters
      const allowedParams = ['page', 'limit', 'sort', 'order', 'keyword', 'tag'];
      const extraParams = Object.keys(req.query).filter(
          (param) => !allowedParams.includes(param)
      );

      if (extraParams.length > 0) {
          return res.status(400).json({
              success: false,
              message: `Invalid query parameters: ${extraParams.join(', ')}`
          });
      }

      // Pagination calculation
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Filters
      const filters = {};
      if (keyword) {
          filters.$or = [
              { title: { $regex: keyword, $options: 'i' } },
              { desc: { $regex: keyword, $options: 'i' } }
          ];
      }
                                       
      // Fetch posts by tag if provided
      if (tag) {
          const tagRecord = await Tag.findOne({ name: tag.toLowerCase() });
          if (!tagRecord) {
              return res.status(404).json({
                  success: false,
                  message: `No posts found for the tag: ${tag}`
              });
          }

          const mappings = await PostTagMapping.find({ tagId: tagRecord._id });
          const postIds = mappings.map((mapping) => mapping.postId);
          filters._id = { $in: postIds };
      }

      // Fetch posts with applied filters, pagination, and sorting
      const posts = await Post.find(filters)
          .sort({ [sort]: order === 'asc' ? 1 : -1 })
          .skip(skip)
          .limit(parseInt(limit));

      const totalPosts = await Post.countDocuments(filters);

      // Respond with paginated posts
      return res.status(200).json({
          success: true,
          message: "Posts fetched successfully.",
          data: {
              totalPosts,
              totalPages: Math.ceil(totalPosts / limit),
              currentPage: parseInt(page),
              posts
          }
      });
  } catch (error) {
      logger.error(`Error fetching posts:, ${error.message}`);
      console.error("Error fetching posts:", error.message);
      return res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message
      });
  }
};

module.exports = {
  createPost,
  getAllPosts
};
