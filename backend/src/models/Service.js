const mongoose = require('mongoose');

const benefitSchema = new mongoose.Schema(
  {
    number:      { type: String, required: true },
    title:       { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer:   { type: String, required: true },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    // ── Core ─────────────────────────────────────────────────────────────────
    title:            { type: String, required: [true, 'Title is required'], trim: true },
    slug:             { type: String, required: true, unique: true, lowercase: true, trim: true },
    subtitle:         { type: String, trim: true, default: '' },
    shortDescription: { type: String, trim: true, default: '' },
    icon:             { type: String, trim: true, default: '' },

    // ── Images — Cloudinary secure URLs ──────────────────────────────────────
    heroImage:    { type: String, default: '' },
    detailImage1: { type: String, default: '' },
    detailImage2: { type: String, default: '' },

    // Cloudinary public_ids (needed to delete old images on update)
    heroImageId:    { type: String, default: '' },
    detailImage1Id: { type: String, default: '' },
    detailImage2Id: { type: String, default: '' },

    // ── Content ───────────────────────────────────────────────────────────────
    description1: { type: String, default: '' },
    description2: { type: String, default: '' },

    // ── Key Features checklist ────────────────────────────────────────────────
    keyFeatures: [{ type: String }],

    // ── Why Choose section ────────────────────────────────────────────────────
    whyChooseHeading: { type: String, default: '' },
    whyChooseText:    { type: String, default: '' },

    // ── Numbered Benefits ─────────────────────────────────────────────────────
    benefits: [benefitSchema],

    // ── FAQs ──────────────────────────────────────────────────────────────────
    faqs: [faqSchema],

    // ── SEO ───────────────────────────────────────────────────────────────────
    metaTitle:       { type: String, default: '' },
    metaDescription: { type: String, default: '' },

    // ── Status & Order ────────────────────────────────────────────────────────
    isActive: { type: Boolean, default: true },
    order:    { type: Number,  default: 0 },

    // ── Visibility (hidden from client/public, still exists in DB) ────────────
    isHidden: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-generate slug from title if not provided
serviceSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
  next();
});

serviceSchema.index({ order: 1 });
serviceSchema.index({ slug: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ isHidden: 1 });

module.exports = mongoose.model('Service', serviceSchema);