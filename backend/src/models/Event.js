const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    eventTitle: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    tagline: {
      type: String,
      trim: true,
      maxlength: [300, 'Tagline cannot exceed 300 characters'],
    },
    eventBrief: {
      type: String,
      required: [true, 'Event brief is required'],
      trim: true,
    },
    eventImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    eventDate: {
      type: String,
      required: [true, 'Event date is required'],
    },
    eventVenue: {
      type: String,
      required: [true, 'Event venue is required'],
      trim: true,
    },
    eventType: {
      type: String,
      enum: ['conference', 'orientation', 'symposium', 'festival', 'career', 'sports', 'other'],
      required: [true, 'Event type is required'],
    },
    participantCount: {
      type: String,
      default: '',
    },
    eventStatus: {
      type: String,
      enum: ['featured', 'upcoming', 'past', 'draft'],
      default: 'upcoming',
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
  {
    timestamps: true,
  }
);

eventSchema.index({ eventType: 1, isActive: 1 });
eventSchema.index({ eventStatus: 1 });
eventSchema.index({ order: 1 });

module.exports = mongoose.model('Event', eventSchema); 