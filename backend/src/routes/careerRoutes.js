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

const { protect } = require('../middleware/auth');
const { uploadImage } = require('../middleware/uploadMiddleware'); // ✅ Proper import


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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});


// ═══════════════════════════════════════════════════════════════
// PUBLIC ROUTES  → /api/careers
// ═══════════════════════════════════════════════════════════════

router.get('/', getAllCareers);
router.get('/:id', getCareerById);

// Apply for job (resume optional, non-blocking)
router.post(
  '/:id/apply',
  (req, res, next) => {
    uploadResume.single('resume')(req, res, (err) => {
      if (err) {
        console.warn('Resume upload warning (non-fatal):', err.message);
        // Continue without blocking application
      }
      next();
    });
  },
  applyForCareer
);


// ═══════════════════════════════════════════════════════════════
// ADMIN ROUTES  → /api/admin/careers
// ═══════════════════════════════════════════════════════════════

adminRouter.use(protect);

// Stats
adminRouter.get('/stats', getStats);

// CRUD
adminRouter.get('/', adminGetAllCareers);
adminRouter.get('/:id', adminGetCareerById);

// ✅ ALWAYS use multer for FormData
adminRouter.post(
  '/',
  uploadImage.single('careerImage'),
  createCareer
);

adminRouter.put(
  '/:id',
  uploadImage.single('careerImage'),
  updateCareer
);

adminRouter.delete('/:id', deleteCareer);

// Toggle status
adminRouter.patch('/:id/toggle', toggleCareerStatus);

// Applications
adminRouter.get('/:id/applications', getApplications);
adminRouter.patch('/:careerId/applications/:appId', updateApplicationStatus);


// ═══════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════

module.exports = {
  careerRoutes: router,
  careerAdminRoutes: adminRouter,
};