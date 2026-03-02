const mongoose = require('mongoose');
const slugify = require('slugify');

const applicationSchema = new mongoose.Schema({
  fullName:       { type: String, required: true },
  email:          { type: String, required: true },
  phone:          { type: String, default: '' },
  coverLetter:    { type: String, default: '' },
  resumeUrl:      { type: String, default: '' },
  resumePublicId: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected'],
    default: 'pending',
  },
  appliedAt: { type: Date, default: Date.now },
});

const careerSchema = new mongoose.Schema(
  {
    title:    { type: String, required: [true, 'Title is required'], trim: true },
    slug:     { type: String, unique: true, index: true },

    // ── Image (same pattern as Event model) ──────────────────────────────────
    image: {
      url:      { type: String, default: '' },
      publicId: { type: String, default: '' },
    },

    // kept for backward-compat but no longer used on frontend
    iconName: { type: String, default: '' },

    category: { type: String, required: [true, 'Category is required'], trim: true },
    need: {
      type: String,
      enum: ['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote'],
      default: 'Full Time',
    },
    location:    { type: String, required: [true, 'Location is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },

    requirements:         { type: String, default: '' },
    requirementsList:     [{ type: String }],
    responsibilities:     { type: String, default: '' },
    responsibilitiesList: [{ type: String }],

    jobNumber:    { type: String,  default: '' },
    company:      { type: String,  default: '' },
    website:      { type: String,  default: '' },
    salaryMin:    { type: Number,  default: null },
    salaryMax:    { type: Number,  default: null },
    salaryPeriod: {
      type: String,
      enum: ['hour', 'day', 'week', 'month', 'year'],
      default: 'month',
    },
    vacancy:       { type: Number,  default: 1 },
    applyDeadline: { type: Date,    default: null },
    tags:          [{ type: String }],
    isActive:      { type: Boolean, default: true },

    applications: [applicationSchema],
  },
  { timestamps: true }
);

// ── Auto-generate unique slug from title ─────────────────────────────────────
careerSchema.pre('save', async function (next) {
  if (this.isModified('title') || !this.slug) {
    let base = slugify(this.title, { lower: true, strict: true });
    let slug = base;
    let count = 1;
    while (await mongoose.model('Career').exists({ slug, _id: { $ne: this._id } })) {
      slug = `${base}-${count++}`;
    }
    this.slug = slug;
  }
  next();
});

careerSchema.index({ isActive: 1, createdAt: -1 });
careerSchema.index({ category: 1 });
careerSchema.index({ '$**': 'text' });

module.exports = mongoose.model('Career', careerSchema);