const fs = require('fs');
const path = require('path');

// Path to the cart JSON file
const cartFile = path.join(__dirname, '../data/cart.json');

/**
 * Load the cart from the JSON file.
 * If the file doesn't exist or contains invalid JSON, it returns an empty array.
 */
const loadCart = () => {
  try {
    // Check if the cart file exists
    if (!fs.existsSync(cartFile)) {
      return []; // Return an empty array if the file doesn't exist
    }

    // Read the file and parse its contents
    const data = fs.readFileSync(cartFile, 'utf-8');
    return JSON.parse(data); // Parse and return the JSON data
  } catch (error) {
    // Log the error and return an empty array in case of failure
    console.error(`Error reading or parsing ${cartFile}:`, error.message);
    return []; 
  }
};

/**
 * Save the cart to the JSON file.
 * Ensures the directory exists before saving.
 */
const saveCart = (cart) => {
  try {
    // Ensure the directory exists before writing the file
    const dir = path.dirname(cartFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Create the directory if it doesn't exist
    }

    // Write the cart data to the file with 2-space indentation for readability
    fs.writeFileSync(cartFile, JSON.stringify(cart, null, 2), 'utf-8');
  } catch (error) {
    // Log the error and throw an exception for proper error handling in upstream code
    console.error(`Error writing to ${cartFile}:`, error.message);
    throw new Error('Unable to save cart.');
  }
};

module.exports = { loadCart, saveCart };
