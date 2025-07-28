const fs = require("fs");
const path = require("path");
const Luggage = require('../models/Luggage');
const User = require('../models/User');

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
exports.getAllLuggage = async (req, res) => {
  try {
    const luggage = await Luggage.find();
    res.status(200).json(luggage);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving luggage", error });
  }
};

// Yashmit
exports.getLuggageById = async (req, res) => {
  try {
    const item = await Luggage.findById(req.params.id);
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
  const { name, status, location, num_lugg, userId, trackingLink } = req.body;

  if (!name || !status || !location || num_lugg === undefined || !userId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Generate a unique tracking link if not provided
    let finalTrackingLink = trackingLink || `TRACK-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Ensure tracking link is unique
    const isTrackingLinkTaken = await Luggage.findOne({ trackingLink: finalTrackingLink });
    if (isTrackingLinkTaken) {
      return res.status(400).json({ message: "Tracking link already exists" });
    }

    const newLuggage = new Luggage({
      name,
      status,
      location,
      num_lugg: parseInt(num_lugg),
      trackingLink: finalTrackingLink,
      userId
    });

    await newLuggage.save();

    // Add tracking link to user's trackingLinks array
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.trackingLinks) user.trackingLinks = [];
    user.trackingLinks.push(finalTrackingLink);
    await user.save();

    return res.status(201).json({
      message: "Luggage added successfully and tracking link assigned to user",
      luggage: newLuggage
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding luggage", error: error.message });
  }
};

// Khushi
exports.updateLuggage = async (req, res) => {
  const { id } = req.params;
  const { name, status, location, userId, num_lugg } = req.body;

  try {
    const luggage = await Luggage.findById(id);
    if (!luggage) {
      return res.status(404).json({ message: "Luggage not found" });
    }

    if (name) luggage.name = name;
    if (status) luggage.status = status;
    if (location) luggage.location = location;
    if (userId) luggage.userId = userId;
    if (num_lugg !== undefined) luggage.num_lugg = parseInt(num_lugg);

    await luggage.save();

    res.status(200).json({
      message: "Luggage updated successfully",
      luggage
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating luggage", error });
  }
};

// Khushi
exports.deleteLuggage = async (req, res) => {
  const { id } = req.params;

  try {
    const luggage = await Luggage.findByIdAndDelete(id);
    if (!luggage) {
      return res.status(404).json({ message: "Luggage not found" });
    }
    res.status(200).json({ message: "Luggage deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting luggage", error });
  }
};


