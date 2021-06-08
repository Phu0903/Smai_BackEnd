const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next) =>{
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]

    if(!token)
    return res
           .status(401)
           .json({
               'success':false,
               'message':'Bạn cần đăng nhập để sử dụng tính năng này'
           })
    try {
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        if(!decoded){
            return res
                .status(401)
                .send('Bạn không có quyền truy cập vào tính năng này!');
        }
        req.accountID = decoded.accountID
        
        next() // cho qua
    } catch (error) {
        console.log(error)
        return res.status(403).json({
            success:false,
            'message':"Invalid token"
        })
    }
}
module.exports = verifyToken