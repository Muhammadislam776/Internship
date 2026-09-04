const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  recipientName: {
    type: String,
    required: [true, 'Recipient name is required'],
    trim: true
  },
  recipientEmail: {
    type: String,
    trim: true,
    default: ''
  },
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    default: null
  },
  title: {
    type: String,
    default: 'Certificate of Achievement'
  },
  courseName: {
    type: String,
    required: [true, 'Course/Program name is required'],
    trim: true
  },
  description: {
    type: String,
    default: 'For successfully completing the required training and demonstrating excellence.'
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['Draft', 'Issued', 'Valid', 'Revoked'],
    default: 'Issued'
  },
  revocationReason: {
    type: String,
    default: ''
  },
  designData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  qrCodeUrl: {
    type: String,
    default: ''
  },
  customFields: {
    type: Map,
    of: String,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
