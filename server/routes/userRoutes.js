const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');


// User routes
router.get('/user/:id', user_controller.getUserProfile);
router.put('/user/:id', user_controller.updateUserProfile);
router.post('/register', user_controller.registerUser);
router.post('/login', user_controller.loginUser);

module.exports = router;
