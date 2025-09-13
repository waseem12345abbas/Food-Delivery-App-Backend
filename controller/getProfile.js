const userModel = require('../models/userRegister')


const getProfile= async(req, res)=>{
    try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = getProfile