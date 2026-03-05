/**
 * routes/serviceRoutes.js
 * Mount in server.js: app.use('/api/services', serviceRoutes);
 */

const express = require('express');
const router  = express.Router();

const ctrl              = require('../controllers/serviceController');
const { serviceUpload } = require('../middleware/uploadMiddleware');
const { protect, adminOrAbove } = require('../middleware/auth');

// ── Public ────────────────────────────────────────────────────────────────────
// These routes automatically exclude isHidden: true services
router.get('/',           ctrl.getAll);       // list (isActive + !isHidden)
router.get('/slug/:slug', ctrl.getBySlug);    // single by slug (!isHidden)

// ── Admin (named paths BEFORE /:id) ──────────────────────────────────────────
router.get('/admin/all',    protect, adminOrAbove, ctrl.getAllAdmin);   // all including hidden
router.put('/reorder',      protect, adminOrAbove, ctrl.reorder);

router.post('/',            protect, adminOrAbove, serviceUpload, ctrl.create);
router.put('/:id',          protect, adminOrAbove, serviceUpload, ctrl.update);
router.patch('/:id/toggle', protect, adminOrAbove, ctrl.toggleStatus); // toggle isActive
router.patch('/:id/hide',   protect, adminOrAbove, ctrl.toggleHidden); // toggle isHidden ← NEW
router.delete('/:id',       protect, adminOrAbove, ctrl.remove);

// ── Public by Mongo ID (last) ─────────────────────────────────────────────────
// Also excludes hidden services
router.get('/:id', ctrl.getById);

module.exports = router;