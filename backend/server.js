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
} = require("./middleware/authMiddleware");

// Import controllers
const userController = require("./controllers/userController");
const luggageController = require("./controllers/luggageController");
const supportController = require("./controllers/supportcontroller");
const chatbotRoutes = require("./routes/chatbotRoutes");

const app = express();
const port = process.env.PORT || 3000;

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
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
app.get("/api/users/profile", authenticateToken, userController.findUser);
app.get("/api/users", authenticateToken, userController.getAllUsers);
app.put("/api/users/profile/:id", authenticateToken, userController.updateUserProfile);
app.put("/api/users/:id/profile-picture", authenticateToken, userController.updateProfilePicture);

// Help and Support Routes
app.post("/api/support", supportController.createSupportTicket);
app.get("/api/support/tickets", supportController.getUserTickets);

// Luggage Routes
app.get("/api/luggage", authenticateToken, luggageController.getAllLuggage);
app.get("/api/luggage/:id", authenticateToken, luggageController.getLuggageById);
app.post("/api/luggage", authenticateToken, luggageController.addLuggage);
app.put("/api/luggage/:id", authenticateToken, luggageController.updateLuggage);
app.delete("/api/luggage/:id", authenticateToken, luggageController.deleteLuggage);

// Payment Routes
app.get("/api/plans", getPlans);
app.post("/api/createOrder", createOrder);
app.post("/api/verifyPayment", verifyPayment);

// User Luggage and Tracking Routes
app.post(
  "/api/users/:userId/luggage", 
  authenticateToken, 
  requireRole('admin'), 
  userController.addUserLuggage
);

app.post(
  "/api/users/:userId/tracking-links", 
  authenticateToken, 
  requireRole('admin'), 
  userController.addUserTrackingLink
);

// Insurance Routes
app.post(
  "/select-insurance",
  authenticateToken,
  userController.selectInsurancePlan
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Create data directory and files if they don't exist
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const paymentPath = path.join(dataDir, "payment.json");
if (!fs.existsSync(paymentPath)) {
  fs.writeFileSync(paymentPath, JSON.stringify([], null, 2), "utf8");
}
