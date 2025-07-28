const Razorpay = require("razorpay");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
require('dotenv').config();
const Payment = require('../models/Payment');



const razorpay = new Razorpay({
  key_id: "rzp_test_jnFll4vBKCwPho",
  key_secret: "rj1C0dsKibu56PiiOhUqdGFp",
});


const plansPath = path.join(__dirname, "../data/plans.json");
const paymentPath = path.join(__dirname, "../data/payment.json");

// Read plans from JSON file
const readPlans = () => {
  const data = fs.readFileSync(plansPath, "utf8");
  return JSON.parse(data);
};

const writePayment = (newData) => {
  try {
    
    if (!fs.existsSync(paymentPath)) {
      fs.writeFileSync(paymentPath, JSON.stringify([], null, 2), "utf8");
    }

    
    let existingData = [];
    try {
      const fileContent = fs.readFileSync(paymentPath, "utf8");
      existingData = fileContent ? JSON.parse(fileContent) : [];
    } catch (parseError) {
      console.log("Empty or invalid JSON file, initializing with empty array");
      existingData = [];
    }

    // Add new data to the array
    existingData.push(newData);

    // Write updated data back to the file
    fs.writeFileSync(paymentPath, JSON.stringify(existingData, null, 2), "utf8");
    console.log("Payment data written successfully.");
  } catch (error) {
    console.error("Error writing payment data:", error);
    throw error; // Propagate the error to handle it in the calling function
  }
};
  

// Get insurance plans
exports.getPlans = (req, res) => {
  const plans = readPlans();
  res.status(200).json(plans);
};


exports.createOrder = async (req, res) => {
  const { amount, currency, receipt } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
    });
    res.status(200).json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.verifyPayment = async (req, res) => {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature,
    userId,
    planId,
    productId,
    amount,
    paymentType
  } = req.body;

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rj1C0dsKibu56PiiOhUqdGFp')
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature === razorpay_signature) {
    
    const paymentPath = path.join(__dirname, "../data/payment.json");
    let payments = [];
    
    if (fs.existsSync(paymentPath)) {
      const paymentData = fs.readFileSync(paymentPath, "utf8");
      payments = paymentData ? JSON.parse(paymentData) : [];
    }

    const paymentRecord = {
      id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      userId: userId,
      planId: planId,
      productId: productId,
      amount: amount,
      paymentType: paymentType,
      status: "verified",
      verified_at: new Date().toISOString()
    };

    payments.push(paymentRecord);

    try {
      fs.writeFileSync(paymentPath, JSON.stringify(payments, null, 2));
      console.log("Payment record created:", paymentRecord);

      res.status(200).json({ 
        success: true, 
        message: 'Payment verified successfully',
        payment: paymentRecord
      });
    } catch (error) {
      console.error("Error writing payment data:", error);
      res.status(500).json({ 
        success: false, 
        message: 'Payment verified but failed to store record'
      });
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }
};

// Example: Save payment after verification
exports.verifyPayment = async (req, res) => {
  const { userId, orderId, paymentId, amount, currency, status } = req.body;
  try {
    const payment = new Payment({ userId, orderId, paymentId, amount, currency, status });
    await payment.save();
    res.status(201).json({ message: 'Payment recorded.', payment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record payment.' });
  }
};

// Example: Get all payments for a user
exports.getUserPayments = async (req, res) => {
  try {
    const userId = req.user?.userId || req.query.userId;
    if (!userId) return res.status(400).json({ error: 'User ID required.' });

    const payments = await Payment.find({ userId });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments.' });
  }
};