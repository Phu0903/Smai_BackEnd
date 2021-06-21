const express = require('express');
const client = express.Router();
const controller = require('../../controllers/frontendController/authentication');
const CORS = require('../../middleware/CORS')

//Login account
client.get('/login', CORS, controller.loginGet)

module.exports = client;
