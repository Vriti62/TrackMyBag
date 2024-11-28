const UserModel = require("../models/userModel"); // Ensure this path is correct
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Get user profile
// Rahul
exports.findUser = async (req, res) => {
  // Ensure the token is included in the request headers
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(' ')[1]; // Assumes 'Bearer <token>'

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
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
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
// Vriti
exports.registerUser = async (req, res) => {
  const { username, email, password, role } = req.body; // Include role in request body

  try {
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
      password: hashedPassword,
      role: role || 'user', // Default role is 'user'
    };

    UserModel.saveUser(newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
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
      (user) => (username && user.username === username) || (email && user.email === email)
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
