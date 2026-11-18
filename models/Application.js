const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    projectId: {
      type: String,
      required: true
    },
    projectTitle: {
      type: String,
      required: true
    },
    clientName: {
      type: String,
      default: 'Campus Organizer'
    },
    budget: {
      type: String,
      default: '₹2000'
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Under Review', 'Interviewing', 'Accepted', 'Rejected', 'Withdrawn'],
      default: 'Under Review'
    },
    coverLetter: {
      type: String,
      default: ''
    },
    portfolioLink: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: ''
    },
    estimatedDelivery: {
      type: String,
      default: '2 Weeks'
    },
    termsAgreed: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Application', applicationSchema);
