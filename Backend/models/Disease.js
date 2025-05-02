const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  symptoms: [{
    type: String,
    required: true
  }],
  causes: {
    type: String,
    required: true
  },
  treatment: {
    type: String,
    required: true
  },
  prevention: {
    type: String,
    required: true
  },
  plantTypes: [{
    type: String,
    required: true
  }],
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  imageUrl: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Disease', diseaseSchema);
