const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
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
      default: 'demo123'
    },
    role: {
      type: String,
      enum: ['Student', 'Client', 'Freelancer', 'Admin'],
      default: 'Student'
    },
    batch: {
      type: String,
      default: "Batch of '26"
    },
    college: {
      type: String,
      default: 'Campus Engineering Institute'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
