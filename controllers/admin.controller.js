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
    loginGet: (req, res, next) => {
        res.render('admin/login/index', { status: "" })
    },
    loginPost: async (req, res, next) => {
        let { PhoneNumber, Password } = req.body;
        let temp = '0123456789';
        let check = true;
        for (let i = 0; i < Password.length; i++) {
            if (temp.indexOf(PhoneNumber[i]) == -1) {
                check = false;
                break;
            }
        }
        let account = [];
        if (check == true)//neu phone nhap vao toan la so thi moi tim kiem
        {
            account = await Account.find({ PhoneNumber: PhoneNumber });
        }
        if (account.length != 0 && check == true) {
            const passwordValid = await argon2d.verify(account[0].Password, Password)
            if (passwordValid)//kiem tra mk
            {
                const accessToken = jwt.sign(
                    { accountID: account[0]._id },
                    process.env.ACCESS_TOKEN_SECRET
                );
                res.cookie('token', accessToken, { maxAge: 900000, httpOnly: true });
                console.log('cookie created successfully');
                return res.redirect("/admin/home");
            } else {
                res.render('admin/login', { status: "wrong password !" })
            }
        }
        else {
            res.render('admin/login', { status: "Account does not exist." })
        }
    },
    home: async (req, res, next) => {
        let countAccount = await Account.count();
        let countUser = await User.count();
        let countPost = await Post.count();
        res.render('admin/main/index', { account: countAccount, user: countUser, post: countPost })
    }
    ,
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
            res.render('admin/account/danhsach', { account: data, url: process.env.URL })
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

            var checkAccount = await Account.findOne({ PhoneNumber: req.body.PhoneNumber });
            if (checkAccount) {
                if (checkAccount.PhoneNumber != editedAccount.PhoneNumber) {
                    return res
                        .status(501)
                        .json({
                            success: false,
                            message: "the new PhoneNumber already exist"
                        });
                }
            }
            //edit account
            // must contain PhoneNumber, Password, Rule into the reques.body
            let hashedPassword;
            if (req.body.Password)
                hashedPassword = await argon2d.hash(req.body.Password);//if req contain new password, hash it
            Account.updateOne(
                { _id: req.query._id },
                {
                    $set: {
                        PhoneNumber: req.body.PhoneNumber || editedAccount.PhoneNumber,
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
                { PhoneNumber: deletedAccount.PhoneNumber },
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
        const UserInfo = await User.find()
        if (!UserInfo) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Accout requesting does not exist"
                })
        }
        res.render('admin/user/danhsach', { users: UserInfo, url: process.env.URL, accountOpen: "open" })
    },
    //edit information of user
    //in this method, user must contain id of the user which being edited and all new information
    //the id of the user being edited must contain in the url
    editUserGet: async (req, res, next) => {
        try {
            var editedUser = await User.findOne({
                _id: req.query._id
            })
            res.render("admin/user/edit", { user: editedUser });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    editUserPost: async (req, res, next) => {
        try {
            //id of the user being edited in request
            //get _id of the user by query data from url
            var editedUser = await User.findOne({
                _id: req.query._id
            })
            //confirm that the user edited is existing
            if (!editedUser) {
                // return res
                //     .status(404)
                //     .json({
                //         success: false,
                //         message: "The User you have chosen to edit does not exist"
                //     })
                res.render("admin/user/error")
            }
            //edit user
            // must contain PhoneNumber, Password, Rule into the req.body
            //in this method, admin can not change property AccountId and userName
            //if any field is null, it will be remain the previous value
            User.updateOne(
                { _id: req.query._id },
                {
                    $set: {
                        FullName: req.body.FullName || editedUser.FullName,
                        BirthDay: req.body.BirthDay || editedUser.BirthDay,
                        Address: req.body.Address || editedUser.Address,
                        Gender: req.body.Gender || editedUser.Gender
                    }
                }, function (err, data) {
                    if (err) {
                        res.render("admin/user/error")
                    }
                    else {
                        res.render("admin/user/success")
                    }
                });
        } catch (error) {
            res.render("admin/user/error")
        }
    },
    removeUser: async (req, res, next) => {
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