const express = require('express');
const account = express.Router();
const controller = require('../controllers/account.controller');
const CORS = require('../middleware/CORS')

/* GET users listing. */
/*Register Account User*/
account.post('/register', CORS, controller.register)

//Login account
account.post('/login', CORS, controller.login)

//find Phone
account.post('/getPhone',CORS,controller.getPhone)




module.exports = account;
