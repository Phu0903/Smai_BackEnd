const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization')
  
    const token = authHeader && authHeader.split(' ')[1]
   
    if (!token)
        return res
            .status(401)
            .send({
                'success': false,
                'message': 'Bạn cần đăng nhập để sử dụng tính năng này'
            })
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.accountID = decoded.accountID

        next() // cho qua
    } catch (error) {
        return res.status(403).json({
            success: false,
            'message': "Invalid token"
        })
    }
}
module.exports = verifyToken