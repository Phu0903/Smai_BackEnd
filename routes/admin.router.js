const express = require('express');
const admin = express.Router();
const controller = require('../controllers/admin.controller');
const verifyToken = require('../middleware/auth')
const CORS = require('../middleware/CORS')
const checkAdmin = require('../middleware/CheckAdmin')
const verifyTokenAdmin = require('../middleware/authAdmin')
/* GET users listing. */

admin.get('/all-account', verifyTokenAdmin, checkAdmin, CORS, controller.getAllAccount);
admin.get('/home', verifyTokenAdmin, checkAdmin, CORS, controller.home)
//this function allow admin to edit every account
//the req.body must contain new(UserName, Password, Rule, PhoneNumber)
//if any parameter above undefine, it will be default with the value 
admin.post('/edit-account', verifyTokenAdmin, checkAdmin, CORS, controller.editAccount);
admin.post('/remove-account', verifyTokenAdmin, checkAdmin, CORS, controller.removeAccount);
admin.get('/view-account', verifyTokenAdmin, checkAdmin, CORS, controller.viewAccount)
admin.get('/login', controller.loginGet);
admin.post('/login', controller.loginPost);
admin.get('/all-user', verifyTokenAdmin, checkAdmin, CORS, controller.getAllUser);
admin.post('/remove-user', verifyTokenAdmin, checkAdmin, CORS, controller.removeUser);
admin.post('/edit-user', verifyTokenAdmin, checkAdmin, CORS, controller.editUserPost);
admin.get('/edit-user', verifyTokenAdmin, checkAdmin, CORS, controller.editUserGet);
admin.get('/view-user', verifyTokenAdmin, checkAdmin, CORS, controller.viewUser)

admin.get('/all-post', verifyTokenAdmin, checkAdmin, CORS, controller.getAllPost)

module.exports = admin;