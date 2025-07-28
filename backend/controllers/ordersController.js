const Order = require('../models/Order');
const razorpayService = require('./razorpayservice');

// Fetch user details (dummy example)
exports.getUserDetails = (req, res) => {
  res.json({ name: "John Doe", email: "john.doe@example.com" });
};

// Checkout route to create an order
exports.checkout = async (req, res) => {
  const { amount, currency, customerInfo, items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty.' });
  }
  if (!amount || !currency) {
    return res.status(400).json({ error: 'Amount and currency are required.' });
  }

  try {
    const razorpayOrder = await razorpayService.createOrder(amount, currency, Date.now().toString());
    if (!razorpayOrder || !razorpayOrder.id) {
      throw new Error('Invalid Razorpay order response');
    }

    const newOrder = new Order({
      amount,
      currency,
      customerInfo,
      items,
      status: 'Placed',
      date: new Date(),
      razorpayOrderId: razorpayOrder.id,
    });

    await newOrder.save();

    // TODO: Clear the user's cart in MongoDB if you implement cart in MongoDB

    res.status(201).json({ message: 'Order placed successfully.', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
};

// Razorpay payment verification route
exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const isValid = razorpayService.verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

  if (isValid) {
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = 'Paid';
    await order.save();

    res.json({ success: true, message: 'Payment verified successfully', order });
  } else {
    res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    const formattedOrders = orders.map(order => ({
      id: order._id,
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
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};