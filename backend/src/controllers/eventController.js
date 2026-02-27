const Event = require('../models/Event');
// Uses your existing upload middleware — update path if needed (e.g. '../middleware/upload')
const { deleteFromCloudinary } = require('../middleware/uploadMiddleware');

// ─── Public Controllers ──────────────────────────────────────────────────────

/**
 * GET /api/events
 * Get all active events (public)
 */
const getAllEvents = async (req, res) => {
  try {
    const { type, status } = req.query;

    const filter = { isActive: true };
    if (type && type !== 'all') filter.eventType = type;
    if (status) filter.eventStatus = status;

    const events = await Event.find(filter).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error('getAllEvents error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching events' });
  }
};

/**
 * GET /api/events/:id
 * Get single event by ID (public)
 */
const getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, isActive: true });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    console.error('getEventById error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching event' });
  }
};

// ─── Admin Controllers ───────────────────────────────────────────────────────

/**
 * GET /api/admin/events
 * Get all events including drafts (admin)
 */
const adminGetAllEvents = async (req, res) => {
  try {
    const { type, status, search } = req.query;

    const filter = {};
    if (type && type !== 'all') filter.eventType = type;
    if (status && status !== 'all') filter.eventStatus = status;
    if (search) {
      filter.$or = [
        { eventTitle: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(filter).sort({ order: 1, createdAt: -1 });

    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    console.error('adminGetAllEvents error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * POST /api/admin/events
 * Create new event (admin)
 */
const createEvent = async (req, res) => {
  try {
    const {
      eventTitle,
      tagline,
      eventBrief,
      eventDate,
      eventVenue,
      eventType,
      participantCount,
      eventStatus,
      order,
    } = req.body;

    const eventData = {
      eventTitle,
      tagline,
      eventBrief,
      eventDate,
      eventVenue,
      eventType,
      participantCount,
      eventStatus: eventStatus || 'upcoming',
      order: order || 0,
    };

    // Handle uploaded image
    if (req.file) {
      eventData.eventImage = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    const event = await Event.create(eventData);

    res.status(201).json({ success: true, message: 'Event created successfully', data: event });
  } catch (error) {
    console.error('createEvent error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error creating event' });
  }
};

/**
 * PUT /api/admin/events/:id
 * Update event (admin)
 */
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const updateData = { ...req.body };

    // Handle new image upload
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (event.eventImage?.publicId) {
        try {
          await deleteFromCloudinary(event.eventImage.publicId, 'image');
        } catch (err) {
          console.warn('Could not delete old image:', err.message);
        }
      }
      updateData.eventImage = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Event updated successfully', data: updatedEvent });
  } catch (error) {
    console.error('updateEvent error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error updating event' });
  }
};

/**
 * PATCH /api/admin/events/:id/toggle
 * Toggle event active/inactive (admin)
 */
const toggleEventStatus = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    event.isActive = !event.isActive;
    await event.save();

    res.json({
      success: true,
      message: `Event ${event.isActive ? 'activated' : 'deactivated'} successfully`,
      data: event,
    });
  } catch (error) {
    console.error('toggleEventStatus error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * DELETE /api/admin/events/:id
 * Delete event (admin)
 */
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Delete image from Cloudinary
    if (event.eventImage?.publicId) {
      try {
        await deleteFromCloudinary(event.eventImage.publicId, 'image');
      } catch (err) {
        console.warn('Could not delete image from Cloudinary:', err.message);
      }
    }

    await event.deleteOne();

    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('deleteEvent error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting event' });
  }
};

/**
 * PATCH /api/admin/events/reorder
 * Reorder events (admin)
 */
const reorderEvents = async (req, res) => {
  try {
    const { orders } = req.body; // [{ id, order }, ...]

    if (!Array.isArray(orders)) {
      return res.status(400).json({ success: false, message: 'orders must be an array' });
    }

    const updatePromises = orders.map(({ id, order }) =>
      Event.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    res.json({ success: true, message: 'Events reordered successfully' });
  } catch (error) {
    console.error('reorderEvents error:', error);
    res.status(500).json({ success: false, message: 'Server error reordering events' });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  adminGetAllEvents,
  createEvent,
  updateEvent,
  toggleEventStatus,
  deleteEvent,
  reorderEvents,
};