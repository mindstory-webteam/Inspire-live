/**
 * controllers/serviceController.js
 */

const Service = require('../models/Service');
const { deleteFromCloudinary, getPublicIdFromUrl } = require('../middleware/uploadMiddleware');

// ── Helpers ────────────────────────────────────────────────────────────────────

function parseJson(value, fallback) {
  if (!value) return fallback;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function uniqueSlug(base, excludeId = null) {
  let slug = base
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  let exists = await Service.findOne({
    slug,
    ...(excludeId && { _id: { $ne: excludeId } }),
  });
  if (!exists) return slug;

  let counter = 2;
  while (exists) {
    const candidate = `${slug}-${counter}`;
    exists = await Service.findOne({
      slug: candidate,
      ...(excludeId && { _id: { $ne: excludeId } }),
    });
    if (!exists) return candidate;
    counter++;
  }
  return `${slug}-${counter}`;
}

async function safeDeleteCloudinary(publicId, url) {
  const id = publicId || getPublicIdFromUrl(url);
  if (id) {
    try {
      await deleteFromCloudinary(id, 'image');
    } catch (err) {
      console.error('Cloudinary delete error:', err.message);
    }
  }
}

async function adjacentSlugs(currentOrder, currentId) {
  const [prev, next] = await Promise.all([
    Service.findOne({
      isActive: true,
      isHidden: false,
      $or: [
        { order: { $lt: currentOrder } },
        { order: currentOrder, _id: { $lt: currentId } },
      ],
    })
      .sort({ order: -1, _id: -1 })
      .select('slug')
      .lean(),

    Service.findOne({
      isActive: true,
      isHidden: false,
      $or: [
        { order: { $gt: currentOrder } },
        { order: currentOrder, _id: { $gt: currentId } },
      ],
    })
      .sort({ order: 1, _id: 1 })
      .select('slug')
      .lean(),
  ]);

  return {
    prevService: prev ? prev.slug : null,
    nextService: next ? next.slug : null,
  };
}

// ── Public Controllers ─────────────────────────────────────────────────────────

/**
 * GET /api/services
 * Returns only active AND not hidden services (shown on client/website)
 */
const getAll = async (req, res) => {
  try {
    const { page, limit } = req.query;

    // isHidden: false ensures hidden services never appear on the public site
    const filter = { isActive: true, isHidden: false };

    const selectFields =
      'title slug subtitle shortDescription icon heroImage order isActive isHidden createdAt';

    let q = Service.find(filter)
      .sort({ order: 1, createdAt: 1 })
      .select(selectFields);

    const total = await Service.countDocuments(filter);

    if (page && limit) {
      const p = Math.max(1, parseInt(page, 10));
      const l = Math.max(1, parseInt(limit, 10));
      q = q.skip((p - 1) * l).limit(l);
      const services = await q.lean();
      return res.json({
        success: true,
        data: services,
        pagination: { total, page: p, limit: l, pages: Math.ceil(total / l) },
      });
    }

    const services = await q.lean();
    res.json({ success: true, data: services });
  } catch (err) {
    console.error('getAll error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * GET /api/services/slug/:slug
 * Public single service — blocked if hidden
 */
const getBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({
      slug: req.params.slug,
      isActive: true,
      isHidden: false,   // hidden services are not accessible on the public site
    }).lean();

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const nav = await adjacentSlugs(service.order, service._id);
    res.json({ success: true, data: { ...service, ...nav } });
  } catch (err) {
    console.error('getBySlug error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * GET /api/services/:id
 * Public by Mongo ID — also blocked if hidden
 */
const getById = async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      isHidden: false,   // hidden services return 404 on public routes
    }).lean();

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (err) {
    console.error('getById error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── Admin Controllers ──────────────────────────────────────────────────────────

/**
 * GET /api/services/admin/all
 * Admin list — returns ALL services including hidden ones
 */
const getAllAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, hidden } = req.query;
    const p = Math.max(1, parseInt(page, 10));
    const l = Math.max(1, parseInt(limit, 10));

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug:  { $regex: search, $options: 'i' } },
      ];
    }
    if (status === 'active')   filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;

    // Filter by hidden state if query param provided
    if (hidden === 'true')  filter.isHidden = true;
    if (hidden === 'false') filter.isHidden = false;

    const [services, total] = await Promise.all([
      Service.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip((p - 1) * l)
        .limit(l)
        .lean(),
      Service.countDocuments(filter),
    ]);

    // Also return counts for the stats cards
    const [hiddenCount, activeCount, inactiveCount, totalCount] = await Promise.all([
      Service.countDocuments({ isHidden: true }),
      Service.countDocuments({ isActive: true }),
      Service.countDocuments({ isActive: false }),
      Service.countDocuments({}),
    ]);

    res.json({
      success: true,
      data: services,
      pagination: { total, page: p, limit: l, pages: Math.ceil(total / l) },
      counts: { total: totalCount, active: activeCount, inactive: inactiveCount, hidden: hiddenCount },
    });
  } catch (err) {
    console.error('getAllAdmin error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * POST /api/services
 * Create a new service
 */
const create = async (req, res) => {
  try {
    const body  = req.body;
    const files = req.files || {};

    const keyFeatures = parseJson(body.keyFeatures, []);
    const benefits    = parseJson(body.benefits, []);
    const faqs        = parseJson(body.faqs, []);

    const baseSlug = body.slug || body.title || '';
    const slug = await uniqueSlug(baseSlug);

    const maxDoc = await Service.findOne().sort({ order: -1 }).select('order').lean();
    const order =
      body.order !== undefined && body.order !== ''
        ? parseInt(body.order, 10)
        : maxDoc ? maxDoc.order + 1 : 0;

    const heroFile    = files.heroImage?.[0];
    const detail1File = files.detailImage1?.[0];
    const detail2File = files.detailImage2?.[0];

    const service = await Service.create({
      title:            body.title,
      slug,
      subtitle:         body.subtitle         || '',
      shortDescription: body.shortDescription || '',
      icon:             body.icon             || '',

      heroImage:    heroFile    ? heroFile.path    : (body.heroImage    || ''),
      detailImage1: detail1File ? detail1File.path : (body.detailImage1 || ''),
      detailImage2: detail2File ? detail2File.path : (body.detailImage2 || ''),

      heroImageId:    heroFile    ? heroFile.filename    : '',
      detailImage1Id: detail1File ? detail1File.filename : '',
      detailImage2Id: detail2File ? detail2File.filename : '',

      description1:     body.description1     || '',
      description2:     body.description2     || '',
      keyFeatures,
      whyChooseHeading: body.whyChooseHeading || '',
      whyChooseText:    body.whyChooseText    || '',
      benefits,
      faqs,
      metaTitle:        body.metaTitle        || '',
      metaDescription:  body.metaDescription  || '',
      isActive:
        body.isActive !== undefined
          ? body.isActive === 'true' || body.isActive === true
          : true,
      isHidden:
        body.isHidden !== undefined
          ? body.isHidden === 'true' || body.isHidden === true
          : false,
      order,
    });

    res.status(201).json({
      success: true,
      data: service,
      message: 'Service created successfully',
    });
  } catch (err) {
    console.error('create service error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'A service with this slug already exists' });
    }
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

/**
 * PUT /api/services/:id
 * Update a service
 */
const update = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const body  = req.body;
    const files = req.files || {};

    const keyFeatures = parseJson(body.keyFeatures, service.keyFeatures);
    const benefits    = parseJson(body.benefits,    service.benefits);
    const faqs        = parseJson(body.faqs,        service.faqs);

    let slug = service.slug;
    if (body.slug && body.slug !== service.slug) {
      slug = await uniqueSlug(body.slug, service._id);
    } else if (body.title && body.title !== service.title && !body.slug) {
      slug = await uniqueSlug(body.title, service._id);
    }

    const heroFile    = files.heroImage?.[0];
    const detail1File = files.detailImage1?.[0];
    const detail2File = files.detailImage2?.[0];

    let heroImage      = service.heroImage;
    let heroImageId    = service.heroImageId;
    let detailImage1   = service.detailImage1;
    let detailImage1Id = service.detailImage1Id;
    let detailImage2   = service.detailImage2;
    let detailImage2Id = service.detailImage2Id;

    if (heroFile) {
      await safeDeleteCloudinary(service.heroImageId, service.heroImage);
      heroImage   = heroFile.path;
      heroImageId = heroFile.filename;
    }
    if (detail1File) {
      await safeDeleteCloudinary(service.detailImage1Id, service.detailImage1);
      detailImage1   = detail1File.path;
      detailImage1Id = detail1File.filename;
    }
    if (detail2File) {
      await safeDeleteCloudinary(service.detailImage2Id, service.detailImage2);
      detailImage2   = detail2File.path;
      detailImage2Id = detail2File.filename;
    }

    if (body.heroImage    === '') { await safeDeleteCloudinary(heroImageId,    heroImage);    heroImage = '';    heroImageId = '';    }
    if (body.detailImage1 === '') { await safeDeleteCloudinary(detailImage1Id, detailImage1); detailImage1 = ''; detailImage1Id = ''; }
    if (body.detailImage2 === '') { await safeDeleteCloudinary(detailImage2Id, detailImage2); detailImage2 = ''; detailImage2Id = ''; }

    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      {
        title:            body.title            ?? service.title,
        slug,
        subtitle:         body.subtitle         ?? service.subtitle,
        shortDescription: body.shortDescription ?? service.shortDescription,
        icon:             body.icon             ?? service.icon,
        heroImage,    heroImageId,
        detailImage1, detailImage1Id,
        detailImage2, detailImage2Id,
        description1:     body.description1     ?? service.description1,
        description2:     body.description2     ?? service.description2,
        keyFeatures,
        whyChooseHeading: body.whyChooseHeading ?? service.whyChooseHeading,
        whyChooseText:    body.whyChooseText    ?? service.whyChooseText,
        benefits,
        faqs,
        metaTitle:        body.metaTitle        ?? service.metaTitle,
        metaDescription:  body.metaDescription  ?? service.metaDescription,
        isActive:
          body.isActive !== undefined
            ? body.isActive === 'true' || body.isActive === true
            : service.isActive,
        isHidden:
          body.isHidden !== undefined
            ? body.isHidden === 'true' || body.isHidden === true
            : service.isHidden,
        order:
          body.order !== undefined && body.order !== ''
            ? parseInt(body.order, 10)
            : service.order,
      },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updated, message: 'Service updated successfully' });
  } catch (err) {
    console.error('update service error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Slug already exists' });
    }
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

