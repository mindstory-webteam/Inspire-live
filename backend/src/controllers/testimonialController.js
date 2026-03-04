/**
 * controllers/testimonialController.js
 */
const Testimonial = require('../models/Testimonial');
const { deleteFromCloudinary } = require('../middleware/uploadMiddleware');

// Verify model loaded correctly on startup
console.log('✅ Testimonial model loaded:', !!Testimonial);

async function safeDelete(publicId) {
  if (publicId) {
    try { await deleteFromCloudinary(publicId, 'image'); }
    catch (err) { console.warn('Cloudinary delete error:', err.message); }
  }
}

// ── Public Controllers ────────────────────────────────────────────────────────

/**
 * GET /api/testimonials
 * Returns all active testimonials (public)
 */
const getAll = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    res.json({ success: true, count: testimonials.length, data: testimonials });
  } catch (err) {
    console.error('testimonial getAll error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * GET /api/testimonials/:id
 * Returns a single active testimonial (public)
 */
const getById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findOne({
      _id: req.params.id,
      isActive: true,
    }).lean();

    if (!testimonial)
      return res.status(404).json({ success: false, message: 'Testimonial not found' });

    res.json({ success: true, data: testimonial });
  } catch (err) {
    console.error('testimonial getById error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── Admin Controllers ─────────────────────────────────────────────────────────

/**
 * GET /api/admin/testimonials
 * Returns all testimonials including inactive (admin)
 */
const adminGetAll = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const p = Math.max(1, parseInt(page,  10));
    const l = Math.max(1, parseInt(limit, 10));

    const filter = {};
    if (search) {
      filter.$or = [
        { authorName: { $regex: search, $options: 'i' } },
        { authorDesig: { $regex: search, $options: 'i' } },
        { desc2:       { $regex: search, $options: 'i' } },
      ];
    }
    if (status === 'active')   filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;

    const [testimonials, total] = await Promise.all([
      Testimonial.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip((p - 1) * l)
        .limit(l)
        .lean(),
      Testimonial.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: testimonials,
      pagination: { total, page: p, limit: l, pages: Math.ceil(total / l) },
    });
  } catch (err) {
    console.error('testimonial adminGetAll error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * POST /api/admin/testimonials
 * Create testimonial — accepts multipart/form-data for image uploads
 */
const create = async (req, res) => {
  try {
    const { authorName, authorDesig, desc2, rating, isActive, order } = req.body;
    const files = req.files || {};

    const maxDoc = await Testimonial.findOne().sort({ order: -1 }).select('order').lean();
    const nextOrder =
      order !== undefined && order !== ''
        ? parseInt(order, 10)
        : maxDoc ? maxDoc.order + 1 : 0;

    const data = {
      authorName,
      authorDesig: authorDesig || '',
      desc2,
      rating:   rating   ? parseInt(rating, 10)                               : 5,
      isActive: isActive !== undefined ? isActive === 'true' || isActive === true : true,
      order:    nextOrder,
    };

    if (files.img?.[0]) {
      data.img         = files.img[0].path;
      data.imgPublicId = files.img[0].filename;
    }
    if (files.logoImg?.[0]) {
      data.logoImg         = files.logoImg[0].path;
      data.logoImgPublicId = files.logoImg[0].filename;
    }
    if (files.logoImgLight?.[0]) {
      data.logoImgLight         = files.logoImgLight[0].path;
      data.logoImgLightPublicId = files.logoImgLight[0].filename;
    }

    const testimonial = await Testimonial.create(data);
    res.status(201).json({ success: true, data: testimonial, message: 'Testimonial created successfully' });
  } catch (err) {
    console.error('testimonial create error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * PUT /api/admin/testimonials/:id
 * Update testimonial
 */
const update = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial)
      return res.status(404).json({ success: false, message: 'Testimonial not found' });

    const { authorName, authorDesig, desc2, rating, isActive, order } = req.body;
    const files = req.files || {};

    const updateData = {};
    if (authorName  !== undefined) updateData.authorName  = authorName;
    if (authorDesig !== undefined) updateData.authorDesig = authorDesig;
    if (desc2       !== undefined) updateData.desc2       = desc2;
    if (rating      !== undefined) updateData.rating      = parseInt(rating, 10);
    if (order       !== undefined) updateData.order       = parseInt(order,  10);
    if (isActive    !== undefined)
      updateData.isActive = isActive === 'true' || isActive === true;

    if (files.img?.[0]) {
      await safeDelete(testimonial.imgPublicId);
      updateData.img         = files.img[0].path;
      updateData.imgPublicId = files.img[0].filename;
    }
    if (files.logoImg?.[0]) {
      await safeDelete(testimonial.logoImgPublicId);
      updateData.logoImg         = files.logoImg[0].path;
      updateData.logoImgPublicId = files.logoImg[0].filename;
    }
    if (files.logoImgLight?.[0]) {
      await safeDelete(testimonial.logoImgLightPublicId);
      updateData.logoImgLight         = files.logoImgLight[0].path;
      updateData.logoImgLightPublicId = files.logoImgLight[0].filename;
    }

    const updated = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updated, message: 'Testimonial updated successfully' });
  } catch (err) {
    console.error('testimonial update error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * PATCH /api/admin/testimonials/:id/toggle
 * Toggle isActive
 */
const toggleStatus = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial)
      return res.status(404).json({ success: false, message: 'Testimonial not found' });

    testimonial.isActive = !testimonial.isActive;
    await testimonial.save();

    res.json({
      success: true,
      data: { isActive: testimonial.isActive },
      message: `Testimonial ${testimonial.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (err) {
    console.error('testimonial toggleStatus error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * PATCH /api/admin/testimonials/reorder
 * Bulk reorder — NOTE: this route must be registered BEFORE /:id routes in the router
 */
const reorder = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ success: false, message: 'items array is required' });

    const ops = items.map(({ id, order }) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order } } },
    }));

    await Testimonial.bulkWrite(ops);
    res.json({ success: true, message: 'Testimonials reordered successfully' });
  } catch (err) {
    console.error('testimonial reorder error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * DELETE /api/admin/testimonials/:id
 */
const remove = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial)
      return res.status(404).json({ success: false, message: 'Testimonial not found' });

    await Promise.allSettled([
      safeDelete(testimonial.imgPublicId),
      safeDelete(testimonial.logoImgPublicId),
      safeDelete(testimonial.logoImgLightPublicId),
    ]);

    await testimonial.deleteOne();
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (err) {
    console.error('testimonial remove error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAll, getById, adminGetAll, create, update, toggleStatus, reorder, remove };