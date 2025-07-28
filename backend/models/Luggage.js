const mongoose = require('mongoose');

const luggageSchema = new mongoose.Schema({
  name: String,
  status: String,
  location: String,
  num_lugg: Number,
  trackingLink: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Luggage', luggageSchema);