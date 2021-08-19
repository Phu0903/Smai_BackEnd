const express = require('express');
const baipost = express.Router();
const controller = require('../controllers/post.controller');
const verifyToken = require('../middleware/auth')
const CORS = require('../middleware/CORS')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
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
//delete Post
baipost.delete('/deletePostbyUser',CORS,controller.DeletePost);
//find
baipost.get('/find',CORS,controller.FindId);
//Find Post 
baipost.get('/searchPost',CORS,controller.searchPost);

baipost.post('/upload', upload.single('productImage'),(req , res) => {
    console.log(req.file)
  });
module.exports = baipost;