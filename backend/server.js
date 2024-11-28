const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const {getPlans, createOrder, verifyPayment} = require('./controllers/paymentController')
require('dotenv').config();

const {
  authenticateToken,
  requireRole,
} = require("./middleware/authMiddleware"); // Import middleware

require("dotenv").config();

// Import controllers
const userController = require("./controllers/userController");
const luggageController = require("./controllers/luggageController");
const supportController = require("./controllers/supportcontroller");
const chatbotRoutes = require("./routes/chatbotRoutes");

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default to 3000

const cookieParser = require("cookie-parser");
// Middleware
app.use(cookieParser());

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "uploads/profile-pictures");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// chatbot routes
app.use("/api", chatbotRoutes);
// User Routes
app.post("/api/users/register", userController.registerUser);
app.post("/api/users/login", userController.loginUser);

// Apply authentication middleware to routes that require it
app.get("/api/users/profile", userController.findUser);
app.get("/api/users", userController.getAllUsers);
app.put("/api/users/profile/:id", userController.updateUserProfile);
app.put("/api/users/:id/profile-picture", userController.updateProfilePicture);
app.post(
  "/select-insurance",
  authenticateToken,
  userController.selectInsurancePlan
);
// Help and Support Routes
app.post("/api/support", supportController.createSupportTicket);
app.get("/api/support/tickets", supportController.getUserTickets);

// Luggage Routes with Role-based Protection
app.get("/api/luggage", luggageController.getAllLuggage);
app.get("/api/luggage/:id", luggageController.getLuggageById);
// app.get("/api/luggage", authenticateToken, luggageController.getAllLuggage);
// app.get("/api/luggage/:id", authenticateToken, luggageController.getLuggageById);

// Admin Routes
// app.post("/api/luggage", authenticateToken, requireRole('admin'), luggageController.addLuggage); // Admin only
// app.put("/api/luggage/:id", authenticateToken, requireRole('admin'), luggageController.updateLuggage); // Admin only
// app.delete("/api/luggage/:id", authenticateToken, requireRole('admin'), luggageController.deleteLuggage); // Admin only

app.post("/api/luggage", luggageController.addLuggage); // Admin only
app.put("/api/luggage/:id", luggageController.updateLuggage); // Admin only
app.delete("/api/luggage/:id", luggageController.deleteLuggage); // Admin only

//Payment Routes
app.get("/api/plans", getPlans);
app.post("/api/createOrder", createOrder);
app.post("/api/verifyPayment", verifyPayment);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Add near the top of your server.js file
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const paymentPath = path.join(dataDir, "payment.json");
if (!fs.existsSync(paymentPath)) {
  fs.writeFileSync(paymentPath, JSON.stringify([], null, 2), "utf8");
}
