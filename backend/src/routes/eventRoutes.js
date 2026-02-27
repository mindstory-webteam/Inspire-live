const express = require('express');
const {
  getAllEvents,
  getEventById,
  adminGetAllEvents,
  createEvent,
  updateEvent,
  toggleEventStatus,
  deleteEvent,
  reorderEvents,
} = require('./controllers/eventController');

// ─── Uses YOUR existing auth middleware ───────────────────────────────────────
// Matches your pattern: exports.protect & exports.authorize(...roles)
const { protect, authorize } = require('../middleware/auth');

// ─── Uses YOUR existing upload/cloudinary middleware ─────────────────────────
// Point to wherever your Cloudinary multer config lives.
// Common paths: '../middleware/upload'  or  '../config/cloudinary'
const { uploadImage, handleMulterError } = require('../middleware/upload');

// ═════════════════════════════════════════════════════════════════════════════
// PUBLIC ROUTES — no auth required
// ═════════════════════════════════════════════════════════════════════════════
const eventRouter = express.Router();

// GET /api/events           → list all active events (?type=conference&status=featured)
// GET /api/events/:id       → single event by ID
eventRouter.get('/', getAllEvents);
eventRouter.get('/:id', getEventById);

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES — require valid JWT + admin role
// ═════════════════════════════════════════════════════════════════════════════
const eventAdminRouter = express.Router();

// Apply your existing protect + authorize('admin') to every route below
eventAdminRouter.use(protect, authorize('admin'));

// GET    /api/admin/events             → list all events (with optional filters)
// POST   /api/admin/events             → create event (multipart/form-data with eventImage)
// PUT    /api/admin/events/:id         → update event (optional new image)
// PATCH  /api/admin/events/reorder     → bulk reorder { orders: [{id, order}] }
// PATCH  /api/admin/events/:id/toggle  → toggle isActive true/false
// DELETE /api/admin/events/:id         → delete event + removes image from Cloudinary

eventAdminRouter.get('/', adminGetAllEvents);

eventAdminRouter.post(
  '/',
  uploadImage.single('eventImage'),
  handleMulterError,
  createEvent
);

eventAdminRouter.put(
  '/:id',
  uploadImage.single('eventImage'),
  handleMulterError,
  updateEvent
);

// IMPORTANT: /reorder must be defined BEFORE /:id routes to avoid collision
eventAdminRouter.patch('/reorder', reorderEvents);
eventAdminRouter.patch('/:id/toggle', toggleEventStatus);
eventAdminRouter.delete('/:id', deleteEvent);

module.exports = { eventRouter, eventAdminRouter };