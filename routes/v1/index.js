const express=require('express');
const router=express.Router();
const postRoutes=require('./post-routes');
const tagRoutes=require('./tag-routes');

router.use('/post',postRoutes);
router.use('/tag',tagRoutes);

module.exports=router;