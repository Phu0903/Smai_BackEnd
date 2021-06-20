const argon2d = require('argon2');
const Account = require('../Model/Account');
const User = require('../Model/User')
const jwt = require('jsonwebtoken');
const { use } = require('../routes/post.router');
const { json } = require('express');
const { findOne } = require('../Model/Account');
const account = require('../routes/account.router');
require("dotenv").config();
module.exports = {
  //Login
  login: async (req, res) => {
    const { PhoneNumber, Password } = req.body
    if (!PhoneNumber || !Password)
      return res
        .status(400)
        .json({
          success: false,
          message: "Missing PhoneNumber or password"
        })
    try {
      const user = await Account.findOne({ 'PhoneNumber': PhoneNumber })
      if (!user)
        return res
          .status(500)
          .json({
            success: false,
            message: "PhoneNumber error."
          })
      const passwordValid = await argon2d.verify(user.Password, Password)
      if (!user || !passwordValid)
        return res
          .status(400)
          .json({
            success: false,
            'message': 'Incorrect PhoneNumber or password'
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
    const { Password, PhoneNumber, FullName } = req.body
    if (!PhoneNumber || !Password) {
      return res
        .status(400)
        .json({
          success: false,
          "message": "PhoneNumber or Password not exist"
        })
    }
    try {
      const user = await Account.findOne({ 'PhoneNumber': PhoneNumber })
      if (user) {
        return res
          .status(400)
          .json({
            success: false,
            "message": 'PhoneNumber already taken'
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
      res.status(500).json({
        success: false,
        "message": err.message
      });
    }
  },


  //find Phone
  getPhone: async (req, res) => {
    try {
      const user = await Account.findOne({ 'PhoneNumber': req.body.PhoneNumber })
      if (user) {
        res.status(201).json(
          "PhoneNumber already taken"
        )
      }
      else {
        res.status(201).json("Oke")
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        "message": err.message
      });
    }
  },

  //fogot Password
  FogotPassword: async (req, res) => {
    try {
      const password = req.body.Password
      const accountUser = await Account.findOne({ 'PhoneNumber': req.body.PhoneNumber })
      console.log(accountUser);
      console.log(req.body)
      if (!accountUser)
      return res
        .status(400)
        .json({
          success: false,
          message: "PhoneNumber error."
        })
      if (!password) {
        throw new Error("No have password for reset password")
      }
      else {
        const forgotPassword = await argon2d.hash(password)//hasd password by argon 
        await accountUser.updateOne(
          {
            'Password': forgotPassword
          }, {
          new: true // trả vè dữ liệu mới 
          //Hàm này trả về defaut là dữ liệu cũ
          },
          function (err, data) {
            if (err) {
              throw new Error(err)
            }
            console.log("Oke")
            res.status(201).json({
              message: "Oke"
            })
          }
        )
      }

    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        "message": error.message
      });
    }
  },
 
//Reset Password
  ResetPassword: async (req, res) => {
    try {
      const { PhoneNumber, Password,ResetPassword } = req.body
      if (!PhoneNumber || !Password)
        return res
          .status(400)
          .json({
            success: false,
            message: "Missing PhoneNumber or password"
          })
      else {
        const accountUser = await Account.findOne({ 'PhoneNumber': PhoneNumber })
        const passwordValid = await argon2d.verify(user.Password, Password)
        const resetPassword = await argon2d.hash(ResetPassword)//hasd password by argon 
        if (!accountUser)
          return res
            .status(400)
            .json({
              success: false,
              message: "PhoneNumber error."
            })

        if (!user || !passwordValid)
          return res
            .status(400)
            .json({
              success: false,
              'message': 'Incorrect PhoneNumber or password'
         })
         else{
          await accountUser.updateOne(
            {
              'Password': resetPassword
            }, {
            new: true // trả vè dữ liệu mới 
            //Hàm này trả về defaut là dữ liệu cũ
          },
            function (err, data) {
              if (err) {
                throw new Error(err)
              }
              res.status(201).json({
                message: "Reset Password successfuly"
              })
            }
          )
         }
       
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        "message": error.message
      });
    }
  }

}