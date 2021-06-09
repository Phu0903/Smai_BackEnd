const argon2d = require('argon2');
const Account = require('../Model/Account');
const User = require('../Model/User')
const jwt = require('jsonwebtoken');
require("dotenv").config();


module.exports = {
  //Login
  login: async (req, res) => {
    const { UserName, Password } = req.body
    console.log(req.body)
    if (!UserName || !Password)
      return res
        .status(400)
        .json({
          success: false,
          message: "Missing user name or password"
        })
    try {
      const user = await Account.findOne({ 'UserName': UserName })
      if (!user)
        return res
          .status(500)
          .json({
            success: false,
            message: "UserName error."
          })
      const passwordValid = await argon2d.verify(user.Password, Password)
      if (!user || !passwordValid)
        return res
          .status(400)
          .json({
            success: false,
            'message': 'Incorrect username or password'
          })
      const accessToken = jwt.sign(
        { accountID: user._id },
        process.env.ACCESS_TOKEN_SECRET
      )
      res.json({
        success: true,
        "message": "OK",
        "accessToken": accessToken,
      })

    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  },

  //register
  register: async (req, res) => {
    const { UserName, Password, PhoneNumber, Address, FullName } = req.body
  
    
    if (!PhoneNumber || !Password) {
      console.log("1");
      return res
        .status(400)
        .json({
          success: false,
          "message": "PhoneNumber or Password not exist"
        })
    }
   
    try {
      const user = await Account.findOne({ 'PhoneNumber': PhoneNumber })
      console.log(user)
      if (user) {
        return res
          .status(400)
          .json({
            success: false,
            "message": 'PhonNumber already taken'
          })
      }
      else {
        const hashedPassword = await argon2d.hash(Password)//hasd pass word by argon 
        const data = new Account({
         
          'Password': hashedPassword,
          'PhoneNumber': PhoneNumber,
          'Rule': 1
        })
        const UserDetail = new User({
         
          'PhoneNumber': PhoneNumber,
          'AccountID': data._id,
          'FullName': FullName,
          'Address': Address
        })
        const accessToken = jwt.sign(
          { accountID: data._id },
          process.env.ACCESS_TOKEN_SECRET)

        data.save(function (err) {
         
          UserDetail.save(),
            res.status(201)
              .json({
                success: true,
                "message": "OK",
                "accessToken": accessToken, //Respone token for client user

              })
        });
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({
        success: false,
        "message": err.message
      });
    }
  }
}