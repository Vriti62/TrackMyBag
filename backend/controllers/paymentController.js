const Razorpay = require("razorpay");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
require('dotenv').config();


// Load Razorpay credentials
const razorpay = new Razorpay({
  key_id: "rzp_test_igrAjQy1wbOunD",
  key_secret: "ukk90zKHeA74WvhVr8C7qCDz",
});

// Path to the plans.json file
const plansPath = path.join(__dirname, "../data/plans.json");
const paymentPath = path.join(__dirname, "../data/payment.json");

// Read plans from JSON file
const readPlans = () => {
  const data = fs.readFileSync(plansPath, "utf8");
  return JSON.parse(data);
};

const writePayment = (newData) => {
  try {
    // Create the payment.json file with an empty array if it doesn't exist
    if (!fs.existsSync(paymentPath)) {
      fs.writeFileSync(paymentPath, JSON.stringify([], null, 2), "utf8");
    }

    // Read existing data, if file is empty initialize with empty array
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

// Create Razorpay order
exports.createOrder = async (req, res) => {
  const { planId, userId } = req.body;

  const plans = readPlans();
  const selectedPlan = plans.find((plan) => plan.id === planId);

  if (!selectedPlan) {
    return res.status(404).json({ error: "Plan not found" });
  }

  const options = {
    amount: selectedPlan.amount*100, // Convert to paise
    currency: "INR",
    receipt: `receipt_${userId}_${planId}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
    writePayment(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Verify Razorpay payment
exports.verifyPayment = async (req, res) => {
  const { order_id, payment_id, signature, planId, userId } = req.body;
  console.log("Received verification request:", { order_id, payment_id, signature, planId, userId });

  try {
    // Verify the signature
    const expectedSignature = crypto
      .createHmac("sha256", "ukk90zKHeA74WvhVr8C7qCDz")
      .update(order_id + "|" + payment_id)
      .digest("hex");

    console.log("Signature comparison:", {
      received: signature,
      expected: expectedSignature
    });

    if (expectedSignature === signature) {
      try {
        // Update user's insurance status in users.json
        const userPath = path.join(__dirname, "../data/user.json");
        console.log("Reading users from:", userPath);
        
        let users = [];
        if (fs.existsSync(userPath)) {
          const userData = fs.readFileSync(userPath, "utf8");
          users = JSON.parse(userData);
          
          // Find and update user with all details
          const userIndex = users.findIndex(user => user.id === userId);
          console.log("User search result:", { userIndex, userId });
          
          if (userIndex !== -1) {
            // Keep all existing user data and update insurance status
            users[userIndex] = {
              ...users[userIndex],
              insuranceClaimed: true,
              insuranceDetails: {
                planId: planId,
                purchaseDate: new Date().toISOString(),
                paymentId: payment_id,
                orderId: order_id
              }
            };

            // Write updated user data back to file
            fs.writeFileSync(userPath, JSON.stringify(users, null, 2));
            console.log("Updated user data:", users[userIndex]);

            // Create payment record
            const paymentPath = path.join(__dirname, "../data/payment.json");
            let payments = [];
            
            if (fs.existsSync(paymentPath)) {
              const paymentData = fs.readFileSync(paymentPath, "utf8");
              payments = paymentData ? JSON.parse(paymentData) : [];
            }

            const paymentRecord = {
              id: order_id,
              payment_id: payment_id,
              status: "claimed",
              user_id: userId,
              plan_id: planId,
              verified_at: new Date().toISOString(),
              userDetails: {
                username: users[userIndex].username,
                email: users[userIndex].email,
                phoneNumber: users[userIndex].phoneNumber
              }
            };

            payments.push(paymentRecord);
            fs.writeFileSync(paymentPath, JSON.stringify(payments, null, 2));
            console.log("Payment record created:", paymentRecord);

            // Send success response with updated user data
            res.status(200).json({
              success: true,
              message: "Payment verified successfully",
              insuranceClaimed: true,
              payment: paymentRecord,
              userData: users[userIndex]  // Send complete updated user data
            });
          } else {
            console.log("User not found in users.json");
            res.status(404).json({
              success: false,
              message: "User not found"
            });
          }
        } else {
          console.log("users.json does not exist");
          res.status(500).json({
            success: false,
            message: "User data file not found"
          });
        }
      } catch (fileError) {
        console.error("File operation error:", fileError);
        res.status(500).json({
          success: false,
          message: "Error updating records: " + fileError.message
        });
      }
    } else {
      console.log("Signature verification failed");
      res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message
    });
  }
};