// models/userModel.js

/**
 * Defines the structure of a User object.
 * 
 * @typedef {Object} User
 * @property {string} id - Unique identifier for the user.
 * @property {string} name - Name of the user.
 * @property {string} email - Email address of the user.
 * @property {string} password - Password of the user.
 */

class UserModel {
    /**
     * Creates a new instance of UserModel.
     * 
     * @param {string} id - Unique identifier for the user.
     * @param {string} name - Name of the user.
     * @param {string} email - Email address of the user.
     * @param {string} password - Password of the user.
     */
    constructor(id, name, email, password) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.password = password;
    }
  }
  
  module.exports = UserModel;
  