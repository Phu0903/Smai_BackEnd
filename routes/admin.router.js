const express = require('express');
const admin = express.Router();
const controller = require('../controllers/admin.controller');
const verifyToken = require('../middleware/auth')
const CORS = require('../middleware/CORS')
const checkAdmin = require('../middleware/CheckAdmin')
/* GET users listing. */

admin.get('/all-account', CORS, controller.getAllAccount);
//this function allow admin to edit every account
//the req.body must contain new(UserName, Password, Rule, PhoneNumber)
//if any parameter above undefine, it will be default with the value 
admin.post('/edit-account', verifyToken, checkAdmin, CORS, controller.editAccount);
admin.post('/remove-account', verifyToken, checkAdmin, CORS, controller.removeAccount);

admin.get('/all-user', verifyToken, checkAdmin, CORS, controller.getAllUser);
admin.post('/remove-user', verifyToken, checkAdmin, CORS, controller.removeUser);
admin.post('/edit-user', verifyToken, checkAdmin, CORS, controller.editUser);

admin.get('/all-post', verifyToken, checkAdmin, CORS, controller.getAllPost)

module.exports = admin;