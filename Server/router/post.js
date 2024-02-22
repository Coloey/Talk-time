const express=require('express')
const expressJoi=require('@escook/express-joi')
//创建路由对象
const router=express.Router()
const post_handler = require('../routerhandler/post')
router.post('/storePostContent', post_handler.storePost)
router.get('/getPosts', post_handler.getPosts)
router.post('/updatePost', post_handler.updatePost)
router.post('/updateLikes', post_handler.updateLikes)
router.post('/updatePostCommentCount', post_handler.updatePostCommentCount)
router.post('/updateCommentLikes',post_handler.updateCommentLikes)
module.exports=router