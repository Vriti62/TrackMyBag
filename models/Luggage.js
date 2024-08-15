const mongoose = require('mongoose');

// TODO: Define the User schema
const UserSchema = new mongoose.Schema({
    // Fields: name, email, password, etc.
});

// TODO: Export the User model
module.exports = mongoose.model('User', UserSchema);
