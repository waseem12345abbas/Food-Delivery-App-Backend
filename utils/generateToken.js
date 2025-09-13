const jwt = require('jsonwebtoken');

// Generate access token
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15d' });
};

// Generate refresh token
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = { generateAccessToken, generateRefreshToken };
