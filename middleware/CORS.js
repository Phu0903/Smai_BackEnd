const jwt = require('jsonwebtoken')

const CORS = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log("oke")
    next();
}
module.exports = CORS