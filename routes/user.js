
const express = require('express');
const users = express.Router();
const usercontroller = require('../controllers/user.controller')

//get profile User
users.get('/getInfoUser',usercontroller.getInfoUser)

//Update profile User 
users.put('/profileUser',usercontroller.UpdateProfile)




module.exports = users;