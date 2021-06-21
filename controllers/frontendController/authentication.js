const argon2d = require('argon2');
const Account = require('../../Model/Account');
const User = require('../../Model/User')
const jwt = require('jsonwebtoken');
const { use } = require('../../routes/post.router');
const { json } = require('express');
const { findOne } = require('../../Model/Account');
const account = require('../../routes/account.router');
require("dotenv").config();
module.exports = {
    //Login
    loginGet: (req, res, next) => {
        res.render('client/login/index', { status: "" })
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
    }

}