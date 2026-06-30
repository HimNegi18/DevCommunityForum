const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const generateToken = (userId)=>{
    return jwt.sign(
        {id: userId},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    )
}

//POST api/auth/register
const authRegistor = async(req, res)=>{
    try {
        const {username, email, password} = req.body;

        //Checking if email already exist
        const existingUser =await User.findOne({email})
        if (existingUser){
            res.status(400).json({message : "User already exists"})
        }

        //Hashing Password
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password,salt);

        //Creating User
        const user = await User.create({username, email, password: hashPass})
        
        //token generated
        const token = generateToken(user._id)

        res.status(201).json({
            token,
            user: {
                id : user._id,
                username: user.username,
                email: user.email,
                reputation: user.reputation,
                avatar: user.avatar
            },
        })
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message})
    }


}

//POST api/auth/login
const authLogin = async(req, res)=>{
    try {
        const {email, password} = req.body;

        //Check if user exists
        const user = await User.findOne({email})
        if (!user) {
            res.status(400).json({message: "Invalid Credentials"})
        }

        //check is password correct
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(400).json({message: "Invalid Credentials"})
        }

        //token generated
        const token = generateToken(user._id)
        
        res.status(200).json({
            token,
            user:{
                id: user._id,
                email: user.email,
                password: user.password,
                reputation: user.reputation,
                avatar: user.avatar
            }
        })
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message})
    }
}

module.exports = { register, login }