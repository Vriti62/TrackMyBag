const express = require('express');
const router = express.Router();
const controllers = require('../controllers/luggageController');

// Luggage routes
router.get('/luggage', controllers.getAllLuggage);
router.get('/luggage/:id', controllers.getLuggageById);
router.post('/luggage', controllers.createLuggage);
router.put('/luggage/:id', controllers.updateLuggage);
router.delete('/luggage/:id', controllers.deleteLuggage);

module.exports = router;
