const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: [
      'Modern', 'Classic', 'Elegant', 'Corporate', 'Academic',
      'Achievement', 'Technology', 'Internship', 'Appreciation', 'Participation', 'Luxury'
    ],
    default: 'Modern'
  },
  thumbnail: {
    type: String,
    default: ''
  },
  designData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  stylePreset: {
    type: String,
    default: 'classic-gold'
  },
  orientation: {
    type: String,
    enum: ['landscape', 'portrait'],
    default: 'landscape'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Template', templateSchema);
