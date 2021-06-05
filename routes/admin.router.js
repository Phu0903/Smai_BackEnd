const express = require('express');
const admin = express.Router();
const controller = require('../controllers/admin.controller');
const verifyToken = require('../middleware/auth')
const checkAdmin = require('../middleware/CheckAdmin')
/* GET users listing. */

admin.get('/infor-account', verifyToken, checkAdmin, controller.getAllAccount);
//this function allow admin to edit every account
//the req.body must contain new(UserName, Password, Rule, PhoneNumber)
//if any parameter above undefine, it will be default with the value 
admin.post('/edit-account', verifyToken, checkAdmin, controller.editAccount);

module.exports = admin;