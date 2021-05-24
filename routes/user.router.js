
const express = require('express');
const userController = require('../controllers/user.controller');
const users = express.Router();
const usercontroller = require('../controllers/user.controller')
const verifyToken = require('../middleware/auth')
//get profile User
users.get('/getInfoUser',usercontroller.getInfoUser)

//Update profile User 
users.put('/profileUser',verifyToken,usercontroller.UpdateProfile)

//Get address user
users.get('/getAddress',verifyToken,userController.getAddress);




module.exports = users;