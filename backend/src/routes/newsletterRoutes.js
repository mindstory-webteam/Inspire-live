const express    = require('express');
const router     = express.Router();
const ctrl       = require('../controllers/newsletterController');
const { protect } = require('../middleware/auth');

// ── PUBLIC ─────────────────────────────────────────────────────────────────
// Mounted at app.use('/api', newsletterRoutes)
// so these resolve to:  POST /api/newsletter/subscribe
//                       GET  /api/newsletter/unsubscribe?email=xxx

router.post('/newsletter/subscribe',  ctrl.subscribe);
router.get( '/newsletter/unsubscribe', ctrl.unsubscribe);

// ── ADMIN ──────────────────────────────────────────────────────────────────
// GET    /api/admin/newsletter/stats
// GET    /api/admin/newsletter/export
// GET    /api/admin/newsletter
// GET    /api/admin/newsletter/:id
// PATCH  /api/admin/newsletter/:id/toggle
// DELETE /api/admin/newsletter/bulk
// DELETE /api/admin/newsletter/:id

router.get(   '/admin/newsletter/stats',       protect, ctrl.getStats);
router.get(   '/admin/newsletter/export',      protect, ctrl.exportSubscribers);
router.get(   '/admin/newsletter',             protect, ctrl.getAll);
router.get(   '/admin/newsletter/:id',         protect, ctrl.getById);
router.patch( '/admin/newsletter/:id/toggle',  protect, ctrl.toggle);
router.delete('/admin/newsletter/bulk',        protect, ctrl.bulkDelete);
router.delete('/admin/newsletter/:id',         protect, ctrl.delete);

module.exports = router;