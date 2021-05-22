const express = require('express');
const baipost = express.Router();
const controller = require('../controllers/post.controller');
const verifyToken = require('../middleware/auth')



///Create post
baipost.post('/CreatePost',verifyToken,controller.AddPost)


//Get post
baipost.get('/getFullPost',controller.GetInfoFullPost);
//Get Post by Location
baipost.get('/getFullPostByLocation',controller.GetDetailPostByAddress);
//Get Post by TypeAuthor
baipost.get('/getPostByTypeAuthor',controller.GetPostByTypeAuthor);
module.exports = baipost;