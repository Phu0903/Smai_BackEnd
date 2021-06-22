const express = require('express');
const client = express.Router();
const controller = require('../../controllers/frontendController/home');
const CORS = require('../../middleware/CORS')

client.get('/', CORS, controller.getProduct);

client.get('/productDetail',CORS,controller.getDetail)
module.exports = client;