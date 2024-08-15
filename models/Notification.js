const mongoose = require('mongoose');

// TODO: Define the Notification schema
const NotificationSchema = new mongoose.Schema({
    // Fields: user, message, read status, etc.
});

// TODO: Export the Notification model
module.exports = mongoose.model('Notification', NotificationSchema);
