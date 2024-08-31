// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes for user management
router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;
