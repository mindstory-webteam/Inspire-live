const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    iconName: {
      type: String,
      default: 'tji-manage',
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    need: {
      type: String,
      enum: ['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote'],
      default: 'Full Time',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: {
      type: String,
      default: '',
    },
    requirementsList: {
      type: [String],
      default: [],
    },
    responsibilities: {
      type: String,
      default: '',
    },
    responsibilitiesList: {
      type: [String],
      default: [],
    },
    // Job Information sidebar
    jobNumber: {
      type: String,
      default: '',
    },
    company: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    salaryMin: {
      type: Number,
      default: null,
    },
    salaryMax: {
      type: Number,
      default: null,
    },
    salaryPeriod: {
      type: String,
      enum: ['hour', 'day', 'week', 'month', 'year'],
      default: 'month',
    },
    vacancy: {
      type: Number,
      default: 1,
    },
    applyDeadline: {
      type: Date,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // For file uploads (resumes submitted via apply form)
    applications: [
      {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, default: '' },
        coverLetter: { type: String, default: '' },
        resumeUrl: { type: String, default: '' },
        resumePublicId: { type: String, default: '' },
        appliedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ['pending', 'reviewed', 'shortlisted', 'rejected'],
          default: 'pending',
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for formatted salary
careerSchema.virtual('salary').get(function () {
  if (!this.salaryMin && !this.salaryMax) return '';
  if (this.salaryMin && this.salaryMax) {
    return `$${this.salaryMin}-$${this.salaryMax} / ${this.salaryPeriod}`;
  }
  return `$${this.salaryMin || this.salaryMax} / ${this.salaryPeriod}`;
});

// Virtual for formatted vacancy
careerSchema.virtual('vacancyText').get(function () {
  return `${String(this.vacancy).padStart(2, '0')} Available`;
});

// Virtual for formatted apply deadline
careerSchema.virtual('applyOn').get(function () {
  if (!this.applyDeadline) return '';
  return this.applyDeadline.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).toUpperCase();
});

// Index for search
careerSchema.index({ title: 'text', category: 'text', location: 'text' });

const Career = mongoose.model('Career', careerSchema);

module.exports = Career;