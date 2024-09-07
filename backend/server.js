const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const { authenticateToken, requireRole } = require('./middleware/authMiddleware'); // Import middleware

require('dotenv').config();

// Import controllers
const userController = require("./controllers/userController");
const luggageController = require("./controllers/luggageController");
const supportController = require("./controllers/supportcontroller")

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default to 3000

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies



// User Routes
app.post("/api/users/register", userController.registerUser);
app.post("/api/users/login", userController.loginUser);

// Apply authentication middleware to routes that require it
app.get("/api/users/profile", userController.findUser);
app.put('/api/users/profile/:id', userController.updateUserProfile);


// Help and Support Routes
app.post("/api/support", supportController.createSupportTicket);
app.get("/api/support/tickets",supportController.getUserTickets);

// Luggage Routes with Role-based Protection
app.get("/api/luggage", authenticateToken, luggageController.getAllLuggage);
app.get("/api/luggage/:id", authenticateToken, luggageController.getLuggageById);

// Admin Routes
app.post("/api/luggage", authenticateToken, requireRole('admin'), luggageController.addLuggage); // Admin only
app.put("/api/luggage/:id", authenticateToken, requireRole('admin'), luggageController.updateLuggage); // Admin only
app.delete("/api/luggage/:id", authenticateToken, requireRole('admin'), luggageController.deleteLuggage); // Admin only




// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
