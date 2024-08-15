const express = require('express');
const router = express.Router();
const luggageController = require('../controllers/luggageController');
const authMiddleware = require('../middleware/AuthMiddleware');

// TODO: Define routes for tracking luggage, updating status, etc.
router.get('/track', authMiddleware, luggageController.trackLuggage);
router.post('/update', authMiddleware, luggageController.updateLuggageStatus);

module.exports = router;
