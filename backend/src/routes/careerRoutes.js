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
let uploadImage  = null;   // for career images  (jpg/png/webp)
let uploadResume = null;   // for resume files   (pdf/doc)

try {
  const up = require('../middleware/upload');
  uploadImage  = up.uploadImage  || null;
  uploadResume = up.uploadMedia  || null;   // uploadMedia handles raw files too
} catch { /* upload middleware not found */ }

const handleMulterError = (err, req, res, next) => {
  if (err) return res.status(400).json({ success: false, message: err.message });
  next();
};

// ─── Public Routes  /api/careers ─────────────────────────────────────────────
router.get('/',    getAllCareers);
router.get('/:id', getCareerById);

// Apply for a job — resume upload (pdf/doc)
if (uploadResume) {
  router.post('/:id/apply', uploadResume.single('resume'), handleMulterError, applyForCareer);
} else {
  router.post('/:id/apply', applyForCareer);
}

// ─── Admin Routes  /api/admin/careers ────────────────────────────────────────
const adminRouter = express.Router();
adminRouter.use(protect);

adminRouter.get('/stats', getStats);
adminRouter.get('/',      adminGetAllCareers);
adminRouter.get('/:id',   adminGetCareerById);

// Create / Update — accept optional `careerImage` file
if (uploadImage) {
  adminRouter.post('/',     uploadImage.single('careerImage'), handleMulterError, createCareer);
  adminRouter.put('/:id',   uploadImage.single('careerImage'), handleMulterError, updateCareer);
} else {
  adminRouter.post('/',     createCareer);
  adminRouter.put('/:id',   updateCareer);
}

adminRouter.delete('/:id',                          deleteCareer);
adminRouter.patch('/:id/toggle',                    toggleCareerStatus);
adminRouter.get('/:id/applications',                getApplications);
adminRouter.patch('/:careerId/applications/:appId', updateApplicationStatus);

module.exports = { careerRoutes: router, careerAdminRoutes: adminRouter };