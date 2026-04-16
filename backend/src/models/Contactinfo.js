const mongoose = require('mongoose');

/**
 * ContactInfo — stores the 4 contact cards shown in ContactTop.jsx
 * (Location, Email, Phone, Live Chat)
 */
const contactInfoSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['location', 'email', 'phone', 'livechat'],
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    // For location: plain text address
    // For email/phone/livechat: stored as array of { label, value, href }
    lines: [
      {
        label: { type: String, trim: true, default: '' },
        value: { type: String, trim: true, required: true },
        href:  { type: String, trim: true, default: '' },
      },
    ],
    isActive: { type: Boolean, default: true },
    order:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

contactInfoSchema.index({ order: 1 });

module.exports = mongoose.model('ContactInfo', contactInfoSchema);