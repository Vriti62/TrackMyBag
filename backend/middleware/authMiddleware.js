const jwt = require('jsonwebtoken');


//Authentication

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // No token

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(403).json({error:"Token verification failed"}); // Invalid token
    }
    req.user = user; // Add user data to request
    console.log('Authenticated user:', req.user); // Debug: Check user object
    next();
  });
};

//Authorization
exports.requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log("No user data found"); // Debug: No user data
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user.role !== role) {
      console.log("Access Denied. User Role:", req.user.role); // Debug: Check user role
      return res.status(403).json({ message: "Access denied: insufficient privileges" });
    }
    next();
  };
};

