const mongoose = require('mongoose');

const luggageSchema = new mongoose.Schema({
  name: String,
  status: String,
  location: String,
  qrCodeURL: String // URL for QR code
});

module.exports = mongoose.model('Luggage', luggageSchema);
