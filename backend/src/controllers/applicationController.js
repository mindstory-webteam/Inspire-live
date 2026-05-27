const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// ─── Storage config ───────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../public/uploads/applications');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_').slice(0, 40);
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});

// ─── File filter ──────────────────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error(`File type ${ext} not allowed. Use PDF, JPG, PNG, DOC.`), false);
};

// ─── Export ───────────────────────────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
});

// All document fields the form can upload
const applicationUpload = upload.fields([
  { name: 'sslc_file',    maxCount: 1 },
  { name: 'plus2_file',   maxCount: 1 },
  { name: 'degree_file',  maxCount: 1 },
  { name: 'masters_file', maxCount: 1 },
  { name: 'extra_file',   maxCount: 1 },
  { name: 'work_file',    maxCount: 1 },
]);

module.exports = { applicationUpload };