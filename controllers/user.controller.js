const argon2d  = require('argon2');
const Account = require('../Model/Account');
const User = require('../Model/User')
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth')
require("dotenv").config();

module.exports ={
//get infor User
getInfoUser: async(req,res)=>{
    const userName = req.query.UserName;
    const UserInfo = await  User.findOne({'UserName': userName})
    console.log(UserInfo)
    if (!UserInfo){
        res.status(400)
            json({
                success:false,
                message:"UserName not exist"
            })
    }
    else{
        res.status(201)
           .json(UserInfo)
    }

 },
 //get Infor User by Id 
 getInfoUserById: async(req,res)=>{

    try {
        const Id = req.accountID;
        console.log(Id);
        const UserInfo = await User.findOne({'AccountID': Id})
        if (!UserInfo){
           res.status(400)
               json({
                   success:false,
                   'message':"UserName not exist"
               })
       }
       else{
           res.status(201)
              .json(UserInfo)
       }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
    

 },
//Update profile usser
UpdateProfile: async (req, res) => {
    const {
        FullName,
        BirthDay,
        Address,
        Gender,
       
    } = req.body
    try {
    
        const UserInfo = await User.findOne({ 'AccountID':req.accountID })
        console.log(UserInfo._id)
        if (!UserInfo)
            return res
                .status(400)
                .json({
                    success: false,
                    message: "don't have user"
                })
        else {
            
            User.updateOne({ _id: UserInfo._id },
                {
                    $set: {
                        'FullName': FullName ||UserInfo.FullName,
                        'BirthDay': BirthDay || UserInfo.BirthDay,
                        'Address':  Address   || UserInfo.Address,
                        'Gender':   Gender     ||UserInfo.Gender,
                    }
                }, function (error, data) {
                    res.json("Oke")
                }
            )
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
  },


  //get address
  getAddress: async(req,res) =>{
      try {
          const getAddress = await User.findOne({'AccountID':req.accountID})
          console.log(getAddress.Address)
          if(!getAddress.Address)
          {
              res.status(400)
                 .json({
                     success:false,
                     message:"no have address"
                 })
          }
          else{
              const temp = getAddress.Address
              res.status(200)
                  .json(
                      {
                          success:true,
                           temp
                      }
                  )
          }
      } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
      }
  },

  //Get PhonNumber by AccountID
  getPhonNumber:async(req,res)=>{
    try {
        console.log(req.query.AuthorID)
        const account =await Account.findOne({'_id':req.query.AuthorID})
        res.status(201).json({
            'PhoneNumber':account.PhoneNumber,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }     
  }
}
