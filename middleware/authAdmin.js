const jwt = require('jsonwebtoken')

const verifyTokenAdmin = (req, res, next) => {
    const token = req.cookies['token']//lay token tu cookie
    if (!token)
        return res.redirect('/admin/login')
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.accountID = decoded.accountID

        next() // cho qua
    } catch (error) {
        console.log(error)
        return res.status(403).json({
            success: false,
            'message': "Invalid token"
        })
    }
}
module.exports = verifyTokenAdmin