/**
 * PATCH /api/services/:id/toggle
 * Toggle isActive (active / inactive)
 */
const toggleStatus = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    service.isActive = !service.isActive;
    await service.save();
    res.json({
      success: true,
      data: { isActive: service.isActive, isHidden: service.isHidden },
      message: `Service ${service.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (err) {
    console.error('toggleStatus error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * PATCH /api/services/:id/hide
 * Toggle isHidden (hide from / show on public client site)
 * When isHidden = true  → service is NOT returned by any public endpoint
 * When isHidden = false → service is visible on the public site (if also isActive)
 */
const toggleHidden = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    service.isHidden = !service.isHidden;
    await service.save();

    res.json({
      success: true,
      data: {
        _id:      service._id,
        isHidden: service.isHidden,
        isActive: service.isActive,
      },
      message: service.isHidden
        ? 'Service is now hidden from the public site'
        : 'Service is now visible on the public site',
    });
  } catch (err) {
    console.error('toggleHidden error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * PUT /api/services/reorder
 * Bulk reorder
 */
const reorder = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'items array is required' });
    }

    const ops = items.map(({ id, order }) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order } } },
    }));

    await Service.bulkWrite(ops);
    res.json({ success: true, message: 'Services reordered successfully' });
  } catch (err) {
    console.error('reorder error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * DELETE /api/services/:id
 * Permanently delete a service and its Cloudinary images
 */
const remove = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    await Promise.allSettled([
      safeDeleteCloudinary(service.heroImageId,    service.heroImage),
      safeDeleteCloudinary(service.detailImage1Id, service.detailImage1),
      safeDeleteCloudinary(service.detailImage2Id, service.detailImage2),
    ]);

    await service.deleteOne();
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (err) {
    console.error('remove service error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── Exports ────────────────────────────────────────────────────────────────────
module.exports = {
  getAll,
  getBySlug,
  getById,
  getAllAdmin,
  create,
  update,
  toggleStatus,
  toggleHidden,
  reorder,
  remove,
};