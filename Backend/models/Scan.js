const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous scans
  },
  imageUrl: {
    type: String,
    required: true
  },
  result: {
    disease: {
      type: String,
      required: true
    },
    confidence: {
      type: Number,
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true
    },
    healthScore: {
      type: Number,
      required: true
    },
    treatment: {
      type: String,
      required: true
    },
    prevention: {
      type: String,
      required: true
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Scan', scanSchema);
