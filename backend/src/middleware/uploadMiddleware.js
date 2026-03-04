const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// ═══════════════════════════════════════════════════════════════════════════════
// CLOUDINARY CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify configuration on startup
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.warn('⚠️ WARNING: Cloudinary credentials not found in environment variables!');
  console.warn('   Please set: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORAGE CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Image Storage ────────────────────────────────────────────────────────────
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ quality: 'auto:best', fetch_format: 'auto' }],
    resource_type: 'image',
  },
});

// ─── Video Storage ────────────────────────────────────────────────────────────
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads/videos',
    allowed_formats: ['mp4', 'webm', 'mov', 'avi'],
    resource_type: 'video',
  },
});

// ─── Mixed Media Storage ──────────────────────────────────────────────────────
const mediaStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const isVideo = /video/.test(file.mimetype);
    return {
      folder: isVideo ? 'uploads/videos' : 'uploads/images',
      allowed_formats: isVideo
        ? ['mp4', 'webm', 'mov', 'avi']
        : ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      resource_type: isVideo ? 'video' : 'image',
      transformation: isVideo ? [] : [{ quality: 'auto:best', fetch_format: 'auto' }],
    };
  },
});

// ─── Service Image Storage ────────────────────────────────────────────────────
const serviceImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads/services',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ quality: 'auto:best', fetch_format: 'auto' }],
    resource_type: 'image',
  },
});

// ─── Team Image Storage ───────────────────────────────────────────────────────
const teamImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads/team',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      {
        width: 400,
        height: 400,
        crop: 'fill',
        gravity: 'face',   // Smart crop — focuses on the person's face
        quality: 'auto:best',
        fetch_format: 'auto',
      },
    ],
    resource_type: 'image',
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// FILE FILTERS
// ═══════════════════════════════════════════════════════════════════════════════

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext  = allowed.test(file.originalname.toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed'), false);
  }
};

const videoFilter = (req, file, cb) => {
  const allowed = /mp4|webm|mov|avi/;
  const ext  = allowed.test(file.originalname.toLowerCase());
  const mime = /video/.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only video files (MP4, WEBM, MOV, AVI) are allowed'), false);
  }
};

const mediaFilter = (req, file, cb) => {
  const imageAllowed = /jpeg|jpg|png|gif|webp/;
  const videoAllowed = /mp4|webm|mov|avi/;
  const ext = file.originalname.toLowerCase();
  if (imageAllowed.test(ext) || videoAllowed.test(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Only images (JPEG, JPG, PNG, GIF, WEBP) and videos (MP4, WEBM, MOV, AVI) are allowed'
      ),
      false
    );
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// MULTER INSTANCES
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Image Upload ─────────────────────────────────────────────────────────────
const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
});

// ─── Video Upload ─────────────────────────────────────────────────────────────
const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: { fileSize: 100 * 1024 * 1024, files: 3 },
});

// ─── Mixed Media Upload ───────────────────────────────────────────────────────
const uploadMedia = multer({
  storage: mediaStorage,
  fileFilter: mediaFilter,
  limits: { fileSize: 100 * 1024 * 1024, files: 10 },
});

// ─── Service Upload ───────────────────────────────────────────────────────────
// Accepts 3 named image fields: heroImage, detailImage1, detailImage2
const serviceUpload = multer({
  storage: serviceImageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 3 },
}).fields([
  { name: 'heroImage',    maxCount: 1 },
  { name: 'detailImage1', maxCount: 1 },
  { name: 'detailImage2', maxCount: 1 },
]);

// ─── Team Upload ──────────────────────────────────────────────────────────────
// Single photo field named "img" — uploaded to uploads/team on Cloudinary
// with automatic face-aware cropping to 400×400
const teamUpload = multer({
  storage: teamImageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }, // 5 MB — portrait photos are small
}).single('img');

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - The Cloudinary public_id (without extension)
 * @param {string} resourceType - 'image' or 'video'
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    console.log(`🗑️ Attempting to delete from Cloudinary: ${publicId} (${resourceType})`);
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    console.log(`✅ Cloudinary deletion result:`, result);
    return result;
  } catch (error) {
    console.error('❌ Cloudinary deletion error:', error);
    throw error;
  }
};

/**
 * Extract Cloudinary public_id from URL
 * e.g. https://res.cloudinary.com/demo/image/upload/v1234/uploads/team/team-abc.jpg
 * → uploads/team/team-abc
 * @param {string} url
 * @returns {string|null}
 */
const getPublicIdFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  try {
    const match = url.match(/\/v\d+\/(.+)\.\w+$/);
    if (match && match[1]) return match[1];
    const altMatch = url.match(/\/upload\/(.+)\.\w+$/);
    if (altMatch && altMatch[1]) return altMatch[1].replace(/^v\d+\//, '');
    return null;
  } catch {
    return null;
  }
};

/**
 * Check if a URL is a Cloudinary URL
 * @param {string} url
 * @returns {boolean}
 */
const isCloudinaryUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
};

/**
 * Get optimized image URL with transformations
 * @param {string} url
 * @param {Object} options - { width, height, crop, quality, format }
 */
const getOptimizedImageUrl = (url, options = {}) => {
  if (!isCloudinaryUrl(url)) return url;
  const { width, height, crop = 'fill', quality = 'auto', format = 'auto' } = options;
  try {
    const publicId = getPublicIdFromUrl(url);
    if (!publicId) return url;
    return cloudinary.url(publicId, {
      width, height, crop,
      quality,
      fetch_format: format,
      secure: true,
    });
  } catch {
    return url;
  }
};

/**
 * Batch delete multiple files from Cloudinary
 * @param {string[]} publicIds
 * @param {string} resourceType
 */
const batchDeleteFromCloudinary = async (publicIds, resourceType = 'image') => {
  try {
    const deletePromises = publicIds.map((id) => deleteFromCloudinary(id, resourceType));
    return await Promise.allSettled(deletePromises);
  } catch (error) {
    console.error('Batch deletion error:', error);
    throw error;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR HANDLING MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════════

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB for images and 100MB for videos.',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ success: false, message: 'Too many files uploaded.' });
    }
    return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message || 'File upload failed' });
  }
  next();
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

module.exports = {
  // Multer instances
  uploadImage,
  uploadVideo,
  uploadMedia,
  serviceUpload,
  teamUpload,            // ← NEW: single 'img' field, uploads to uploads/team

  // Cloudinary instance
  cloudinary,

  // Helper functions
  deleteFromCloudinary,
  getPublicIdFromUrl,
  isCloudinaryUrl,
  getOptimizedImageUrl,
  batchDeleteFromCloudinary,

  // Error handler
  handleMulterError,
};