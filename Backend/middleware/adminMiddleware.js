const jwt = require('jsonwebtoken');

// Middleware to check if the user is authenticated
const checkAuth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'mySuperSecretKey12345'); // Verify token with secret
    req.user = decoded; // Attach the decoded token data (user info) to req.user
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { checkAuth };


// Admin Middleware
const checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin privileges required' });
    }
    next();
  };
  
  module.exports = { checkAdmin };
  


