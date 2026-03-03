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
} = require('../controllers/eventController');

const { protect, adminOrAbove } = require('../middleware/auth');
const { uploadImage, handleMulterError } = require('../middleware/uploadMiddleware');

// ═════════════════════════════════════════════════════════════════════════════
// PUBLIC ROUTES — no auth required
// ═════════════════════════════════════════════════════════════════════════════
const eventRouter = express.Router();

eventRouter.get('/', getAllEvents);
eventRouter.get('/:id', getEventById);

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES — admin AND superadmin
// ═════════════════════════════════════════════════════════════════════════════
const eventAdminRouter = express.Router();

// Apply protect + adminOrAbove to every route below
eventAdminRouter.use(protect, adminOrAbove);

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

// IMPORTANT: /reorder must be before /:id to avoid collision
eventAdminRouter.patch('/reorder', reorderEvents);
eventAdminRouter.patch('/:id/toggle', toggleEventStatus);
eventAdminRouter.delete('/:id', deleteEvent);

module.exports = { eventRouter, eventAdminRouter };