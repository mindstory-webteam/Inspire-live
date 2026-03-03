const express = require('express');
const blogRouter = express.Router();
const adminRouter = express.Router();
const blogController = require('../controllers/blogController');
const { uploadImage } = require('../middleware/uploadMiddleware');
const { protect, adminOrAbove } = require('../middleware/auth');

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC BLOG ROUTES (blogRouter) - /api/blogs
// ═══════════════════════════════════════════════════════════════════════════

blogRouter.get('/', blogController.getBlogs);
blogRouter.get('/categories', blogController.getCategories);
blogRouter.get('/tags', blogController.getTags);
blogRouter.get('/:id', blogController.getBlog);
blogRouter.post('/:id/comments', blogController.addComment);

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN BLOG ROUTES (adminRouter) - /api/admin
// ═══════════════════════════════════════════════════════════════════════════

// admin AND superadmin can access everything below
adminRouter.use(protect, adminOrAbove);

adminRouter.get('/blogs', blogController.adminGetBlogs);
adminRouter.get('/stats', blogController.getStats);

adminRouter.post(
  '/blogs',
  uploadImage.fields([
    { name: 'img',        maxCount: 1 },
    { name: 'detailsImg', maxCount: 1 },
    { name: 'img1',       maxCount: 1 },
    { name: 'img2',       maxCount: 1 },
    { name: 'img3',       maxCount: 1 },
    { name: 'img4',       maxCount: 1 },
    { name: 'img5',       maxCount: 1 },
    { name: 'img6',       maxCount: 1 },
    { name: 'smallImg',   maxCount: 1 },
    { name: 'videoImg',   maxCount: 1 },
  ]),
  blogController.createBlog
);

adminRouter.put(
  '/blogs/:id',
  uploadImage.fields([
    { name: 'img',        maxCount: 1 },
    { name: 'detailsImg', maxCount: 1 },
    { name: 'img1',       maxCount: 1 },
    { name: 'img2',       maxCount: 1 },
    { name: 'img3',       maxCount: 1 },
    { name: 'img4',       maxCount: 1 },
    { name: 'img5',       maxCount: 1 },
    { name: 'img6',       maxCount: 1 },
    { name: 'smallImg',   maxCount: 1 },
    { name: 'videoImg',   maxCount: 1 },
  ]),
  blogController.updateBlog
);

adminRouter.delete('/blogs/:id', blogController.deleteBlog);
adminRouter.patch('/blogs/:id/comments/:commentId/approve', blogController.approveComment);
adminRouter.delete('/blogs/:id/comments/:commentId', blogController.deleteComment);
adminRouter.post('/blogs/:id/comments/:commentId/reply', blogController.replyToComment);

module.exports = { blogRouter, adminRouter };