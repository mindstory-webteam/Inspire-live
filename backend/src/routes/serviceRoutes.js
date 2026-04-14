const express = require('express');
const router  = express.Router();

const ctrl              = require('../controllers/serviceController');
const { serviceUpload } = require('../middleware/upload');
const { protect, adminOrAbove } = require('../middleware/auth');

// ── Public ────────────────────────────────────────────────────────────────────
router.get('/',           ctrl.getAll);
router.get('/slug/:slug', ctrl.getBySlug);

// ── Admin (named paths BEFORE /:id) ──────────────────────────────────────────
router.get('/admin/all',    protect, adminOrAbove, ctrl.getAllAdmin);
router.get('/admin/:id',    protect, adminOrAbove, ctrl.getByIdAdmin);  // ← NEW
router.put('/reorder',      protect, adminOrAbove, ctrl.reorder);

router.post('/',            protect, adminOrAbove, serviceUpload, ctrl.create);
router.put('/:id',          protect, adminOrAbove, serviceUpload, ctrl.update);
router.patch('/:id/toggle', protect, adminOrAbove, ctrl.toggleStatus);
router.patch('/:id/hide',   protect, adminOrAbove, ctrl.toggleHidden);
router.delete('/:id',       protect, adminOrAbove, ctrl.remove);

// ── Public by Mongo ID (last) ─────────────────────────────────────────────────
router.get('/:id', ctrl.getById);

module.exports = router;