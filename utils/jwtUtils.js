// utils/jwtUtils.js

const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_secret_key'; // Change this to your own secret key

/**
 * Generates a JWT token for the given user ID.
 * 
 * @param {string} userId - User ID to include in the token.
 * @returns {string} - JWT token.
 */
exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
};

/**
 * Verifies the provided JWT token.
 * 
 * @param {string} token - JWT token to verify.
 * @returns {Object} - Decoded token payload.
 */
exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
