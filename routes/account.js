var argon2d  = require('argon2');
var express = require('express');
var Account = require('../Model/Account');
var User = require('../Model/User')
var account = express.Router();
var jwt = require('jsonwebtoken');
require("dotenv").config();

/* GET users listing. */
/*Register Account User*/
account.post('/register', async (req, res) => {
  var {UserName,Password,PhoneNumber} = req.body
  if (!UserName || !Password) {
    return res
      .status(400)
      .json({
        success: false,
        message: "UserName or Password not exits"
      })
  }
  if(!PhoneNumber)
  {
    return res 
          .status(400)
          .json({
            success:false,
            message:"PhoneNumber not exits"
          })
  }

  try {
    var user = await Account.findOne({'UserName':UserName })
   
    if (user)
      return res
      .status(400)
      .json({
          success: false,
          message: 'UserName already taken'
        })
    
    else {
      var hashedPassword = await argon2d.hash(Password)//hasd pass word by argon 
      var data = new Account({
        'UserName': UserName,
        'Password': hashedPassword,
        'PhoneNumber' : PhoneNumber,
        'CreateDay': `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
      })
      var UserDetail = new User({
        'UserName':UserName,
        'PhoneNumber':PhoneNumber,
        'AccountID': data._id
      })
      var accessToken = jwt.sign(
        { userID: data._id },
         process.env.ACCESS_TOKEN_SECRET)
      data.save(function (err) {
        UserDetail.save(),
        res.status(201)
          .json({
            success: true,
            message: "OK",
            "accessToken":accessToken, //Respone token for client user
           
          })
      });
      
      
    }

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
)

//Login account
account.post('/login',async(req,res)=>{
  var {UserName,Password} = req.body
  if( !UserName || !Password )
      return res 
            .status(400)
            .json({
              success:false,
              message:"Missing user name or password"
            })
  try{
    var user = await Account.findOne({'UserName':UserName})
    if(!user) 
      return res 
             .status(400)
             .json({
               success:false,
               message:'Incorrect username or password'
             })
    var passwordValid = await argon2d.verify(user.Password,Password)
    if(!passwordValid)
        return res 
             .status(400)
             .json({
               success:false,
               message:'Incorrect username or password'
             })

    var accessToken = jwt.sign(
               { userID: user._id },
                process.env.ACCESS_TOKEN_SECRET
                )
     res.json({
        success:true,
        message:'User logged in successfully',
        accessToken
      })
      
  }catch(err)
  {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
})




module.exports = account;
