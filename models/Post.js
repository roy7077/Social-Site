const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"],
  },
  desc: {
    type: String,
    required: [true, "Description is required"],
    maxlength: [2000, "Description cannot exceed 2000 characters"],
  },
  image: {
    type: String, // Can store a base64 string or a URL to cloud storage
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
