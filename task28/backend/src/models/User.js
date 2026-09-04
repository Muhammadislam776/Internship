const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  },
  role: {
    type: String,
    enum: ['Lead Developer', 'Product Designer', 'Frontend Lead', 'Backend Engineer', 'DevOps Specialist', 'Project Manager', 'Member'],
    default: 'Member'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
