// routes/auth.js
const {generateAccessToken} = require('../utils/generateToken')

// issue a fresh ACCESS token using the refresh cookie
// issue a fresh ACCESS token using the refresh cookie
const refreshToken = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. No valid user found.",
    });
  }

  try {
    const accessToken = generateAccessToken(req.user);
    return res.json({ success: true, accessToken, user: req.user });
  } catch (error) {
    console.error("Error generating access token:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate access token",
    });
  }
};

module.exports = refreshToken
// This file is now empty since all routes are defined in apiRoutes.js
// Keeping it as a placeholder for future auth-related routes if needed

