const express=require('express');
const { validatePost } = require('../../middlewares/post-middleware');
const { createPost } = require('../../controllers/post-controller');
const router=express.Router();

router.post('/create-post',validatePost,createPost);

module.exports=router;