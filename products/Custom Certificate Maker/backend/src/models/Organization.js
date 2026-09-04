const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true
  },
  logo: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  contactEmail: {
    type: String,
    default: ''
  },
  contactPhone: {
    type: String,
    default: ''
  },
  signature: {
    type: String,
    default: ''
  },
  issuerName: {
    type: String,
    default: ''
  },
  issuerDesignation: {
    type: String,
    default: ''
  },
  signatures: [
    {
      url: String,
      name: String,
      designation: String
    }
  ],
  verified: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Organization', organizationSchema);
