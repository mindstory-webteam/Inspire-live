const express = require('express');
const router = express.Router();
const adminRouter = express.Router();

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

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

const { protect, adminOrAbove } = require('../middleware/auth');
const { uploadImage } = require('../middleware/uploadMiddleware');

// ═══════════════════════════════════════════════════════════════
// RESUME UPLOAD (PDF / DOC / DOCX → Cloudinary RAW)
// ═══════════════════════════════════════════════════════════════

const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: 'uploads/resumes',
    resource_type: 'raw',
    public_id: `resume_${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`,
  }),
});

const resumeFilter = (req, file, cb) => {
  const okMime = /pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document/;
  const okExt  = /\.(pdf|doc|docx)$/i;
  if (okMime.test(file.mimetype) || okExt.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and DOC/DOCX files are allowed for resumes'), false);
  }
};

const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: resumeFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ═══════════════════════════════════════════════════════════════
// PUBLIC ROUTES  → /api/careers
// ═══════════════════════════════════════════════════════════════

router.get('/', getAllCareers);
router.get('/:id', getCareerById);

router.post(
  '/:id/apply',
  (req, res, next) => {
    uploadResume.single('resume')(req, res, (err) => {
      if (err) console.warn('Resume upload warning (non-fatal):', err.message);
      next();
    });
  },
  applyForCareer
);

// ═══════════════════════════════════════════════════════════════
// ADMIN ROUTES  → /api/admin/careers
// ═══════════════════════════════════════════════════════════════

// admin AND superadmin can access everything below
adminRouter.use(protect, adminOrAbove);

adminRouter.get('/stats', getStats);
adminRouter.get('/', adminGetAllCareers);
adminRouter.get('/:id', adminGetCareerById);

adminRouter.post('/', uploadImage.single('careerImage'), createCareer);
adminRouter.put('/:id', uploadImage.single('careerImage'), updateCareer);
adminRouter.delete('/:id', deleteCareer);
adminRouter.patch('/:id/toggle', toggleCareerStatus);
adminRouter.get('/:id/applications', getApplications);
adminRouter.patch('/:careerId/applications/:appId', updateApplicationStatus);

module.exports = {
  careerRoutes: router,
  careerAdminRoutes: adminRouter,
};