const UserModel = require("../models/userModel"); // Ensure this path is correct
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ngrok = require("ngrok"); // Require ngrok
const multer = require('multer');
const path = require('path');

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return emailRegex.test(email);
}

// Function to validate password
function isValidPassword(password) {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;


  return passwordRegex.test(password);
}

exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users
    const users = await UserModel.getAllUsers();

    // Remove sensitive information (like passwords) before sending the response
    const sanitizedUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.status(200).json(sanitizedUsers);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Get user profile
// Rahul
exports.findUser = async (req, res) => {
  // Ensure the token is included in the request headers
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1]; // Assumes 'Bearer <token>'

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure your JWT_SECRET is set in your .env file

    // Fetch the user profile based on the user ID from the token
    const userId = decoded.id;
    const user = await UserModel.getUserById(userId); // Ensure this method is defined in your UserModel
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);

    // Handle token verification errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

// Update user
// Yashmit
exports.updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    const user = await UserModel.getUserById(id); // Ensure this is async
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = { ...user };
    if (username) updatedUser.username = username;
    if (email) updatedUser.email = email;
    if (password) updatedUser.password = await bcrypt.hash(password, 10);

    await UserModel.updateUser(id, updatedUser); // Ensure this is async
    res.status(200).json({ message: "User profile updated" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// User registration
//Vriti
exports.registerUser = async (req, res) => {
  const { username, email, password, role, trackingLinks } = req.body;

  try {
    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format. Email must be a @gmail.com address." });
    }

    // Validate password
    if (!isValidPassword(password)) {
      return res.status(400).json({ 
        error: "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character."
      });
    }

    const users = UserModel.getAllUsers();

    const existingUser = users.find(
      (user) => user.username === username || user.email === email
    );
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const maxId =
      users.length > 0
        ? Math.max(...users.map((user) => parseInt(user.id, 10)))
        : 0;
    const newId = (maxId + 1).toString();

    // Assign the role, default to 'user' if not provided
    const newUser = {
      id: newId,
      username,
      email,
      phoneNumber: null,
      address: null,
      password: hashedPassword,
      role: role || 'user', // Default role is 'user'
      trackingLinks:[] // Store an array of tracking links
    };

    UserModel.saveUser(newUser);

    res.status(201).json({ message: "User registered successfully", trackingLinks: newUser.trackingLinks });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

  exports.selectInsurancePlan = async (req, res) => {
    try {
      const user = req.user;
      const { planId } = req.body; // Extract planId from request body
      const userId = user.id; // Assuming user ID comes from middleware (like authentication)
  
      if (!planId) {
        return res.status(400).json({ error: 'Plan ID is required' });
      }
  
      // Fetch user data
      const users = await UserModel.getUserById(userId); // Adjust to your data fetch method
      if (!users) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Ensure `selectedPlans` field exists in user object
      if (!Array.isArray(user.selectedPlans)) {
        users.selectedPlans = [];
      }
  
      // Check if the plan is already selected
      if (users.selectedPlans.includes(planId)) {
        return res.status(400).json({ error: 'Plan already selected' });
      }
  
      // Add the selected plan to the user's list
      users.selectedPlans.push(planId);
  
      // Save updated user data
      const updatedUser = await UserModel.updateUser(userId, users); // Ensure this updates the database or JSON file
  
      // Respond with success
      res.status(200).json({
        message: 'Insurance plan selected successfully',
        user: updatedUser,
      });
    } catch (error) {
      console.error('Error selecting insurance plan:', error);
  
      // Handle token errors explicitly if you're using authentication
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
  
      // General error handler
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

// User Login
// Rahul
exports.loginUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate input
    if (!username && !email) {
      return res.status(400).json({ error: "Username or email required" });
    }

    // Find the user based on username or email
    const users = UserModel.getAllUsers(); // Adjust according to how you fetch users
    const user = users.find(
      (user) =>
        (username && user.username === username) ||
        (email && user.email === email)
    );

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Create JWT token with user id and role
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, currentPassword, phoneNumber, address } = req.body;

  try {
    // Fetch the current user
    const user = await UserModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password if provided
    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
    }

    // Prepare the update object
    const updatedUser = { ...user };

    // Update username if provided
    if (username && username !== user.username) {
      // Check if the new username is already taken
      const existingUser = await UserModel.getUserByUsername(username);
      if (existingUser && existingUser.id !== id) {
        return res.status(400).json({ error: "Username is already taken" });
      }
      updatedUser.username = username;
    }

    // Update email if provided
    if (email && email !== user.email) {
      // Validate email format
      if (!isValidEmail(email)) {
        return res.status(400).json({ error: "Invalid email format. Email must be a @gmail.com address." });
      }
      // Check if the new email is already in use
      const existingUser = await UserModel.getUserByEmail(email);
      if (existingUser && existingUser.id !== id) {
        return res.status(400).json({ error: "Email is already in use" });
      }
      updatedUser.email = email;
    }

    // Update password if provided
    if (password) {
      // Validate password
      if (!isValidPassword(password)) {
        return res.status(400).json({ 
          error: "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character."
        });
      }
      updatedUser.password = await bcrypt.hash(password, 10);
    }

    // Update phoneNumber if provided
    if (phoneNumber !== undefined) {
      updatedUser.phoneNumber = phoneNumber;
    }

    // Update address if provided
    if (address !== undefined) {
      updatedUser.address = address;
    }

    // Perform the update
    await UserModel.updateUser(id, updatedUser);

    // Remove sensitive information before sending response
    const { password: _, ...userWithoutPassword } = updatedUser;
    res.status(200).json({ message: "User profile updated successfully", user: userWithoutPassword });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/profile-pictures'));
  },
  filename: (req, file, cb) => {
    cb(null, `user-${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
}).single('profilePicture');

// Add new controller method for updating profile picture
exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Updating profile picture for user:', req.params.id);
    console.log('File details:', req.file);

    const profilePicturePath = `/uploads/profile-pictures/${req.file.filename}`;
    const success = await UserModel.updateUserProfilePicture(req.params.id, profilePicturePath);

    if (success) {
      console.log('Profile picture updated successfully:', profilePicturePath);
      res.status(200).json({ 
        message: 'Profile picture updated successfully',
        profilePicture: profilePicturePath 
      });
    } else {
      console.error('Failed to update profile picture in database');
      res.status(500).json({ error: 'Failed to update profile picture' });
    }
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateInsuranceStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Updating insurance status for user:', userId); // Debug log

    const success = await UserModel.updateInsuranceStatus(userId, true);

    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await UserModel.getUserById(userId);
    res.json({ 
      success: true, 
      message: 'Insurance status updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating insurance status:', error);
    res.status(500).json({ error: 'Failed to update insurance status' });
  }
};

module.exports = {
  getAllUsers: exports.getAllUsers,
  findUser: exports.findUser,
  updateUserProfile: exports.updateUserProfile,
  registerUser: exports.registerUser,
  loginUser: exports.loginUser,
  selectInsurancePlan: exports.selectInsurancePlan,
  updateProfilePicture: exports.updateProfilePicture,
  updateInsuranceStatus
};
