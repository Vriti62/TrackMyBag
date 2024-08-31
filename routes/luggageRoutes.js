// routes/luggageRoutes.js

const express = require('express');
const router = express.Router();
const luggageController = require('../controllers/luggageController');
const jwtUtils = require('../utils/jwtUtils');

// Middleware to authenticate user
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwtUtils.verifyToken(token);
    req.user = { id: decoded.id }; // Attach user ID to request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Routes for luggage management
router.get('/', luggageController.getAllLuggage);
router.get('/:id', luggageController.getLuggageById);
router.post('/', authenticate, luggageController.addLuggage);
router.put('/:id', authenticate, luggageController.updateLuggage);
router.delete('/:id', authenticate, luggageController.deleteLuggage);

module.exports = router;
