// import the userRegister schema
const userRegister=require('../models/userRegister.js')
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken.js')

// now make api requests using this router
const createUserRegister=async(req, res)=>{
  try {
        // got the data when user entered the data in the form in the frontend
        const { name, mobile,  email, address,  country, password}=req.body
        // check if email already existing
        const existingUser= await userRegister.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"Email already in use"
            })
        }
        // now store the data after validation with the original schema
        const newUserRegister=new userRegister({ name, mobile,  email, address,  country, password, role: 'user'})
             await newUserRegister.save()
             
             // Generate tokens
             const accessToken = generateAccessToken(newUserRegister)
             const refreshToken = generateRefreshToken(newUserRegister)
             
             // Set refresh token as HTTP-only cookie
             res.cookie('refreshToken', refreshToken, {
                 httpOnly: true,
                 secure: process.env.NODE_ENV === 'development',
                 sameSite: 'strict',
                 maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
             })
             
             res.status(201).json({
                 success:true, 
                 message:"User registered successfully",
                 accessToken,
                 user: {
                     id: newUserRegister._id,
                     name: newUserRegister.name,
                     email: newUserRegister.email,
                     role: newUserRegister.role
                 }
             })
    } catch (error) {
        if(error.name==='ValidationError'){
                const messages=Object.values(error.errors).map(val=> val.message)
                return res.status(400).json({
                    success: false, 
                message: messages.join(', ')
                })
            }
            res.status(500).json({success:false, message:"Server error"})
    }
}

module.exports=createUserRegister
