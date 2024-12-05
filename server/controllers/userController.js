const fs = require('fs');
const path = require('path');

// Add path to user data file
const userFilePath = path.join(__dirname, '../data/user.json');

// Helper function to read and write user data
const readUserData = () => {
  if (!fs.existsSync(userFilePath)) {
    return [];
  }
  const data = fs.readFileSync(userFilePath, 'utf8');
  return JSON.parse(data);
};

const writeUserData = (data) => {
  fs.writeFileSync(userFilePath, JSON.stringify(data, null, 2), 'utf8');
};

// Add luggage to specific user
exports.addUserLuggage = async (req, res) => {
  const { userId } = req.params;
  const { name, status, location, num_lugg } = req.body;

  try {
    // Validate required fields
    if (!name || !status || !location || !num_lugg) {
      return res.status(400).json({ error: 'Missing required luggage fields' });
    }

    // Read current user data
    const users = readUserData();
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Initialize luggage array if it doesn't exist
    if (!users[userIndex].luggage) {
      users[userIndex].luggage = [];
    }

    // Create new luggage object
    const newLuggage = {
      id: Date.now().toString(),
      name,
      status,
      location,
      num_lugg
    };

    // Add luggage to user's luggage array
    users[userIndex].luggage.push(newLuggage);

    // Save updated user data
    writeUserData(users);

    res.status(201).json({
      message: 'Luggage added successfully',
      luggage: newLuggage
    });
  } catch (error) {
    console.error('Error adding luggage to user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add tracking link to specific user
exports.addUserTrackingLink = async (req, res) => {
  const { userId } = req.params;
  const { link } = req.body;

  try {
    // Validate tracking link
    if (!link) {
      return res.status(400).json({ error: 'Tracking link is required' });
    }

    // Read current user data
    const users = readUserData();
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Initialize trackingLinks array if it doesn't exist
    if (!users[userIndex].trackingLinks) {
      users[userIndex].trackingLinks = [];
    }

    // Add new tracking link
    users[userIndex].trackingLinks.push(link);

    // Save updated user data
    writeUserData(users);

    res.status(201).json({
      message: 'Tracking link added successfully',
      trackingLinks: users[userIndex].trackingLinks
    });
  } catch (error) {
    console.error('Error adding tracking link to user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 