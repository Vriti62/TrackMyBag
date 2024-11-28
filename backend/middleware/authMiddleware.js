const jwt = require('jsonwebtoken');
const SECRET_KEY = "your-secret-key"; // Replace with your actual secret key

// Authentication
exports.authenticateToken = (req, res, next) => {
  const token = req.cookies["token"]; // Retrieve token from cookies
    if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err); // Debug: Token error
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const users = readUser(); // Read users from your data source
    const user = users.find((u) => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach user to request object for further use
    next();
  });
};

// Authorization
exports.requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access denied: insufficient privileges" });
    }
    next();
  };
};
