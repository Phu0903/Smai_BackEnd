const express = require('express');
const baipost = express.Router();
const controller = require('../controllers/post.controller');
const verifyToken = require('../middleware/auth')
const multer  = require('multer')
const fileUploader = require('../configs/cloudinary.config');




///Create post
baipost.post('/CreatePost',verifyToken, fileUploader.array('productImage'),controller.AddPost)
//updatePost
baipost.put('/UpdatePost',controller.UpdateProductInPost);
//Get post
baipost.get('/getFullPost',controller.GetInfoFullPost);
//Get Post by Location
baipost.get('/getFullPostByLocation',controller.GetDetailPostByAddress);
//Get Post by TypeAuthor
baipost.get('/getPostByTypeAuthor',controller.GetPostByTypeAuthor);
//TestUpload

baipost.get('/getNewPost',controller.GetNewPost);
//TesstToken
baipost.post('/TestToken',verifyToken,controller.TestToke)
//Test post image
baipost.post('/CreatePost',verifyToken, fileUploader.array('productImage'),controller.TestImage)

module.exports = baipost;