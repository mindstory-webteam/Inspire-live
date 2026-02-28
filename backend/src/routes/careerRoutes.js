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

const { protect } = require('../middleware/auth');

// ── upload middleware (safe import) ──────────────────────────────────────────
let uploadMiddleware = null;
try {
  const up = require('../middleware/uploadMiddleware');
  uploadMiddleware = up.uploadMedia || null;
} catch {
  try {
    const up = require('../middleware/upload');
    uploadMiddleware = up.uploadMedia || null;
  } catch { /* no upload middleware found */ }
}

const handleMulterError = (err, req, res, next) => {
  if (err) return res.status(400).json({ success: false, message: err.message });
  next();
};

// ─── Public Routes  /api/careers ─────────────────────────────────────────────
router.get('/', getAllCareers);
router.get('/:id', getCareerById);

if (uploadMiddleware) {
  router.post('/:id/apply', uploadMiddleware.single('resume'), handleMulterError, applyForCareer);
} else {
  router.post('/:id/apply', applyForCareer);
}

// ─── Admin Routes  /api/admin/careers ────────────────────────────────────────
// ALL admin routes are protected with JWT via protect middleware
const adminRouter = express.Router();

adminRouter.use(protect);   // ← applies to every route below

adminRouter.get('/stats',                           getStats);
adminRouter.get('/',                                adminGetAllCareers);
adminRouter.get('/:id',                             adminGetCareerById);
adminRouter.post('/',                               createCareer);
adminRouter.put('/:id',                             updateCareer);
adminRouter.delete('/:id',                          deleteCareer);
adminRouter.patch('/:id/toggle',                    toggleCareerStatus);
adminRouter.get('/:id/applications',                getApplications);
adminRouter.patch('/:careerId/applications/:appId', updateApplicationStatus);

module.exports = { careerRoutes: router, careerAdminRoutes: adminRouter };