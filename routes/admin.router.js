const express = require('express');
const admin = express.Router();
const controller = require('../controllers/admin.controller');
const verifyToken = require('../middleware/auth')

/* GET users listing. */

admin.get('/infor-account', verifyToken, controller.getAllAccount);

module.exports = admin;