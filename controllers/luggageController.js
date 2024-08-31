const fs = require('fs');
const path = require('path');
const LuggageModel = require('../models/luggageModel');

// Define the path to the JSON files for luggage
const luggageFilePath = path.join(__dirname, '../data/luggage.json');

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

// Get all luggage
// Khushi
exports.getAllLuggage = (req, res) => {
  try {
    const luggage = readData(luggageFilePath);
    res.status(200).json(luggage);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving luggage', error });
  }
};

// Get luggage by ID
// Khushi
exports.getLuggageById = (req, res) => {
  const { id } = req.params;
  try {
    const luggage = readData(luggageFilePath);
    const item = luggage.find(luggageItem => luggageItem.id === id);
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ message: 'Luggage not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving luggage', error });
  }
};

// Add new luggage
// Yashmit
exports.addLuggage = (req, res) => {
  const { name, status, location } = req.body;
  const owner = req.user.id; // Extract user ID from authenticated user

  if (!name || !status || !location) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const luggage = readData(luggageFilePath);
    const newLuggage = new LuggageModel(
      Date.now().toString(), // Generate a unique ID
      name,
      status,
      location,
      owner
    );

    luggage.push(newLuggage);
    writeData(luggageFilePath, luggage);

    res.status(201).json({ message: 'Luggage added successfully', luggage: newLuggage });
  } catch (error) {
    res.status(500).json({ message: 'Error adding luggage', error });
  }
};

// Update luggage by ID
// Yashmit
exports.updateLuggage = (req, res) => {
  const { id } = req.params;
  const { name, status, location } = req.body;

  try {
    const luggage = readData(luggageFilePath);
    const index = luggage.findIndex(luggageItem => luggageItem.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Luggage not found' });
    }

    // Update luggage details
    if (name) luggage[index].name = name;
    if (status) luggage[index].status = status;
    if (location) luggage[index].location = location;

    writeData(luggageFilePath, luggage);

    res.status(200).json({ message: 'Luggage updated successfully', luggage: luggage[index] });
  } catch (error) {
    res.status(500).json({ message: 'Error updating luggage', error });
  }
};

// Delete luggage by ID
// Vriti
exports.deleteLuggage = (req, res) => {
  const { id } = req.params;

  try {
    let luggage = readData(luggageFilePath);
    luggage = luggage.filter(luggageItem => luggageItem.id !== id);

    writeData(luggageFilePath, luggage);

    res.status(200).json({ message: 'Luggage deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting luggage', error });
  }
};
