const express = require('express');
const baipost = express.Router();
const controller = require('../controllers/post.controller');
const verifyToken = require('../middleware/auth')
baipost.post('/CreatePost',verifyToken,controller.AddPost);
baipost.get('/getPost',controller.GetInfoPost);

module.exports = baipost;