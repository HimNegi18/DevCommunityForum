const jwt = require("jsonwebtoken")
const User = require('../models/User')

const protect =async (req, res, next)=>{
    try {
        // token comes in the header as: Authorization: Bearer <token>
        const authHeader = req.header.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message: "Not authorized, no token"})
        }
        const token = authHeader.split(" ")[1]

        // verify the token — throws if expired or invalid
        const decode = jwt.verify(token, process.env.JWT_SECRET)

        // attach user to request so any route can access req.user
        req.user= await User.findById(decode.id).select("-password")

        next();
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
}

module.exports = { protect }