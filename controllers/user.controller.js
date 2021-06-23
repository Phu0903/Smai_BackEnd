const argon2d = require('argon2');
const Account = require('../Model/Account');
const User = require('../Model/User')
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth');
require("dotenv").config();

module.exports = {
    //get infor User
    getInfoUser: async (req, res) => {
        const userName = req.query.UserName;
        const UserInfo = await User.find()
        if (!UserInfo) {
            res.status(400)
            json({
                success: false,
                message: "UserName not exist"
            })
        }
        else {
            res.status(201)
                .json(UserInfo)
        }

    },
    //get Infor User by Id 
    getInfoUserById: async (req, res) => {

        try {
            const Id = req.accountID;
            const UserInfo = await User.findOne({ 'AccountID': Id })
            if (!UserInfo) {
                res.status(400)
                json({
                    success: false,
                    'message': "UserName not exist"
                })
            }
            else {
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
        const {FullName,PasswordReset} = req.body
        const Id = req.accountID;
        try {
            const resetPassword = await argon2d.hash(PasswordReset)//hasd password by argon 
            const AccountUser = await Account.findOne({'_id':Id})
         
            const UserInfo = await User.findOne({ 'AccountID': Id })
            if (!UserInfo && !AccountUser)
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "don't have user"
                    })
            else {
                await AccountUser.updateOne(
                    {
                      'Password': resetPassword || AccountUser.Password
                    }, {
                    new: true // trả vè dữ liệu mới 
                    //Hàm này trả về defaut là dữ liệu cũ
                   },
                  )
                if(!req.file)
                {
                    User.updateOne({ _id: UserInfo._id },
                        {
                            $set: {
                                'FullName': FullName || UserInfo.FullName,
                               
                            }
                        }, function (error, data) {
                            res.json("Oke")
                        }
                    )
                }
                else{
                await User.updateOne({ _id: UserInfo._id },
                    {
                        $set: {
                            'FullName': FullName || UserInfo.FullName,
                            'urlIamge': req.file 
                        }
                    }, function (error, data) {
                        res.json("Oke")
                    }
                )
                }
             
                
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },


    //get address
    getAddress: async (req, res) => {
        try {
            const getAddress = await User.findOne({ 'AccountID': req.accountID })
            if (!getAddress.Address) {
                res.status(400)
                    .json({
                        success: false,
                        message: "no have address"
                    })
            }
            else {
                const temp = getAddress.Address
                res.status(200)
                    .json(
                        {
                            success: true,
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
    getPhonNumber: async (req, res) => {
        try {
            const account = await Account.findOne({ '_id': req.query.AuthorID })
            res.status(201).json({
                'PhoneNumber': account.PhoneNumber,
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}
