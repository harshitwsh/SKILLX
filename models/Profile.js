const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Tanish Mehlawat'
    },
    email: {
      type: String,
      required: true,
      unique: true,
      default: 'tanish@campus.edu'
    },
    role: {
      type: String,
      default: 'Student'
    },
    headline: {
      type: String,
      default: 'Junior Full-Stack React & Node.js Developer'
    },
    batch: {
      type: String,
      default: "Batch of '26"
    },
    college: {
      type: String,
      default: 'Campus Engineering Institute'
    },
    location: {
      type: String,
      default: 'New Delhi, India (IST)'
    },
    verifiedStudent: {
      type: Boolean,
      default: true
    },
    skills: {
      type: [String],
      default: ['React', 'TypeScript', 'Node.js', 'Figma']
    },
    bio: {
      type: String,
      default: 'Passionate software developer and campus innovator building scalable full-stack applications.'
    },
    githubUsername: {
      type: String,
      default: 'tanish-dev'
    },
    stats: {
      activeProjects: { type: Number, default: 0 },
      completedProjects: { type: Number, default: 0 },
      totalEarnings: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Profile', profileSchema);
