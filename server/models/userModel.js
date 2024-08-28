const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String // Make sure to hash passwords in production
});

module.exports = mongoose.model('User', userSchema);
