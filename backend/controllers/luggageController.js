const fs = require("fs");
const path = require("path");
const LuggageModel = require("../models/luggageModel");
const UserModel = require("../models/userModel");

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
exports.addLuggage = async (req, res) => {
  console.log("Received request body:", req.body);

  const { name, status, location, num_lugg, userId, trackingLink } = req.body;

  if (!name || !status || !location || num_lugg === undefined || !userId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const luggage = readData(luggageFilePath);
    const maxId = luggage.length > 0
      ? Math.max(...luggage.map((luggageItem) => parseInt(luggageItem.id, 10)))
      : 0;
    const newId = (maxId + 1).toString();

    const finalTrackingLink = trackingLink || `TRACK-${newId}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Verify tracking link uniqueness
    const isTrackingLinkTaken = luggage.some(item => item.trackingLink === finalTrackingLink);
    if (isTrackingLinkTaken) {
      return res.status(400).json({ message: "Tracking link already exists" });
    }

    const newLuggage = new LuggageModel(
      newId, 
      name, 
      status, 
      location, 
      parseInt(num_lugg),
      finalTrackingLink,
      userId
    );

    luggage.push(newLuggage);
    writeData(luggageFilePath, luggage);

    // Add only the tracking link to user's trackingLinks array
    const user = await UserModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize trackingLinks array if it doesn't exist
    if (!user.trackingLinks) {
      user.trackingLinks = [];
    }

    // Add the tracking link to user's trackingLinks array
    user.trackingLinks.push(finalTrackingLink);
    await UserModel.updateUser(userId, user);

    return res.status(201).json({ 
      message: "Luggage added successfully and tracking link assigned to user", 
      luggage: newLuggage 
    });
  } catch (error) {
    console.error("Error in addLuggage:", error);
    return res.status(500).json({ 
      message: "Error adding luggage", 
      error: error.message,
      stack: error.stack 
    });
  }
};

// Khushi
exports.updateLuggage = (req, res) => {
  const { id } = req.params;
  const { name, status, location, userId, num_lugg } = req.body;

  try {
    const luggage = readData(luggageFilePath);
    const index = luggage.findIndex((luggageItem) => luggageItem.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Luggage not found" });
    }

    if (name) luggage[index].name = name;
    if (status) luggage[index].status = status;
    if (location) luggage[index].location = location;
    if (userId) luggage[index].userId = userId;
    if (num_lugg !== undefined) luggage[index].num_lugg = parseInt(num_lugg);

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


