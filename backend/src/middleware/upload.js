const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error('Only image files allowed'));
};

const mediaFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|mp4|webm|mov|avi/;
  if (allowed.test(path.extname(file.originalname).toLowerCase())) return cb(null, true);
  cb(new Error('Invalid file type'));
};

const uploadImage = multer({ storage, fileFilter: imageFilter, limits: { fileSize: 10 * 1024 * 1024, files: 10 } });
const uploadMedia = multer({ storage, fileFilter: mediaFilter, limits: { fileSize: 100 * 1024 * 1024 } });
const uploadVideo = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

const serviceUpload = multer({ storage, fileFilter: imageFilter, limits: { fileSize: 10 * 1024 * 1024 } })
  .fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'detailImage1', maxCount: 1 },
    { name: 'detailImage2', maxCount: 1 },
    { name: 'iconImage', maxCount: 1 },
  ]);

const teamUpload = multer({ storage, fileFilter: imageFilter, limits: { fileSize: 5 * 1024 * 1024 } }).single('img');

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message || 'Upload failed' });
  }
  next();
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const filename = publicId.split('/').pop();
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (error) {
    console.error('File deletion error:', error);
  }
};

const getPublicIdFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  return path.basename(url);
};

const isCloudinaryUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.includes('cloudinary.com');
};

module.exports = {
  upload: uploadImage,
  uploadImage,
  uploadMedia,
  uploadVideo,
  serviceUpload,
  teamUpload,
  handleMulterError,
  deleteFromCloudinary,
  getPublicIdFromUrl,
  isCloudinaryUrl,
};
