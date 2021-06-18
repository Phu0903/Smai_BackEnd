const express = require('express');
const baipost = express.Router();
const controller = require('../controllers/post.controller');
const verifyToken = require('../middleware/auth')
const CORS = require('../middleware/CORS')
const multer = require('multer')
const fileUploader = require('../configs/cloudinary.config');

///Create post
baipost.post('/CreatePost', verifyToken, fileUploader.array('productImage'), CORS, controller.AddPost)
//updatePost
baipost.post('/UpdatePost', fileUploader.array('productImage'), CORS, controller.UpdateProductInPost);
//Get post
baipost.get('/getFullPost', CORS, controller.GetInfoFullPost);
//Get post by AccountID
baipost.get('/getPostByAccountId', verifyToken, CORS, controller.GetPostByAccountID);
//Get Post by Location
baipost.get('/getFullPostByLocation', CORS, controller.GetDetailPostByAddress);
//Get Post by TypeAuthor

baipost.get('/getPostByTypeAuthor', CORS, controller.GetPostByTypeAuthor);

//TestUpload

baipost.get('/getNewPost', CORS, controller.GetNewPost);
//TesstToken
/*baipost.post('/TestToken',verifyToken,controller.TestToke)
//Test post image
baipost.post('/TestIamge',verifyToken, fileUploader.array('productImage'),controller.TestImage)*/

module.exports = baipost;