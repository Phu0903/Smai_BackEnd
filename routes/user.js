var argon2d  = require('argon2');
var express = require('express');
const { findById } = require('../Model/Account');
var Account = require('../Model/Account');
var User = require('../Model/User')
var users = express.Router();

//get profile User
users.get('/getInfoUser',async(req,res)=>{
    var UserName = req.query.username;
    try {
        InfoUser = User.fin
    } catch (error) {
        
    }
})

//Update profile User 
users.put('/profileUser',async(req,res) =>{
       var {
           FullName,
           BirthDay,
           Address,
           Gender,
           UserName
        } = req.body
       try {
           if(!UserName)
           {
               return res
                      .status(400)
                      .json({
                          success:false,
                          message:"UserName not exits"
                      })
           }
           
           var UserInfo = await User.findOne({'UserName':UserName })
           if(!UserInfo)
              return res
                 .status(400)
                 .json({
                     success:false,
                     message:"don't have user"
                 })
           else {
               
               User.updateOne({_id:UserInfo._id},
                { $set:{
                    'FullName':FullName,
                    'BirthDay':BirthDay,
                    'Address':Address,
                    'Gender':Gender
                }
                },function(error,data){
                    res.json(data)
                }
                )
           }
       } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
       }
})




module.exports = users;