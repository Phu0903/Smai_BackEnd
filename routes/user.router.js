
const express = require('express');
const userController = require('../controllers/user.controller');
const users = express.Router();
const usercontroller = require('../controllers/user.controller')
const verifyToken = require('../middleware/auth')
const CORS = require('../middleware/CORS')
const fileUploader = require('../configs/cloudinary.config');


//get profile user by token
users.get('/getInForUserByTokenId', verifyToken, CORS, usercontroller.getInfoUserById);

//get profile User by userName
users.get('/getInfoUser', CORS, usercontroller.getInfoUser)

//Update profile User 
users.put('/profileUser', verifyToken, fileUploader.single('imageUser'),CORS, usercontroller.UpdateProfile)

//Get address user

users.get('/getAddress', verifyToken, CORS, userController.getAddress);


users.get('/getAddress',verifyToken,userController.getAddress);
//Get PhoneNumber User
users.get('/getPhonNumber',userController.getPhonNumber)




module.exports = users;