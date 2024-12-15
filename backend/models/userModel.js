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
      const userWithDefaults = {
        ...user,
        profilePicture: user.profilePicture || null,
        hasInsurance: false,
        insuranceDate: null
      };
      users.push(userWithDefaults);
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
      console.log('Updating profile picture in model:', id, profilePicture);
      let users = this.getAllUsers();
      const userIndex = users.findIndex(user => user.id === id);
      
      if (userIndex === -1) {
        console.log('User not found:', id);
        return false;
      }

      users[userIndex] = {
        ...users[userIndex],
        profilePicture
      };

      fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
      console.log('Profile picture updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating profile picture:', error);
      return false;
    }
  }

  // Add this method to UserModel class
  static addLuggageToUser(userId, luggage) {
    try {
      const users = this.getAllUsers();
      const userIndex = users.findIndex(user => user.id === userId);
      
      if (userIndex !== -1) {
        if (!users[userIndex].luggage) {
          users[userIndex].luggage = [];
        }
        users[userIndex].luggage.push(luggage);
        fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding luggage to user:', error);
      return false;
    }
  }

  static async updateUser(userId, updatedUser) {
    try {
      const users = this.getAllUsers();
      const index = users.findIndex(user => user.id === userId);
      
      if (index === -1) {
        return false;
      }

      users[index] = updatedUser;
      fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async getUserById(userId) {
    try {
      const users = this.getAllUsers();
      return users.find(user => user.id === userId);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  static updateInsuranceStatus(userId, insuranceStatus) {
    try {
      console.log('Updating insurance status in model:', userId, insuranceStatus); // Debug log
      let users = this.getAllUsers();
      const userIndex = users.findIndex(user => user.id === userId);
      
      if (userIndex === -1) {
        console.log('User not found:', userId); // Debug log
        return false;
      }

      users[userIndex] = {
        ...users[userIndex],
        hasInsurance: insuranceStatus,
        insuranceDate: new Date().toISOString()
      };

      fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
      console.log('Insurance status updated successfully'); // Debug log
      return true;
    } catch (error) {
      console.error('Error updating insurance status:', error);
      return false;
    }
  }
}

module.exports = UserModel;
