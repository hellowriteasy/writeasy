const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  place: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('FAQ', faqSchema);