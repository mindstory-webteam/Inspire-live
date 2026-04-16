const ContactInfo = require('../models/Contactinfo');

/* ─── seed defaults ───────────────────────────────────────────────────────── */
const DEFAULTS = [
  {
    type: 'location', title: 'Our Location', order: 0,
    lines: [{ value: 'INSPIRE EDUCATION SERVICE, floor aazra arcade, near central excise office, mettupalayam, Palakkad - 678001' }],
  },
  {
    type: 'email', title: 'Email us', order: 1,
    lines: [{ value: 'inspireeduservice001@gmail.com', href: 'mailto:inspireeduservice001@gmail.com' }],
  },
  {
    type: 'phone', title: 'Call us', order: 2,
    lines: [
      { value: '0091 7593 091 945', href: 'tel:00917593091945' },
      { value: '+91 9947 945 945',  href: 'tel:+919947945945' },
    ],
  },
  {
    type: 'livechat', title: 'Live chat', order: 3,
    lines: [
      { value: 'inspireeduservice001@gmail.com', href: 'mailto:inspireeduservice001@gmail.com' },
      { label: 'active', value: 'Need help?', href: '/contact' },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   PUBLIC
═══════════════════════════════════════════════════════════════════════════ */

/**
 * GET /api/contact-info
 * Returns all active contact info cards (used by the Next.js frontend)
 */
const getContactInfo = async (req, res) => {
  try {
    let items = await ContactInfo.find({ isActive: true }).sort({ order: 1 });

    // Auto-seed if DB is empty
    if (items.length === 0) {
      await ContactInfo.insertMany(DEFAULTS);
      items = await ContactInfo.find({ isActive: true }).sort({ order: 1 });
    }

    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error('getContactInfo error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════════════════════
   ADMIN
═══════════════════════════════════════════════════════════════════════════ */

/**
 * GET /api/admin/contact-info
 * Returns all cards (active + inactive) for admin panel
 */
const getAllContactInfo = async (req, res) => {
  try {
    let items = await ContactInfo.find().sort({ order: 1 });

    // Auto-seed if DB is empty
    if (items.length === 0) {
      await ContactInfo.insertMany(DEFAULTS);
      items = await ContactInfo.find().sort({ order: 1 });
    }

    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error('getAllContactInfo error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * PUT /api/admin/contact-info/:type
 * Update a single contact info card by type
 */
const updateContactInfo = async (req, res) => {
  try {
    const { type } = req.params;
    const valid = ['location', 'email', 'phone', 'livechat'];
    if (!valid.includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid contact info type' });
    }

    const { title, lines, isActive } = req.body;

    if (!title || !Array.isArray(lines) || lines.length === 0) {
      return res.status(400).json({ success: false, message: 'Title and at least one line are required' });
    }

    // Validate lines
    for (const line of lines) {
      if (!line.value || line.value.trim() === '') {
        return res.status(400).json({ success: false, message: 'Each line must have a value' });
      }
    }

    const updated = await ContactInfo.findOneAndUpdate(
      { type },
      { title, lines, isActive: isActive !== undefined ? isActive : true },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updated, message: 'Contact info updated successfully' });
  } catch (error) {
    console.error('updateContactInfo error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * PATCH /api/admin/contact-info/:type/toggle
 * Toggle isActive for a card
 */
const toggleContactInfo = async (req, res) => {
  try {
    const item = await ContactInfo.findOne({ type: req.params.type });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });

    item.isActive = !item.isActive;
    await item.save();

    res.status(200).json({ success: true, data: item, message: `Card ${item.isActive ? 'activated' : 'deactivated'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * PUT /api/admin/contact-info/reorder
 * Reorder all cards: body = [{ type, order }]
 */
const reorderContactInfo = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'items array required' });
    }

    await Promise.all(
      items.map(({ type, order }) =>
        ContactInfo.findOneAndUpdate({ type }, { order })
      )
    );

    const updated = await ContactInfo.find().sort({ order: 1 });
    res.status(200).json({ success: true, data: updated, message: 'Reordered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * POST /api/admin/contact-info/seed
 * Reset to default values
 */
const seedDefaults = async (req, res) => {
  try {
    await ContactInfo.deleteMany({});
    const items = await ContactInfo.insertMany(DEFAULTS);
    res.status(200).json({ success: true, data: items, message: 'Reset to defaults successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getContactInfo,
  getAllContactInfo,
  updateContactInfo,
  toggleContactInfo,
  reorderContactInfo,
  seedDefaults,
};