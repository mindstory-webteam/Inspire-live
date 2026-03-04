const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team member name is required'],
      trim: true,
    },
    desig: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
    },
    img: {
      type: String,
      default: '/images/team/team-1.webp',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    facebook: { type: String, default: 'https://www.facebook.com/' },
    instagram: { type: String, default: 'https://www.instagram.com/' },
    twitter:  { type: String, default: 'https://x.com/' },
    linkedin: { type: String, default: 'https://www.linkedin.com/' },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);