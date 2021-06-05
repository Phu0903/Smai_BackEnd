const jwt = require('jsonwebtoken')
const Account = require('../Model/Account');

const checkAdmin = async (req, res, next) => {
    const account = await Account.findOne(
        { '_id': req.accountID }
    )
    //kiem tra xem da dang nhap hay chua
    if (!account) {
        console.log("err");
        return res
            .status(400)
            .json({
                success: false,
                message: 'Account requesting does not exist.'
            })
    }
    else if (account.Rule == 1) {
        console.log("err")
        return res
            .status(400)
            .json({
                success: false,
                message: 'you do not have enought permission.'
            })
    }
    else {
        next();
    }
}
module.exports = checkAdmin;