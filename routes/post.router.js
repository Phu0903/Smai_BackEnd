const express = require('express');
const baipost = express.Router();
const controller = require('../controllers/post.controller');
const verifyToken = require('../middleware/auth')
const CORS = require('../middleware/CORS')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
const fileUploader = require('../configs/cloudinary.config');

///Create post
baipost.post('/CreatePost', verifyToken, fileUploader.array('productImage'), CORS, controller.addPost)
//updatePost
baipost.post('/UpdatePost', fileUploader.array('productImage'), CORS, controller.updateProductInPost);
//Get post
baipost.get('/getFullPost', CORS, controller.getInfoFullPost);
//Get post by AccountID
baipost.get('/getPostByAccountId', verifyToken, CORS, controller.getPostByAccountID);
//Get Post by Location
baipost.get('/getFullPostByLocation', CORS, controller.getDetailPostByAddress);
//Get Post by TypeAuthor
baipost.get('/getPostByTypeAuthor', CORS, controller.getPostByTypeAuthor);
//TestUpload
baipost.get('/getNewPost', CORS, controller.getNewPost);
//delete Post
baipost.delete('/deletePostbyUser',CORS,controller.deletePost);
//find
baipost.get('/find',CORS,controller.findId);
//Find Post 
baipost.get('/searchPost',CORS,controller.searchPost);

baipost.post("/upload", fileUploader.single("productImage"), (req, res) => {
   if (!req.file) {
     next(new Error("No file uploaded!"));
     return;
   }

   res.json({ secure_url: req.file.path });
});
baipost.put("/update-post", CORS, controller.updatePost);

baipost.get("/post-need-help",controller.getPostUserNeedHelp)
///Admin 
baipost.delete("/delete-all-post",controller.deletePostAdmin)
module.exports = baipost;