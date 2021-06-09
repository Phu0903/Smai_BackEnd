const argon2d = require('argon2');
const Account = require('../Model/Account');
const User = require('../Model/User')
const Post = require('../Model/Post')
const jwt = require('jsonwebtoken');
require("dotenv").config();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = {
    //get information all account
    //client must contain token in the request
    getAllAccount: async (req, res, next) => {
        Account.find().then(data => {
            if (!data) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Accout requesting does not exist"
                    })
            }
            res.render('AdminPage/index')
        });
    },
    editAccount: async (req, res, next) => {
        try {
            //id of the account being edited in request
            var editedAccount = await Account.findOne({
                _id: req.body._id
            })
            //confirm that the account edited is existing
            if (!editedAccount) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        message: "Account you have chosed to edit does not exist"
                    })
            }
            //make sure that there are no account have the same UserName with the data edit

            var checkAccount = await Account.findOne({ UserName: req.body.UserName });
            console.log(checkAccount);
            console.log(editedAccount.UserName);
            if (checkAccount) {
                if (checkAccount.UserName != editedAccount.UserName) {
                    return res
                        .status(501)
                        .json({
                            success: false,
                            message: "the new UserName already exist"
                        });
                }
            }
            //edit account
            // must contain UserName, Password, Rule into the reques.body
            let hashedPassword;
            if (req.body.Password)
                hashedPassword = await argon2d.hash(req.body.Password);//if req contain new password, hash it
            console.log(req.query._id)
            Account.updateOne(
                { _id: req.query._id },
                {
                    $set: {
                        UserName: req.body.UserName || editedAccount.UserName,
                        Password: hashedPassword || editedAccount.Password,
                        Rule: req.Rule || 1
                    }
                }, function (err, data) {
                    if (err)
                        res.send("error")
                    else
                        res.send("oke")
                });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    removeAccount: async (req, res, next) => {
        let deletedAccount = await Account.findOne({ _id: req.query._id });
        if (!deletedAccount) {
            return res
                .status(500)
                .json({
                    success: false,
                    message: "the account you chosen does not exists."
                })
        }
        try {
            let temp;
            Account.remove({ _id: req.query._id }, function (error, object) {
                if (error) throw error;
                temp = object.deletedCount;
            });

            User.remove(
                { UserName: deletedAccount.UserName },
                function (err, object) {
                    if (err) throw err;
                    return res
                        .status(200)
                        .json({
                            success: true,
                            message: `update success: ${temp} account and ${object.deletedCount} user`
                        })
                }
            )
        } catch (err) {
            return res
                .status(500)
                .json({
                    success: false,
                    message: err.message
                })
        }
    },
    //get all user with none data in req.body
    getAllUser: async (req, res, next) => {
        User.find().then(data => {
            if (!data) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Accout requesting does not exist"
                    })
            }
            return res
                .status(400)
                .json({
                    success: true,
                    data: data
                })
        });
    },
    //edit information of user
    //in this method, user must contain id of the user which being edited and all new information
    //the id of the user being edited must contain in the url
    editUser: async (req, res, next) => {
        try {
            //id of the user being edited in request
            //get _id of the user by query data from url
            console.log(req.query._id);
            var editedUser = await User.findOne({
                _id: req.query._id
            })
            //confirm that the user edited is existing
            if (!editedUser) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        message: "The User you have chosen to edit does not exist"
                    })
            }
            //edit user
            // must contain UserName, Password, Rule into the req.body
            //in this method, admin can not change property AccountId and userName
            //if any field is null, it will be remain the previous value
            User.updateOne(
                { _id: req.query._id },
                {
                    $set: {
                        FullName: req.body.FullName || editedUser.FullName,
                        BirthDay: req.body.BirthDay || editedUser.BirthDay,
                        Address: req.body.Address || editedUser.Address,
                        Gender: req.body.Gender || editedUser.Gender,
                        PhoneNumber: req.body.PhoneNumber || editedUser.PhoneNumber,
                    }
                }, function (err, data) {
                    return res
                        .status(200)
                        .json({
                            success: true,
                            message: "This user already update."
                        })
                });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    removeUser: async (req, res, next) => {
        console.log(req.query._id)
        let deletedUser = await User.findOne({ _id: req.query._id });
        if (!deletedUser)
            return res
                .status(501)
                .json({
                    success: false,
                    message: "User that you want to delete does not exists."
                })
        try {
            User.remove({ _id: req.query._id }, function (error, object) {
                if (error) throw error;
                return res.status(200)
                    .json({
                        success: true,
                        message: `updated success: ${object.deletedCount} record`
                    })
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    //view all post
    getAllPost: async (req, res, next) => {
        try {
            Post.find().then((data) => {
                return res
                    .status(200)
                    .json({
                        success: true,
                        data: data
                    })
            })
        } catch (error) {
            return res
                .status(500)
                .json({
                    success: false,
                    message: error.message
                })
        }
    },
    removePost: async (req, res, next) => {
        let deletedPost = await Post.find({ _id: req.query._id });
        if (!deletedPost)
            return res
                .status(500)
                .json({
                    success: false,
                    message: "post you want to remove does not exist."
                })
        Post.remove({ _id: req.query._id }, function (error, object) {
            if (error) throw error;
            return res.status(200)
                .json({
                    success: true,
                    message: `updated success: ${object.deletedCount} record`
                })
        })
    }
}
