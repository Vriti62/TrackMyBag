const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/AuthMiddleware');

// TODO: Define routes for sending and retrieving notifications
router.post('/send', authMiddleware, notificationController.sendNotification);
router.get('/', authMiddleware, notificationController.getNotifications);

module.exports = router;
