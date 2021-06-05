const argon2d  = require('argon2');
const Account = require('../Model/Account');
const User = require('../Model/User')
const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports ={
     
    //Login
    login : async(req,res) => {
        const {UserName,Password} = req.body
        if( !UserName || !Password )
            return res 
                  .status(400)
                  .json({
                    success:false,
                    message:"Missing user name or password"
                  })
        try{
          const user = await Account.findOne({'UserName':UserName})
          const passwordValid = await argon2d.verify(user.Password,Password)
          if(!user || !passwordValid) 
            return res 
                   .status(400)
                   .json({
                     success:false,
                     'message':'Incorrect username or password'
                   })
          const accessToken = jwt.sign(
                     { accountID: user._id },
                      process.env.ACCESS_TOKEN_SECRET
                      )
           res.json({
              success:true,
              "message": "OK",
              "accessToken":accessToken,
            })
            
        }catch(err)
        {
          res.status(500).json({
            success: false,
            message: err.message
          });
        }
      },


      //register
    register: async (req, res) => {
        const {UserName,Password,PhoneNumber,Address,FullName} = req.body
        if (!UserName || !Password) {
          console.log("1");
          return res
            .status(400)
            .json({
              success: false,
              "message": "UserName or Password not exist"
            })
        }
        if(!PhoneNumber)
        {
          console.log("2");
          return res 
                .status(400)
                .json({
                  success:false,
                  "message":"PhoneNumber not exits"
                })
        }
            try {
          const user = await Account.findOne({'UserName':UserName })
          if (user){
            console.log("UserName already taken");
            return res
            .status(400)
            .json({
                success: false,
                "message": 'UserName already taken'
              })
            }
          else {
            const hashedPassword = await argon2d.hash(Password)//hasd pass word by argon 
            const data = new Account({
              'UserName': UserName,
              'Password': hashedPassword,
              'PhoneNumber' : PhoneNumber,
              
            })
            const UserDetail = new User({
              'UserName':UserName,
              'PhoneNumber':PhoneNumber,
              'AccountID': data._id,
              'FullName':FullName,
              'Address':Address
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
                  "accessToken":accessToken, //Respone token for client user
                 
                })
            }); 
          }
        } catch (err) {
          res.status(500).json({
            success: false,
           "message": err.message
          });
        }
      }
}
