const express = require('express');
const client = express.Router();
const controller = require('../../controllers/frontendController/authentication');
const CORS = require('../../middleware/CORS')

//Login account
client.get('/login', CORS, controller.loginGet)
client.post('/login', CORS, controller.loginPost)
client.get('/register', CORS, controller.registerGet)
client.post('/register', CORS, controller.registerPost)

module.exports = client;
