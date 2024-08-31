// controllers/userController.js

const fs = require('fs');
const path = require('path');
const UserModel = require('../models/userModel');
const jwtUtils = require('../utils/jwtUtils');

// Define the path to the JSON files for users
const userFilePath = path.join(__dirname, '../data/users.json');

// Helper functions to read and write JSON data
const readData = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

const writeData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Get user profile
// Vriti
exports.getUserProfile = (req, res) => {
  const { id } = req.user;
  try {
    const users = readData(userFilePath);
    const user = users.find(userItem => userItem.id === id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user profile' });
  }
};

// Update user profile
// Rahul
exports.updateUserProfile = (req, res) => {
  const { id } = req.user;
  const { username, email } = req.body;

  try {
    const users = readData(userFilePath);
    const index = users.findIndex(userItem => userItem.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user details
    if (username) users[index].username = username;
    if (email) users[index].email = email;

    writeData(userFilePath, users);

    res.status(200).json({ message: 'User profile updated successfully', user: users[index] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user profile' });
  }
};

// User registration
// Rahul
exports.registerUser = (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const users = readData(userFilePath);
    const newUser = new UserModel(
      Date.now().toString(), // Generate a unique ID
      username,
      password, // You should hash passwords before storing
      email
    );

    users.push(newUser);
    writeData(userFilePath, users);

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// User Login
// Rahul
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const users = readData(userFilePath);
    const user = users.find(userItem => userItem.username === username && userItem.password === password);

    if (user) {
      const token = jwtUtils.generateToken(user.id); // Generate JWT token
      res.status(200).json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in' });
  }
};
