const Contact = require('../model/Contact');

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/contact
 * Submit a contact form
 */
const submitContact = async (req, res) => {
  try {
    const { fullName, email, phone, service, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and message are required.',
      });
    }

    const contact = await Contact.create({
      fullName,
      email,
      phone:     phone   || '',
      service:   service || '',
      message,
      ipAddress: req.ip || '',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received. We will be in touch soon.',
      data: { id: contact._id },
    });
  } catch (error) {
    console.error('submitContact error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/admin/contacts
 * Get all contacts with pagination, search, filter
 */
const getAllContacts = async (req, res) => {
  try {
    const {
      page   = 1,
      limit  = 15,
      search,
      status,
      sortBy = 'createdAt',
      order  = 'desc',
    } = req.query;

    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email:    { $regex: search, $options: 'i' } },
        { message:  { $regex: search, $options: 'i' } },
        { service:  { $regex: search, $options: 'i' } },
      ];
    }

    const skip      = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit)),
      Contact.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        total,
        page:       parseInt(page),
        limit:      parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('getAllContacts error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * GET /api/admin/contacts/stats
 * Get contact stats for dashboard
 */
const getStats = async (req, res) => {
  try {
    const [total, newCount, read, replied, archived] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Contact.countDocuments({ status: 'read' }),
      Contact.countDocuments({ status: 'replied' }),
      Contact.countDocuments({ status: 'archived' }),
    ]);

    // contacts in last 30 days
    const since30 = new Date();
    since30.setDate(since30.getDate() - 30);
    const last30Days = await Contact.countDocuments({ createdAt: { $gte: since30 } });

    res.status(200).json({
      success: true,
      data: { total, new: newCount, read, replied, archived, last30Days },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * GET /api/admin/contacts/:id
 * Get a single contact and mark it as read
 */
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    // Auto-mark as read when opened
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }

    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * PATCH /api/admin/contacts/:id/status
 * Update contact status
 */
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['new', 'read', 'replied', 'archived'];

    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.status(200).json({ success: true, data: contact, message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * DELETE /api/admin/contacts/:id
 * Delete a contact
 */
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    res.status(200).json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * DELETE /api/admin/contacts/bulk
 * Bulk delete contacts by IDs
 */
const bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No IDs provided' });
    }
    const result = await Contact.deleteMany({ _id: { $in: ids } });
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} contact(s) deleted`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  submitContact,
  getAllContacts,
  getStats,
  getContactById,
  updateStatus,
  deleteContact,
  bulkDelete,
};