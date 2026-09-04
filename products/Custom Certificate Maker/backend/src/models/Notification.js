const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'system'],
      default: 'info'
    },
    read: {
      type: Boolean,
      default: false
    },
    targetRole: {
      type: String,
      default: 'admin'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
