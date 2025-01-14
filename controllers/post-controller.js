const {Post,Tag,PostTagMapping}=require('../models');

/**
 * Create a Post with Tags
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

const createPost = async (req, res) => {
  try {
    const { title, desc, image, tags } = req.body;

    // Validate input
    if (!title || !desc) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ message: "Tags are required and should be an array." });
    }

    // Create the post
    const newPost = await Post.create({ title, desc, image });

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
    res.status(201).json({
      message: "Post created successfully.",
      post: newPost,
      tags: tagIds,
    });
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

module.exports = {
  createPost,
};
