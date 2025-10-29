const mongoose = require('mongoose');

const blockchainJobSchema = new mongoose.Schema({
  jobType: {
    type: String,
    enum: ['createBatch', 'transferOwnership'],
    required: true
  },
  orderId: {
    type: String,
    required: false
  },
  payload: {
    type: Object,
    default: {}
  },
  attempts: {
    type: Number,
    default: 0
  },
  maxAttempts: {
    type: Number,
    default: 5
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'failed', 'success'],
    default: 'pending'
  },
  lastError: {
    type: String,
    default: null
  },
  nextAttemptAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('BlockchainJob', blockchainJobSchema);
