const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
dotenv.config({path: '.env'})

const JWT_SECRET = process.env.JWT_SECRET

exports.authentication = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (authHeader) {
        const token = authHeader.split(" ")[1]
       jwt.verify(token, JWT_SECRET, (err, user) => {
        if(err){
            return res.status(403).json({
                message: "Invalid Token !!!"
            })
        }else{
            req.user = user
            next()
        }
       })
    }else{
        return res.status(401).json({
            message: "Invalid or Expired Token !!!"
        })
    }
}
