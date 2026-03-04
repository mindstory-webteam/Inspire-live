/**
 * routes/testimonialRoutes.js
 *
 * Mount in server.js:
 *   const { testimonialRoutes, testimonialAdminRoutes } = require('./routes/testimonialRoutes');
 *   app.use('/api/testimonials',       testimonialRoutes);
 *   app.use('/api/admin/testimonials', testimonialAdminRoutes);
 */
const express = require('express');

const ctrl = require('../controllers/testimonialController');
const { protect, adminOrAbove } = require('../middleware/auth');
const { uploadImage, handleMulterError } = require('../middleware/uploadMiddleware');

// Multer — accept up to 3 image fields (author photo + 2 logo variants)
const testimonialUpload = uploadImage.fields([
  { name: 'img',          maxCount: 1 },
  { name: 'logoImg',      maxCount: 1 },
  { name: 'logoImgLight', maxCount: 1 },
]);

// ── Public routes  →  /api/testimonials ───────────────────────────────────────
const testimonialRoutes = express.Router();

testimonialRoutes.get('/',    ctrl.getAll);
testimonialRoutes.get('/:id', ctrl.getById);

// ── Admin routes  →  /api/admin/testimonials ──────────────────────────────────
const testimonialAdminRoutes = express.Router();

testimonialAdminRoutes.use(protect, adminOrAbove);

// ⚠️  STATIC routes MUST come before dynamic /:id routes to avoid
//     Express treating "reorder" as an :id param value.
testimonialAdminRoutes.get('/',              ctrl.adminGetAll);
testimonialAdminRoutes.post('/',             testimonialUpload, handleMulterError, ctrl.create);
testimonialAdminRoutes.patch('/reorder',     ctrl.reorder);           // static — BEFORE /:id routes
testimonialAdminRoutes.put('/:id',           testimonialUpload, handleMulterError, ctrl.update);
testimonialAdminRoutes.patch('/:id/toggle',  ctrl.toggleStatus);      // dynamic — AFTER /reorder
testimonialAdminRoutes.delete('/:id',        ctrl.remove);

module.exports = { testimonialRoutes, testimonialAdminRoutes };