const fs = require("fs");
const path = require("path");
const LuggageModel = require("../models/luggageModel");

const luggageFilePath = path.join(__dirname, "../data/luggage.json");

const readData = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
};

const writeData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

// Yashmit
exports.getAllLuggage = (req, res) => {
  try {
    const luggage = readData(luggageFilePath);
    res.status(200).json(luggage);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving luggage", error });
  }
};

// Yashmit
exports.getLuggageById = (req, res) => {
  const { id } = req.params;
  try {
    const luggage = readData(luggageFilePath);
    const item = luggage.find((luggageItem) => luggageItem.id === id);
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ message: "Luggage not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving luggage", error });
  }
};

// Khushi
exports.addLuggage = (req, res) => {
  const { name, status, location, num_lugg } = req.body;

  if (!name || !status || !location || num_lugg === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const luggage = readData(luggageFilePath);
    const maxId =
      luggage.length > 0
        ? Math.max(...luggage.map((luggageItem) => parseInt(luggageItem.id, 10)))
         : 0;
    const newId = (maxId + 1).toString();

    const newLuggage = new LuggageModel(newId, name, status, location, num_lugg);

    luggage.push(newLuggage);
    writeData(luggageFilePath, luggage);

    return res.status(201).json({ message: "Luggage added successfully", luggage: newLuggage });
  } catch (error) {
    return res.status(500).json({ message: "Error adding luggage", error });
  }
};

// Khushi
exports.updateLuggage = (req, res) => {
  const { id } = req.params;
  const { name, status, location } = req.body;

  try {
    const luggage = readData(luggageFilePath);
    const index = luggage.findIndex((luggageItem) => luggageItem.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Luggage not found" });
    }

    if (name) luggage[index].name = name;
    if (status) luggage[index].status = status;
    if (location) luggage[index].location = location;

    writeData(luggageFilePath, luggage);

    res.status(200).json({
      message: "Luggage updated successfully",
      luggage: luggage[index],
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating luggage", error });
  }
};

// Khushi
exports.deleteLuggage = (req, res) => {
  const { id } = req.params;

  try {
    let luggage = readData(luggageFilePath);
    luggage = luggage.filter((luggageItem) => luggageItem.id !== id);

    if (luggage.length === readData(luggageFilePath).length) {
      return res.status(404).json({ message: "Luggage not found" });
    }

    writeData(luggageFilePath, luggage);

    res.status(200).json({ message: "Luggage deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting luggage", error });
  }
};

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
