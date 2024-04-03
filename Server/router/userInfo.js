const express = require('express')
const expressJoi = require('@escook/express-joi')
//创建路由对象
const router = express.Router()
const userInfo_handler = require('../routerhandler/userInfo')
//const {update_userInfo_schema}=require("../schema/user")
const {
    update_password_schema
} = require("../schema/user")
//获取用户基本信息
router.get('/getUserInfo', userInfo_handler.userInfo)
//更新用户基本信息
router.post('/updateUserInfo', userInfo_handler.updateUserInfo)
//重置密码的路由
router.post('/updatePassword', expressJoi(update_password_schema), userInfo_handler.updatePassword)
router.get('/getAllUsers', userInfo_handler.allUsers)
router.post('/storeMessages', userInfo_handler.storeMessages)
router.get('/getMessages', userInfo_handler.getMessages)
router.post('/storeComment', userInfo_handler.storeComment)
router.get('/getCommentWithReplies', userInfo_handler.getCommentWithReplies)
router.get('/getComments', userInfo_handler.getComments)
module.exports = router