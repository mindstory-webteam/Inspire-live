/**
 * models/Testimonial.js
 */
const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    authorName: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    authorDesig: {
      type: String,
      trim: true,
      default: '',
    },
    desc2: {
      type: String,
      required: [true, 'Testimonial text is required'],
      trim: true,
    },
    // Author photo — stored as Cloudinary URL string (same as heroImage in services)
    img: {
      type: String,
      default: '',
    },
    imgPublicId: {
      type: String,
      default: '',
    },
    // Optional company logo (light + dark variants)
    logoImg: {
      type: String,
      default: '',
    },
    logoImgPublicId: {
      type: String,
      default: '',
    },
    logoImgLight: {
      type: String,
      default: '',
    },
    logoImgLightPublicId: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);