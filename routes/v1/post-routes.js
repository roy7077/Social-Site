const express=require('express');
const { validatePost } = require('../../middlewares/post-middleware');
const { createPost, getAllPosts } = require('../../controllers/post-controller');
const router=express.Router();

router.post('/create-post',validatePost,createPost);
router.get('/posts', getAllPosts);
module.exports=router;