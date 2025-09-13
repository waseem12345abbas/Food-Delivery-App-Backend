// make api call to database to fetch users 
const userModel = require('../models/userRegister.js')

// get all users
const getUsers = async (req, res) => {
    try {
        // ✅ Correct way: exclude password & __v fields
        const users = await userModel.find({}, "-password -__v")
        if (users.length > 0) {
            return res.status(200).json({
                success: true,
                data: users
            })
        } else {
            return res.status(404).json({
                success: false,
                message: "No users found"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        })
    }
}

module.exports = getUsers
