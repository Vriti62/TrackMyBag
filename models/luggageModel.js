// models/luggageModel.js

/**
 * Defines the structure of a Luggage object.
 * 
 * @typedef {Object} Luggage
 * @property {string} id - Unique identifier for the luggage.
 * @property {string} name - Name or description of the luggage.
 * @property {string} status - Current status of the luggage (e.g., "Checked", "In Transit").
 * @property {string} location - Location of the luggage in "latitude,longitude" format.
 */

class LuggageModel {
    /**
     * Creates a new instance of LuggageModel.
     * 
     * @param {string} id - Unique identifier for the luggage.
     * @param {string} name - Name or description of the luggage.
     * @param {string} status - Current status of the luggage.
     * @param {string} location - Location of the luggage in "latitude,longitude" format.
     */
    constructor(id, name, status, location) {
      this.id = id;
      this.name = name;
      this.status = status;
      this.location = location;
    }
  }
  
  module.exports = LuggageModel;
  