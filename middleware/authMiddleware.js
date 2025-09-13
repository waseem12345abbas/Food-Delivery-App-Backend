const jwt = require('jsonwebtoken');
const userRegister = require('../models/userRegister');

// verify the admin 
const verifyAdmin = (req, res, next) =>{
    if(req.user && req.user.role === "admin")
    {
        return next()
    }
    return res.status(403).json({ success: false, message: 'Admin access only' });
}
// Middleware to verify access token
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Access token required' });
        }

        const token = authHeader.split(' ')[1];
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verify user still exists
        const user = await userRegister.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        req.user = {
            id: user._id,
            email: user.email,
            role: user.role
        };
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Middleware to verify refresh token
const verifyRefreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            return res.status(401).json({ success: false, message: 'Refresh token required' });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        
        // Verify user still exists
        const user = await userRegister.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        req.user = {
            id: user._id,
            email: user.email,
            role: user.role
        };
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Refresh token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid refresh token' });
        }
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { verifyToken, verifyRefreshToken, verifyAdmin };
