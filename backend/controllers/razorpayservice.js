const Razorpay = require('razorpay');
const crypto = require('crypto');

// Ensure your .env file has RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create a new Razorpay order
const createOrder = async (amount, currency, receipt) => {
  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
    });
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

// Verify Razorpay payment signature
const verifyPaymentSignature = (orderId, paymentId, signature) => {
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};

module.exports = { createOrder, verifyPaymentSignature };

