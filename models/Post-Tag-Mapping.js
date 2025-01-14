const mongoose = require('mongoose');

const postTagMappingSchema = new mongoose.Schema({
  postId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post', 
    required: true 
  },
  tagId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tag', 
    required: true 
  },
}, { timestamps: true });

postTagMappingSchema.index({ postId: 1, tagId: 1 }, { unique: true });

module.exports = mongoose.model('PostTagMapping', postTagMappingSchema);
