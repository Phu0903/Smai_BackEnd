const argon2d = require('argon2');
const Account = require('../Model/Account');
const User = require('../Model/User')
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
            return res
                .status(400)
                .json({
                    success: true,
                    data: data
                })
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
            Account.updateOne(
                { _id: req.body._id },
                {
                    $set: {
                        UserName: req.body.UserName || editedAccount.UserName,
                        Password: await argon2d.hash(req.body.Password) || editedAccount.Password,
                        Rule: req.Rule || 1
                    }
                }, function (err, data) {
                    res.json("oke")
                });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}
