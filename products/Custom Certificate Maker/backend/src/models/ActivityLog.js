const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: 'General'
    },
    ip: {
      type: String,
      default: '127.0.0.1'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
