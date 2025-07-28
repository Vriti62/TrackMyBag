const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  amount: Number,
  currency: String,
  customerInfo: {
    name: String,
    email: String,
    phone: String,
    address: String,
  },
  items: Array,
  status: { type: String, default: 'Placed' },
  date: { type: Date, default: Date.now },
  razorpayOrderId: String,
});

module.exports = mongoose.model('Order', orderSchema);