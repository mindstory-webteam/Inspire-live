const express = require('express');
const router = express.Router();
const adminRouter = express.Router();

const {
  submitContact,
  getAllContacts,
  getStats,
  getContactById,
  updateStatus,
  deleteContact,
  bulkDelete,
} = require('../controllers/contactController');

const { protect, adminOrAbove } = require('../middleware/auth');

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC  →  /api/contact
// ═══════════════════════════════════════════════════════════════════════════════
router.post('/', submitContact);

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN  →  /api/admin/contacts
// ═══════════════════════════════════════════════════════════════════════════════

// admin AND superadmin can access everything below
adminRouter.use(protect, adminOrAbove);

adminRouter.get('/stats',        getStats);
adminRouter.get('/',             getAllContacts);
adminRouter.get('/:id',          getContactById);
adminRouter.patch('/:id/status', updateStatus);
adminRouter.delete('/bulk',      bulkDelete);   // must be before /:id
adminRouter.delete('/:id',       deleteContact);

module.exports = {
  contactRoutes:      router,
  contactAdminRoutes: adminRouter,
};