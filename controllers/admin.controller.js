const argon2d = require('argon2');
const Account = require('../Model/Account');
const User = require('../Model/User')
const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = {
    //get information all account
    getAllAccount: async (req, res) => {
        const account = await Account.findOne(
            { '_id': req.accountID }
        )
        //kiem tra xem da dang nhap hay chua
        if (!account) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'Account is not exist'
                })
        }
        else if (account.Role == 1) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'you do not have enought permission'
                })
        }
        else {
            Account.find().then(data => {
                console.log(data);
                return res
                    .status(400)
                    .json({
                        success: false,
                        data: data
                    })
            });
        }
    },
    editAnAccount: async (req, res,next)=>{

    }
}
