const express = require('express');
const baipost = express.Router();
const controller = require('../controllers/post.controller');
const verifyToken = require('../middleware/auth')
const multer  = require('multer')
const fileUploader = require('../configs/cloudinary.config');




///Create post
baipost.post('/CreatePost',verifyToken, fileUploader.array('productImage'),controller.AddPost)


//Get post
baipost.get('/getFullPost',controller.GetInfoFullPost);
//Get Post by Location
baipost.get('/getFullPostByLocation',controller.GetDetailPostByAddress);
//Get Post by TypeAuthor
baipost.get('/getPostByTypeAuthor',controller.GetPostByTypeAuthor);
//TestUpload
module.exports = baipost;