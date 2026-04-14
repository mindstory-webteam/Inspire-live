const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ─── Upload Directory ─────────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ─── Storage ──────────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

// ─── File Filters ─────────────────────────────────────────────────────────────
const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed'), false);
};

const videoFilter = (req, file, cb) => {
  const allowed = /mp4|webm|mov|avi/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = /video/.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error('Only video files allowed'), false);
};

const mediaFilter = (req, file, cb) => {
  const imageAllowed = /jpeg|jpg|png|gif|webp/;
  const videoAllowed = /mp4|webm|mov|avi/;
  const ext = file.originalname.toLowerCase();
  if (imageAllowed.test(ext) || videoAllowed.test(ext)) return cb(null, true);
  cb(new Error('Only images and videos are allowed'), false);
};

// ─── Multer Instances ─────────────────────────────────────────────────────────
const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
});

const uploadVideo = multer({
  storage,
  fileFilter: videoFilter,
  limits: { fileSize: 100 * 1024 * 1024, files: 3 },
});

const uploadMedia = multer({
  storage,
  fileFilter: mediaFilter,
  limits: { fileSize: 100 * 1024 * 1024, files: 10 },
});

const serviceUpload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 4 },
}).fields([
  { name: 'heroImage',    maxCount: 1 },
  { name: 'detailImage1', maxCount: 1 },
  { name: 'detailImage2', maxCount: 1 },
  { name: 'iconImage',    maxCount: 1 },
]);

const teamUpload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
}).single('img');

// ─── Helper Functions (local equivalents) ────────────────────────────────────
const deleteFromLocal = async (fileUrl) => {
  try {
    const filename = path.basename(fileUrl);
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted local file: ${filename}`);
    }
  } catch (error) {
    console.error('❌ Local file deletion error:', error);
  }
};

const isLocalUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.includes('/uploads/');
};

// ─── Error Handler ────────────────────────────────────────────────────────────
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File too large.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ success: false, message: 'Too many files.' });
    }
    return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message || 'Upload failed' });
  }
  next();
};

// ─── Exports ──────────────────────────────────────────────────────────────────
module.exports = {
  upload: uploadImage,
  uploadImage,
  uploadVideo,
  uploadMedia,
  serviceUpload,
  teamUpload,
  handleMulterError,
  deleteFromLocal,
  isLocalUrl,
};