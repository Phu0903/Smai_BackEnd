const express = require('express');
const admin = express.Router();
const controller = require('../controllers/admin.controller');
const verifyToken = require('../middleware/auth')
const checkAdmin = require('../middleware/CheckAdmin')
/* GET users listing. */

admin.get('/all-account', verifyToken, checkAdmin, controller.getAllAccount);
//this function allow admin to edit every account
//the req.body must contain new(UserName, Password, Rule, PhoneNumber)
//if any parameter above undefine, it will be default with the value 
admin.post('/edit-account', verifyToken, checkAdmin, controller.editAccount);
admin.post('/remove-account', verifyToken, checkAdmin, controller.removeAccount);

admin.get('/all-user', verifyToken, checkAdmin, controller.getAllUser);
admin.post('/remove-user', verifyToken, checkAdmin, controller.removeUser);
admin.post('/edit-user', verifyToken, checkAdmin, controller.editUser);

admin.get('/all-post', verifyToken, checkAdmin, controller.getAllPost)

module.exports = admin;