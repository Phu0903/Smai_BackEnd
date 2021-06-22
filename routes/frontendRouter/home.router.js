const express = require('express');
const client = express.Router();
const controller = require('../../controllers/frontendController/home');
const CORS = require('../../middleware/CORS')
const verifyToken = require('../../middleware/auth_web')

client.get('/', verifyToken, CORS, controller.getProduct);

client.get('/view-post', verifyToken, CORS, controller.getDetail)


module.exports = client;