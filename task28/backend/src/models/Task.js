const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

const taskSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'],
    default: 'TODO'
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM'
  },
  position: {
    type: Number,
    default: 0
  },
  assignee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  due_date: {
    type: Date,
    default: null
  },
  cover_image: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  attachment_count: {
    type: Number,
    default: 0
  },
  subtasks: [subtaskSchema],
  comments: [commentSchema]
}, { timestamps: true });

// Index for column and positioning lookups
taskSchema.index({ project_id: 1, status: 1, position: 1 });

module.exports = mongoose.model('Task', taskSchema);
