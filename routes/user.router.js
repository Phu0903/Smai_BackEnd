
const express = require('express');
const userController = require('../controllers/user.controller');
const users = express.Router();
const usercontroller = require('../controllers/user.controller')
const verifyToken = require('../middleware/auth')

//get profile user by token
users.get('/getInForUserByTokenId',verifyToken,usercontroller.getInfoUserById);

//get profile User by userName
users.get('/getInfoUser',usercontroller.getInfoUser)

//Update profile User 
users.put('/profileUser',verifyToken,usercontroller.UpdateProfile)

//Get address user
users.get('/getAddress',verifyToken,userController.getAddress);
//Get PhoneNumber User
users.get('/getPhonNumber',userController.getPhonNumber)



module.exports = users;