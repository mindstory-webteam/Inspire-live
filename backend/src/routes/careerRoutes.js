const express = require('express');
const router = express.Router();
const {
  getAllCareers,
  getCareerById,
  applyForCareer,
  adminGetAllCareers,
  adminGetCareerById,
  createCareer,
  updateCareer,
  deleteCareer,
  toggleCareerStatus,
  getApplications,
  updateApplicationStatus,
  getStats,
} = require('../controllers/careerController');
const { uploadMedia, handleMulterError } = require('../middleware/uploadMiddleware');

// ─── Public Routes ────────────────────────────────────────────────────────────
// GET  /api/careers              - List active careers (with pagination & filters)
// GET  /api/careers/:id          - Get single career
// POST /api/careers/:id/apply    - Submit application with resume upload

router.get('/', getAllCareers);
router.get('/:id', getCareerById);
router.post(
  '/:id/apply',
  uploadMedia.single('resume'),
  handleMulterError,
  applyForCareer
);

// ─── Admin Routes ─────────────────────────────────────────────────────────────
// Prefix all with /api/admin/careers
// GET    /api/admin/careers/stats                         - Dashboard stats
// GET    /api/admin/careers                               - All careers (paginated)
// GET    /api/admin/careers/:id                           - Single career + applications
// POST   /api/admin/careers                               - Create career
// PUT    /api/admin/careers/:id                           - Full update
// DELETE /api/admin/careers/:id                           - Delete career
// PATCH  /api/admin/careers/:id/toggle                    - Toggle active status
// GET    /api/admin/careers/:id/applications              - List applications
// PATCH  /api/admin/careers/:careerId/applications/:appId - Update app status

const adminRouter = express.Router();

adminRouter.get('/stats', getStats);
adminRouter.get('/', adminGetAllCareers);
adminRouter.get('/:id', adminGetCareerById);
adminRouter.post('/', createCareer);
adminRouter.put('/:id', updateCareer);
adminRouter.delete('/:id', deleteCareer);
adminRouter.patch('/:id/toggle', toggleCareerStatus);
adminRouter.get('/:id/applications', getApplications);
adminRouter.patch('/:careerId/applications/:appId', updateApplicationStatus);

module.exports = { careerRoutes: router, careerAdminRoutes: adminRouter };