const express = require('express');
const router = express.Router();
const { getResponse } = require('../controllers/chatbotController'); // Adjust path if necessary

router.post('/chat', getResponse); // Define the POST route

module.exports = router;
