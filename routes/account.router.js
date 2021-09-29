const express = require('express');
const account = express.Router();
const controller = require('../controllers/account.controller');
const CORS = require('../middleware/CORS')
const verifyToken = require("../middleware/auth");

/* GET users listing. */
/*Register Account User*/
account.post('/register', CORS, controller.register)

//Login account
account.post('/login', CORS, controller.login)

//find Phone
account.post('/getPhone',CORS,controller.getPhone)

//Forgot password

account.post('/Forgot',CORS,controller.fogotPassword)

//logout 
account.post("/Logout", verifyToken,controller.logoutAccount);

//reset Pasword
//account.post('/ResetPassword',CORS,controller.ResetPassword)
module.exports = account;
