const mongoose = require('mongoose');

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const EducationEntrySchema = new mongoose.Schema({
  board:    { type: String, default: '' },
  course:   { type: String, default: '' }, // for degree / masters
  year:     { type: String, default: '' },
  grade:    { type: String, default: '' },
  document: { type: String, default: '' }, // stored file path/URL
}, { _id: false });

const EducationSchema = new mongoose.Schema({
  sslc:        EducationEntrySchema,
  plusTwo:     EducationEntrySchema,
  degree:      EducationEntrySchema,
  masters:     EducationEntrySchema,
  additional: {
    details:  { type: String, default: '' },
    document: { type: String, default: '' },
  },
}, { _id: false });

const WorkExperienceSchema = new mongoose.Schema({
  company:     { type: String, default: '' },
  position:    { type: String, default: '' },
  duration:    { type: String, default: '' },
  description: { type: String, default: '' },
  document:    { type: String, default: '' },
}, { _id: false });

// ─── Main Schema ──────────────────────────────────────────────────────────────

const ApplicationSchema = new mongoose.Schema(
  {
    // ── Step 1: Personal Details ─────────────────────────────────────────────
    fullName:      { type: String, required: true, trim: true },
    dob:           { type: String, required: true },
    gender:        { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    contactNumber: { type: String, required: true, trim: true },
    email:         { type: String, required: true, trim: true, lowercase: true },
    country:       { type: String, default: '' },
    address:       { type: String, default: '' },
    city:          { type: String, default: '' },
    zip:           { type: String, default: '' },

    // ── Step 2: Educational Details ──────────────────────────────────────────
    education: { type: EducationSchema, default: () => ({}) },

    // ── Step 3: Work Experience ──────────────────────────────────────────────
    workExperience: { type: WorkExperienceSchema, default: () => ({}) },

    // ── Step 4: Payment ──────────────────────────────────────────────────────
    paymentMethod: { type: String, default: '' },

    // ── Admin fields ─────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected'],
      default: 'pending',
    },
    adminNotes: { type: String, default: '' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Index for quick lookup
ApplicationSchema.index({ email: 1 });
ApplicationSchema.index({ status: 1 });
ApplicationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Application', ApplicationSchema);