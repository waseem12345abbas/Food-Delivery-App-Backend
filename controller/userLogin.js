// require user model
const userRegister=require('../models/userRegister')
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken.js')

// POST/api/login
const validateLogin = async(req, res)=>{
const {mobile, email, password}=req.body
    // now find the user
       try {
        const user = await userRegister.findOne({email, mobile})
        if(!user){
            return res.status(404).json({success:false, message:'User not found'})
        }
        // if user is found then compare the match the password
        const isMatch = await user.matchPassword(password)
        if(!isMatch){
            return res.status(401).json({success:false, message:'Password not match'})
        }
        
        // Generate tokens
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)
        
        // Set refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        
        res.status(200).json({
            success:true, 
            message:'Login successfull', 
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({success:false, message:"server not found"})
    }
}

module.exports=validateLogin
