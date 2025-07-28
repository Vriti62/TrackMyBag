const mongoose = require('mongoose');

const chatbotResponseSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

module.exports = mongoose.model('ChatbotResponse', chatbotResponseSchema);