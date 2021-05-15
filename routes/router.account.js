
const express = require('express');
const account = express.Router();
const controller = require('../controllers/account.controller');

/* GET users listing. */
/*Register Account User*/
account.post('/register', controller.register)

//Login account
account.post('/login',controller.login)




module.exports = account;
