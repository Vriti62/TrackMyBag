const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { loadOrders, saveOrders } = require('../models/orderModel');
const { saveCart } = require('../models/cartModel');
const razorpayService = require('./razorpayservice');

// Fetch user details (dummy example)
router.get('/users', (req, res) => {
  // This should fetch user details from your database
  res.json({ name: "John Doe", email: "john.doe@example.com" });
});

// Checkout route to create an order
router.post('/checkout', async (req, res) => {
  const { amount, currency, customerInfo, items } = req.body;
  
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty.' });
  }

  if (!amount || !currency) {
    return res.status(400).json({ error: 'Amount and currency are required.' });
  }

  try {
    const razorpayOrder = await razorpayService.createOrder(amount, currency, Date.now().toString());

    // Check if razorpayOrder is valid
    if (!razorpayOrder || !razorpayOrder.id) {
      throw new Error('Invalid Razorpay order response');
    }

    const orders = loadOrders();
    const newOrder = {
      id: razorpayOrder.id,
      amount,
      currency,
      customerInfo,
      items,
      status: 'Placed',
      date: new Date(),
    };

    orders.push(newOrder);
    saveOrders(orders);

    saveCart([]); // Clear the cart after placing the order

    res.status(201).json({ message: 'Order placed successfully.', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message, stack: error.stack });
  }
});

// Razorpay payment verification route
router.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const isValid = razorpayService.verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

  if (isValid) {
    const orders = loadOrders();
    const order = orders.find(o => o.id === razorpay_order_id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = 'Paid';
    saveOrders(orders);

    res.json({ success: true, message: 'Payment verified successfully', order });
  } else {
    res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
});

// Get all orders
router.get('/', (req, res) => {
  try {
    const orders = loadOrders();
    // Add some default values for required fields
    const formattedOrders = orders.map(order => ({
      id: order.id,
      username: order.customerInfo?.name || 'N/A',
      email: order.customerInfo?.email || 'N/A',
      phone: order.customerInfo?.phone || 'N/A',
      address: order.customerInfo?.address || 'N/A',
      orderTime: order.date || new Date(),
      items: order.items || [],
      total: order.amount ? order.amount / 100 : 0,
      status: order.status || 'Pending'
    }));
    res.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Error loading orders:', error);
    res.status(500).json({ error: 'Failed to load orders' });
  }
});

// Add this route to update order status
router.put('/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const orders = loadOrders();
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    order.status = status;
    saveOrders(orders);
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;