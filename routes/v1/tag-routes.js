const express=require('express');
const { validateTag } = require('../../middlewares/tag-middleware');
const { createTag } = require('../../controllers/tag-controller');
const router=express.Router();

router.post('/create-tag',validateTag,createTag);

module.exports=router;