const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer"); // Import multer for file uploads
const { getPlans, createOrder, verifyPayment } = require('./controllers/paymentController');
require('dotenv').config();

const { authenticateToken, requireRole } = require("./middleware/authMiddleware"); // Import middleware

// Import controllers
const userController = require("./controllers/userController");
const luggageController = require("./controllers/luggageController");
const supportController = require("./controllers/supportcontroller");
const chatbotRoutes = require("./routes/chatbotRoutes");
const productRoutes = require('./controllers/productRoutes');
const cartRoutes = require('./controllers/cartRoutes');
const orderRoutes = require('./controllers/orderRoutes');

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default to 3000

const cookieParser = require("cookie-parser");

// Middleware
app.use(cookieParser());
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files from 'uploads'
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

// Set up multer for file uploads (images)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'profilePicture') {
      cb(null, path.join(__dirname, 'uploads/profile-pictures'));
    } else {
      cb(null, path.join(__dirname, 'uploads/products'));
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Routes

// Chatbot routes
app.use("/api", chatbotRoutes);

// User Routes
app.post("/api/users/register", userController.registerUser);
app.post("/api/users/login", userController.loginUser);
app.get("/api/users/profile", userController.findUser);
app.get("/api/users", userController.getAllUsers);
app.put("/api/users/profile/:id", userController.updateUserProfile);
app.put("/api/users/:id/profile-picture", authenticateToken, upload.single('profilePicture'), userController.updateProfilePicture); // Upload profile picture
app.post("/select-insurance", authenticateToken, userController.selectInsurancePlan);
app.post("/api/users/update-insurance", authenticateToken, userController.updateInsuranceStatus);

// Help and Support Routes
app.post("/api/support", supportController.createSupportTicket);
app.get("/api/support/tickets", supportController.getUserTickets);

// Luggage Routes
app.get("/api/luggage", luggageController.getAllLuggage);
app.get("/api/luggage/:id", luggageController.getLuggageById);
app.post("/api/luggage", luggageController.addLuggage); // Admin only
app.put("/api/luggage/:id", luggageController.updateLuggage); // Admin only
app.delete("/api/luggage/:id", luggageController.deleteLuggage); // Admin only

// Admin Routes (protected)
app.post("/api/luggage", luggageController.addLuggage); // Admin only
app.put("/api/luggage/:id", luggageController.updateLuggage); // Admin only
app.delete("/api/luggage/:id", luggageController.deleteLuggage); // Admin only

// Payment Routes
app.get("/api/plans", getPlans);
app.post("/api/createOrder", createOrder);
app.post("/api/verifyPayment", verifyPayment);


// Product routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// File Upload Route
app.post("/api/upload", upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.status(200).json({
    message: 'File uploaded successfully',
    filePath: `/uploads/products/${req.file.filename}`
  });
}, (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(500).json({ error: err.message });
  }
  return res.status(500).json({ error: 'An error occurred during file upload' });
});

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