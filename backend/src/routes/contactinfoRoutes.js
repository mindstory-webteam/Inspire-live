const express = require('express');
const router      = express.Router();   // public  →  /api/contact-info
const adminRouter = express.Router();   // admin   →  /api/admin/contact-info

const {
  getContactInfo,
  getAllContactInfo,
  updateContactInfo,
  toggleContactInfo,
  reorderContactInfo,
  seedDefaults,
} = require('../controllers/contactinfoController');

const { protect, adminOrAbove } = require('../middleware/auth');

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC  →  GET /api/contact-info
// ═══════════════════════════════════════════════════════════════════════════════
router.get('/', getContactInfo);

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN  →  /api/admin/contact-info
// ═══════════════════════════════════════════════════════════════════════════════
adminRouter.use(protect, adminOrAbove);

adminRouter.get('/',                  getAllContactInfo);
adminRouter.put('/reorder',           reorderContactInfo);   // before /:type
adminRouter.post('/seed',             seedDefaults);
adminRouter.put('/:type',             updateContactInfo);
adminRouter.patch('/:type/toggle',    toggleContactInfo);

module.exports = {
  contactInfoRoutes:      router,
  contactInfoAdminRoutes: adminRouter,
};