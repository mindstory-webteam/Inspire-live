const mongoose = require('mongoose');
const slugify = require('slugify');

// Comment reply sub-schema
const replySchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  img: { type: String, default: null },
  email: { type: String, default: null },
  desc: { type: String, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

// Comment sub-schema
const commentSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  img: { type: String, default: null },
  email: { type: String, default: null },
  desc: { type: String, required: true },
  date: { type: Date, default: Date.now },
  isApproved: { type: Boolean, default: false },
  replies: [replySchema],
}, { timestamps: true });

// Main Blog schema – mirrors the existing JSON structure
const blogSchema = new mongoose.Schema({
  // ── Titles & Slugs ─────────────────────────────────────────
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    index: true,
  },

  // ── Images ─────────────────────────────────────────────────
  img:        { type: String, default: null },  // main listing image
  detailsImg: { type: String, default: null },  // hero on details page
  img1:       { type: String, default: null },  // inline grid left
  img2:       { type: String, default: null },  // inline grid right
  img3:       { type: String, default: null },
  img4:       { type: String, default: null },
  img5:       { type: String, default: null },
  img6:       { type: String, default: null },
  smallImg:   { type: String, default: null },  // sidebar / recent posts
  slider: [String],                             // slider images array

  // ── Content ─────────────────────────────────────────────────
  desc:  { type: String, default: '' },   // short excerpt / listing desc
  desc1: { type: String, default: '' },
  desc2: { type: String, default: '' },
  body:  { type: String, default: '' },   // full rich-text body (Markdown / HTML)

  // ── Meta ────────────────────────────────────────────────────
  category:    { type: String, default: 'Uncategorized' },
  tags:        { type: [String], default: [] },
  status:      { type: String, enum: ['Tutorial', 'TIPS', 'FREEBIES', 'News', 'Draft'], default: 'Tutorial' },
  author:      { type: String, default: 'Admin' },
  author_role: { type: String, default: 'admin' },
  authorImg:   { type: String, default: null },

  // ── Date display helpers (kept for frontend compatibility) ──
  day:   { type: Number, default: null },
  month: { type: String, default: null },

  // ── Video ───────────────────────────────────────────────────
  videoUrl:     { type: String, default: null },
  popupVideo:   { type: String, default: null },  // alias
  

  // ── Flags ───────────────────────────────────────────────────
  isPublished:  { type: Boolean, default: true },
  isBlogQuote:  { type: Boolean, default: false },
  isFeatured:   { type: Boolean, default: false },

  // ── Comments ─────────────────────────────────────────────────
  comments: [commentSchema],

  // ── Blog-top list (social / quick meta) ─────────────────────
  blogTopList: [{
    iconName: String,
    name: String,
    path: { type: String, default: '#' },
  }],
}, { timestamps: true });

// Auto-generate slug before saving
blogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Virtual: comment count
blogSchema.virtual('commentCount').get(function () {
  return this.comments.filter(c => c.isApproved).length;
});

blogSchema.set('toJSON', { virtuals: true });
blogSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Blog', blogSchema);
