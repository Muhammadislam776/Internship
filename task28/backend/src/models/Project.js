const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  cover_image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'],
    default: 'ACTIVE'
  },
  dueDate: {
    type: Date
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
