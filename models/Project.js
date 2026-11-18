const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    budget: {
      type: Number,
      required: true
    },
    duration: {
      type: String,
      default: '2 Weeks'
    },
    level: {
      type: String,
      default: 'Intermediate'
    },
    applicants: {
      type: Number,
      default: 0
    },
    deadline: {
      type: String,
      default: 'Open'
    },
    client: {
      name: { type: String, default: 'Campus Organizer' },
      verified: { type: Boolean, default: true },
      rating: { type: String, default: '4.8/5' }
    },
    description: {
      type: String,
      default: ''
    },
    skills: {
      type: [String],
      default: []
    },
    badge: {
      type: String,
      default: 'Verified Campus Organizer'
    },
    timeRemaining: {
      type: String,
      default: '3 days left'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Project', projectSchema);
