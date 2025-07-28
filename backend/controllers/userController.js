const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required.' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: 'Email already registered.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed.' });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required.' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: 'Invalid credentials.' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed.' });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
};

// Get user profile
exports.findUser = async (req, res) => {
  try {
    const userId = req.user?.userId || req.query.id;
    if (!userId) return res.status(400).json({ error: 'User ID required.' });

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user.' });
  }
};

// Update profile picture
exports.updateProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const user = await User.findByIdAndUpdate(
      id,
      { profilePicture: `/uploads/profile-pictures/${req.file.filename}` },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json({ message: 'Profile picture updated.', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile picture.' });
  }
};

// Select insurance plan
exports.selectInsurancePlan = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { insurancePlan } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { insurancePlan },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json({ message: 'Insurance plan selected.', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to select insurance plan.' });
  }
};

// Update insurance status
exports.updateInsuranceStatus = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { insuranceStatus } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { insuranceStatus },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json({ message: 'Insurance status updated.', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update insurance status.' });
  }
};
