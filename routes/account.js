
var express = require('express');
var account = express.Router();
var controller = require('../controllers/User.controller');

/* GET users listing. */
/*Register Account User*/
account.post('/register', controller.register)

//Login account
account.post('/login',controller.login)




module.exports = account;
