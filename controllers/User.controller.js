const argon2d  = require('argon2');
const Account = require('../Model/Account');
const User = require('../Model/User')
const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports ={
//get infor User
getInfoUser: async(req,res)=>{
    const userName = req.query.UserName;
    const UserInfo = await  User.findOne({'UserName': userName})
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
     const Id = req.query.Id;
     const UserInfo = await User.findOne({'_id':Id})
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
//Update profile usser
UpdateProfile: async (req, res) => {
    const {
        FullName,
        BirthDay,
        Address,
        Gender,
        UserName
    } = req.body
    try {
        if (!UserName) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "UserName not exist"
                })
        }
        const UserInfo = await User.findOne({ 'UserName': UserName })
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
                        'FullName': FullName,
                        'BirthDay': BirthDay,
                        'Address': Address,
                        'Gender': Gender
                    }
                }, function (error, data) {
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
  }
}
