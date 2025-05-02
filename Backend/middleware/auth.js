const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware for required authentication
const required = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Set user in request object
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware for optional authentication
const optional = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // If no token, continue without authentication
    if (!token) {
      return next();
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    
    if (user) {
      // Set user in request object if found
      req.user = user;
    }
    
    next();
  } catch (err) {
    // If token is invalid, continue without authentication
    console.error('Optional auth error:', err.message);
    next();
  }
};

module.exports = { required, optional };
