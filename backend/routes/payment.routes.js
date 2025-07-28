const express = require('express');
const router = express.Router();
const { getPlans, createOrder, verifyPayment } = require('../controllers/paymentController');

router.get("/plans", getPlans);
router.post("/createOrder", createOrder);
router.post("/verifyPayment", verifyPayment);

module.exports = router;