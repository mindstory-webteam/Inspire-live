const Blog = require('../models/Blog');
// Fix: Update the path to match your project structure
const { deleteFromCloudinary, getPublicIdFromUrl, isCloudinaryUrl } = require('../middleware/uploadMiddleware');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const buildQuery = (reqQuery) => {
  const { category, tag, search, status, isPublished, author, isFeatured } = reqQuery;
  const query = {};

  if (category)    query.category  = { $regex: category, $options: 'i' };
  if (tag)         query.tags      = { $regex: tag, $options: 'i' };
  if (author)      query.author    = { $regex: author, $options: 'i' };
  if (status)      query.status    = status;
  if (isFeatured)  query.isFeatured = isFeatured === 'true';
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  if (search) {
    query.$or = [
      { title:    { $regex: search, $options: 'i' } },
      { desc:     { $regex: search, $options: 'i' } },
      { body:     { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
      { tags:     { $regex: search, $options: 'i' } },
    ];
  }

  return query;
};

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────

// @route   GET /api/blogs
// @access  Public
exports.getBlogs = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip  = (page - 1) * limit;

    // Default: only published blogs for public
    const isAdmin = req.user?.role === 'admin' || req.user?.role === 'editor';
    if (!isAdmin && req.query.isPublished === undefined) {
      req.query.isPublished = 'true';
    }

    const query = buildQuery(req.query);
    const sort  = req.query.sort || '-createdAt';

    const [blogs, total] = await Promise.all([
      Blog.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Blog.countDocuments(query),
    ]);

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/blogs/:id
// @access  Public (by numeric id OR mongodb _id OR slug)
exports.getBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    let blog;

    // Try ObjectId first
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(id);
    }

    // Try slug
    if (!blog) blog = await Blog.findOne({ slug: id });

    // Fallback: not found
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/blogs/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Blog.distinct('category', { isPublished: true });
    res.json({ success: true, data: categories.filter(Boolean) });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/blogs/tags
// @access  Public
exports.getTags = async (req, res, next) => {
  try {
    const tags = await Blog.distinct('tags', { isPublished: true });
    res.json({ success: true, data: tags.filter(Boolean) });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/blogs/:id/comments
// @access  Public
exports.addComment = async (req, res, next) => {
  try {
    const { authorName, email, desc } = req.body;

    if (!authorName || !desc) {
      return res.status(400).json({ success: false, message: 'Name and comment are required' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    blog.comments.push({
      authorName,
      email,
      desc,
      isApproved: false,
      date: new Date(),
    });

    await blog.save();
    res.status(201).json({ success: true, message: 'Comment submitted for approval' });
  } catch (error) {
    next(error);
  }
};

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────

// @route   POST /api/admin/blogs
// @access  Admin/Editor
exports.createBlog = async (req, res, next) => {
  try {
    // Parse JSON-stringified fields from FormData
    if (typeof req.body.tags === 'string') {
      try { req.body.tags = JSON.parse(req.body.tags); } catch { req.body.tags = []; }
    }
    if (typeof req.body.blogTopList === 'string') {
      try { req.body.blogTopList = JSON.parse(req.body.blogTopList); } catch { req.body.blogTopList = []; }
    }
    // Parse booleans (FormData sends them as strings)
    if (typeof req.body.isPublished === 'string') req.body.isPublished = req.body.isPublished === 'true';
    if (typeof req.body.isFeatured  === 'string') req.body.isFeatured  = req.body.isFeatured  === 'true';
    if (typeof req.body.isBlogQuote === 'string') req.body.isBlogQuote = req.body.isBlogQuote === 'true';

    // Handle Cloudinary uploads - multer-storage-cloudinary stores URL in req.file.path
    if (req.files) {
      Object.keys(req.files).forEach((field) => {
        req.body[field] = req.files[field][0].path; // Cloudinary secure_url
      });
    }
    if (req.file) {
      req.body.img = req.file.path; // Cloudinary secure_url
    }

    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/admin/blogs/:id
// @access  Admin/Editor
exports.updateBlog = async (req, res, next) => {
  try {
    // Get existing blog to track old images
    const existingBlog = await Blog.findById(req.params.id);
    if (!existingBlog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Parse JSON-stringified fields coming from FormData
    if (typeof req.body.tags === 'string') {
      try { req.body.tags = JSON.parse(req.body.tags); } catch { req.body.tags = []; }
    }
    if (typeof req.body.blogTopList === 'string') {
      try { req.body.blogTopList = JSON.parse(req.body.blogTopList); } catch { req.body.blogTopList = []; }
    }
    // Parse booleans (FormData sends them as strings)
    if (typeof req.body.isPublished === 'string') req.body.isPublished = req.body.isPublished === 'true';
    if (typeof req.body.isFeatured  === 'string') req.body.isFeatured  = req.body.isFeatured  === 'true';
    if (typeof req.body.isBlogQuote === 'string') req.body.isBlogQuote = req.body.isBlogQuote === 'true';

    // Track old image URLs for cleanup
    const oldImages = {};

    // Handle new file uploads
    if (req.files) {
      Object.keys(req.files).forEach((field) => {
        // Store old URL if it exists
        if (existingBlog[field] && isCloudinaryUrl(existingBlog[field])) {
          oldImages[field] = existingBlog[field];
        }
        // Set new Cloudinary URL
        req.body[field] = req.files[field][0].path;
      });
    }
    if (req.file) {
      if (existingBlog.img && isCloudinaryUrl(existingBlog.img)) {
        oldImages.img = existingBlog.img;
      }
      req.body.img = req.file.path;
    }

    // Use $set to prevent Mongoose from treating the payload as a raw object replacement
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    // Delete old images from Cloudinary (async, don't block response)
    if (Object.keys(oldImages).length > 0) {
      Promise.all(
        Object.values(oldImages).map(url => {
          const publicId = getPublicIdFromUrl(url);
          if (publicId) {
            return deleteFromCloudinary(publicId, 'image').catch(err =>
              console.error('Failed to delete old image from Cloudinary:', err)
            );
          }
        })
      ).catch(err => console.error('Error cleaning up old images:', err));
    }

    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/admin/blogs/:id
// @access  Admin
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    // Collect all image URLs from the blog
    const imageFields = ['img', 'detailsImg', 'img1', 'img2', 'img3', 'img4', 'img5', 'img6', 'smallImg', 'videoImg'];
    const imagesToDelete = [];

    imageFields.forEach(field => {
      if (blog[field] && isCloudinaryUrl(blog[field])) {
        imagesToDelete.push(blog[field]);
      }
    });

    // Add slider images
    if (blog.slider && Array.isArray(blog.slider)) {
      blog.slider.forEach(url => {
        if (isCloudinaryUrl(url)) {
          imagesToDelete.push(url);
        }
      });
    }

    // Delete blog from database
    await Blog.findByIdAndDelete(req.params.id);

    // Delete all images from Cloudinary (async, don't block response)
    if (imagesToDelete.length > 0) {
      Promise.all(
        imagesToDelete.map(url => {
          const publicId = getPublicIdFromUrl(url);
          if (publicId) {
            return deleteFromCloudinary(publicId, 'image').catch(err =>
              console.error('Failed to delete image from Cloudinary:', err)
            );
          }
        })
      ).catch(err => console.error('Error cleaning up blog images:', err));
    }

    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/admin/blogs
// @access  Admin/Editor  (returns all, including drafts)
exports.adminGetBlogs = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip  = (page - 1) * limit;
    const query = buildQuery(req.query);
    const sort  = req.query.sort || '-createdAt';

    const [blogs, total] = await Promise.all([
      Blog.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Blog.countDocuments(query),
    ]);

    res.json({ success: true, total, page, pages: Math.ceil(total / limit), data: blogs });
  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/admin/blogs/:id/comments/:commentId/approve
// @access  Admin/Editor
exports.approveComment = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    const comment = blog.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    comment.isApproved = true;
    await blog.save();
    res.json({ success: true, message: 'Comment approved' });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/admin/blogs/:id/comments/:commentId
// @access  Admin/Editor
exports.deleteComment = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    blog.comments = blog.comments.filter(
      (c) => c._id.toString() !== req.params.commentId
    );
    await blog.save();
    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/admin/blogs/:id/comments/:commentId/reply
// @access  Admin/Editor
exports.replyToComment = async (req, res, next) => {
  try {
    const { authorName, desc } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    const comment = blog.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    comment.replies.push({ authorName: authorName || req.user.name, desc });
    await blog.save();
    res.json({ success: true, message: 'Reply added' });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/admin/stats
// @access  Admin
exports.getStats = async (req, res, next) => {
  try {
    const [total, published, drafts, featured, pendingComments] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ isPublished: true }),
      Blog.countDocuments({ isPublished: false }),
      Blog.countDocuments({ isFeatured: true }),
      Blog.countDocuments({ 'comments.isApproved': false }),
    ]);

    const categoryStats = await Blog.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const recentBlogs = await Blog.find()
      .sort('-createdAt')
      .limit(5)
      .select('title category isPublished createdAt img');

    res.json({
      success: true,
      data: { total, published, drafts, featured, pendingComments, categoryStats, recentBlogs },
    });
  } catch (error) {
    next(error);
  }
};