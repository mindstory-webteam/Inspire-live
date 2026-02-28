const express = require('express');
const router = express.Router();
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

// ═══════════════════════════════════════════════════════════════════════════════
// RESUME UPLOAD — resource_type: 'raw' is REQUIRED for PDF/DOC files
// Using resource_type: 'image' or 'video' will cause Cloudinary to reject PDFs,
// which in turn causes multer to fail BEFORE req.body is populated, making
// the controller think fullName/email are missing (400 error).
// ═══════════════════════════════════════════════════════════════════════════════
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: 'uploads/resumes',
    resource_type: 'raw',   // ← critical: PDF/DOC are raw resources in Cloudinary
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// ─── Career image upload (JPG / PNG / WEBP → Cloudinary image) ───────────────
let uploadImage = null;
try {
  const up = require('../middleware/upload');
  uploadImage = up.uploadImage || null;
} catch { /* upload middleware not found */ }

const handleMulterError = (err, req, res, next) => {
  if (err) return res.status(400).json({ success: false, message: err.message });
  next();
};

// ─── Public Routes  /api/careers ─────────────────────────────────────────────
router.get('/',    getAllCareers);
router.get('/:id', getCareerById);

// Apply for a job — resume file is optional.
// We wrap uploadResume in a soft handler: if the file upload fails for any reason
// (wrong type, too large, Cloudinary error) we log the warning and still allow
// the controller to run so the application text data is never lost.
router.post(
  '/:id/apply',
  (req, res, next) => {
    uploadResume.single('resume')(req, res, (err) => {
      if (err) {
        console.warn('Resume upload warning (non-fatal):', err.message);
        // Don't block — controller will just save without resumeUrl
      }
      next();
    });
  },
  applyForCareer
);

// ─── Admin Routes  /api/admin/careers ────────────────────────────────────────
const adminRouter = express.Router();
adminRouter.use(protect);

adminRouter.get('/stats', getStats);
adminRouter.get('/',      adminGetAllCareers);
adminRouter.get('/:id',   adminGetCareerById);

if (uploadImage) {
  adminRouter.post('/',   uploadImage.single('careerImage'), handleMulterError, createCareer);
  adminRouter.put('/:id', uploadImage.single('careerImage'), handleMulterError, updateCareer);
} else {
  adminRouter.post('/',   createCareer);
  adminRouter.put('/:id', updateCareer);
}

adminRouter.delete('/:id',                          deleteCareer);
adminRouter.patch('/:id/toggle',                    toggleCareerStatus);
adminRouter.get('/:id/applications',                getApplications);
adminRouter.patch('/:careerId/applications/:appId', updateApplicationStatus);

module.exports = { careerRoutes: router, careerAdminRoutes: adminRouter };