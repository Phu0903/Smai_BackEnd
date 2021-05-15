
const express = require('express');
const users = express.Router();
const UserController = require('../controllers/user.controller')

//get profile User
users.get('/getInfoUser',UserController.getInfoUser)

//Update profile User 
users.put('/profileUser',UserController.UpdateProfile)




module.exports = users;