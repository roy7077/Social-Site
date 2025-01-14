const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  desc: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String 
  },
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
