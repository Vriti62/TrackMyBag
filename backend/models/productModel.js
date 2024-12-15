const fs = require('fs');
const path = require('path');

// Path to your products JSON file
const productsFile = path.join(__dirname, '../data/products.json');

/**
 * Load products from the JSON file.
 * If the file doesn't exist or contains invalid JSON, it returns an empty array.
 */
const loadProducts = () => {
  try {
    // Check if the products file exists
    if (!fs.existsSync(productsFile)) {
      return []; // Return an empty array if the file doesn't exist
    }

    // Read the file and parse its contents
    const data = fs.readFileSync(productsFile, 'utf-8');
    return JSON.parse(data); // Parse and return the JSON data
  } catch (error) {
    // Log the error and return an empty array in case of failure
    console.error(`Error reading or parsing ${productsFile}:`, error.message);
    return []; 
  }
};

/**
 * Save products to the JSON file.
 * Ensures the directory exists before saving.
 */
const saveProducts = (products) => {
  try {
    // Ensure the directory exists before writing the file
    const dir = path.dirname(productsFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Create the directory if it doesn't exist
    }

    // Write the products data to the file with a 2-space indentation for readability
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), 'utf-8');
  } catch (error) {
    // Log the error and throw an exception for proper error handling in upstream code
    console.error(`Error writing to ${productsFile}:`, error.message);
    throw new Error('Unable to save products.'); 
  }
};

module.exports = { loadProducts, saveProducts };
