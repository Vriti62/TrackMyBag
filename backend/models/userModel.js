const fs = require("fs");
const path = require("path");

const USERS_FILE_PATH = path.join(__dirname, "../data/user.json");

class UserModel {
  // Get all users from the file
  static getAllUsers() {
    try {
      const data = fs.readFileSync(USERS_FILE_PATH, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading users file:", error);
      return [];
    }
  }

  // Get user by ID
  static getUserById(id) {
    try {
      const users = UserModel.getAllUsers();
      return users.find((user) => user.id === id);
    } catch (error) {
      console.error("Error finding user by id:", error);
      return null;
    }
  }

  // Get user by username or email
  static getUserByUsernameOrEmail(username, email) {
    try {
      const users = UserModel.getAllUsers();
      return users.find(
        (user) => user.username === username || user.email === email
      );
    } catch (error) {
      console.error("Error finding user by username or email:", error);
      return null;
    }
  }

  // Save a new user to the file
  static saveUser(user) {
    try {
      const users = UserModel.getAllUsers();
      users.push(user);
      fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
    } catch (error) {
      console.error("Error saving user to file:", error);
    }
  }

  // Update an existing user
  static updateUser(id, updatedUser) {
    try {
      let users = UserModel.getAllUsers();
      users = users.map((user) => (user.id === id ? updatedUser : user));
      fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
    } catch (error) {
      console.error("Error updating user in file:", error);
    }
  }

  // New method to update user tunnel URLs
  static updateUserTunnels(id, tunnelUrls) {
    try {
      let users = UserModel.getAllUsers();
      users = users.map((user) => {
        if (user.id === id) {
          return { ...user, tunnelUrls }; // Update the tunnelUrls
        }
        return user;
      });
      fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
    } catch (error) {
      console.error("Error updating user tunnels in file:", error);
    }
  }

  static validateRole(role) {
    const validRoles = ["user", "admin"];
    return validRoles.includes(role);
  }

  // Update user's profile picture
  static updateUserProfilePicture(id, profilePicture) {
    try {
      let users = UserModel.getAllUsers();
      users = users.map((user) => {
        if (user.id === id) {
          return { ...user, profilePicture };
        }
        return user;
      });
      fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
      return true;
    } catch (error) {
      console.error("Error updating user profile picture:", error);
      return false;
    }
  }
}

module.exports = UserModel;
