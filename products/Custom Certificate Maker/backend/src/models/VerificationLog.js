const mongoose = require('mongoose');

const verificationLogSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    uppercase: true
  },
  verificationDate: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1'
  },
  userAgent: {
    type: String,
    default: 'Unknown'
  },
  result: {
    type: String,
    enum: ['VALID', 'REVOKED', 'NOT_FOUND'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('VerificationLog', verificationLogSchema);
