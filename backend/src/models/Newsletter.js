const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type:     String,
      required: [true, 'Email is required'],
      unique:   true,
      lowercase: true,
      trim:     true,
      match:    [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    status: {
      type:    String,
      enum:    ['active', 'unsubscribed'],
      default: 'active',
    },
    source: {
      type:    String,
      default: 'footer', // where the subscription came from
    },
    agreedToTerms: {
      type:    Boolean,
      default: false,
    },
    subscribedAt: {
      type:    Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast queries
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ status: 1 });
newsletterSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Newsletter', newsletterSchema);