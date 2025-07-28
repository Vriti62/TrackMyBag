const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

router.get('/users', ordersController.getUserDetails);
router.post('/checkout', ordersController.checkout);
router.post('/verify-payment', ordersController.verifyPayment);
router.get('/', ordersController.getAllOrders);
router.put('/:orderId', ordersController.updateOrderStatus);

module.exports = router;