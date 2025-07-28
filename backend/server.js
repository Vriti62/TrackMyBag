const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require('dotenv').config();

const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000; 

// Middleware
app.use(cookieParser());
app.use(cors()); 
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 
app.use("/uploads/products", express.static(path.join(__dirname, "uploads", "products")));

// Create necessary directories if they don't exist
const uploadDir = path.join(__dirname, "uploads/products");
const profilePictureDir = path.join(__dirname, "uploads/profile-pictures");
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(profilePictureDir)) {
  fs.mkdirSync(profilePictureDir, { recursive: true });
}
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Import routers
const chatbotRoutes = require("./routes/chatbot.routes");
const luggageRoutes = require("./routes/luggage.routes");
const supportRoutes = require("./routes/support.routes");
const paymentRoutes = require("./routes/payment.routes");
const uploadRoutes = require("./routes/upload.routes");
const productRoutes = require("./routes/products.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/orders.routes");
const userRoutes = require('./routes/user.routes');

// Use routers
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/luggage", luggageRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Initialize data files (payment data for example)
const paymentPath = path.join(dataDir, "payment.json");
if (!fs.existsSync(paymentPath)) {
  fs.writeFileSync(paymentPath, JSON.stringify([], null, 2), "utf8");
}

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trackMyBag')
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));