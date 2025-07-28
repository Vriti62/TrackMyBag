const express = require('express');
const router = express.Router();
const luggageController = require('../controllers/luggageController');

// Example routes:
router.get("/", luggageController.getAllLuggage);
router.get("/:id", luggageController.getLuggageById);
router.post("/", luggageController.addLuggage);
router.put("/:id", luggageController.updateLuggage);
router.delete("/:id", luggageController.deleteLuggage);

module.exports = router;