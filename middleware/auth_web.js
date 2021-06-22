const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.cookies['token']
    if (!token) {
        res.redirect('/client/login')
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.accountID = decoded.accountID

        next() // cho qua
    } catch (error) {
        res.redirect('/client/login')
    }
}
module.exports = verifyToken