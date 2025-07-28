const express = require('express');
const router = express.Router();
const { getResponse } = require('../controllers/chatbotController'); 


router.post('/chat', getResponse); 


module.exports = router;
