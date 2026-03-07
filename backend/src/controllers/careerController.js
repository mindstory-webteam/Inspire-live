/**
 * controllers/careerController.js
 *
 * FIXES:
 *  1. getStats — was crashing if any Career doc had applications: undefined
 *     (old docs created before applications array was added).
 *     Fixed with $ifNull guards in aggregation pipeline.
 *
 *  2. adminGetAllCareers — was crashing doing .length on applications
 *     when the field didn't exist on old docs.
 *
 *  3. applyForCareer — was crashing if career.applications was undefined
 *     on old docs (no default [] in DB yet). Added safe fallback.
 *
 *  4. All controllers wrapped in try/catch with proper error logging
 *     so a single bad doc doesn't 500 the whole list endpoint.
 */

const Career = require('../models/Career'); // adjust path if needed

// ── helpers ───────────────────────────────────────────────────────────────────

function noCache(res) {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
}

// ── PUBLIC ────────────────────────────────────────────────────────────────────

const getAllCareers = async (req, res) => {
  try {
    noCache(res);
    const { category, type, location, search } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (type)     filter.need     = type;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (search)   filter.$or = [
      { title:    { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ];

    const careers = await Career.find(filter)
      .select('-applications') // never send applications to public
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: careers });
  } catch (err) {
    console.error('getAllCareers:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getCareerById = async (req, res) => {
  try {
    noCache(res);
    const career = await Career.findOne({ _id: req.params.id, isActive: true })
      .select('-applications')
      .lean();
    if (!career) return res.status(404).json({ success: false, message: 'Career not found' });
    res.json({ success: true, data: career });
  } catch (err) {
    console.error('getCareerById:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const applyForCareer = async (req, res) => {
  try {
    const career = await Career.findOne({ _id: req.params.id, isActive: true });
    if (!career) return res.status(404).json({ success: false, message: 'Career not found or no longer active' });

    const { fullName, email, phone, coverLetter } = req.body;
    if (!fullName || !email) return res.status(400).json({ success: false, message: 'Full name and email are required' });

    const application = {
      fullName, email,
      phone:       phone       || '',
      coverLetter: coverLetter || '',
      resumeUrl:      req.file?.path     || '',
      resumePublicId: req.file?.filename || '',
      status:    'pending',
      appliedAt: new Date(),
    };

    // FIX: old docs may have applications: undefined if created before schema default
    if (!Array.isArray(career.applications)) career.applications = [];
    career.applications.push(application);
    await career.save();

    res.status(201).json({ success: true, message: 'Application submitted successfully' });
  } catch (err) {
    console.error('applyForCareer:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── ADMIN ─────────────────────────────────────────────────────────────────────

/**
 * GET /api/admin/careers/stats
 *
 * FIX: The original aggregation used $size: "$applications" which throws
 * if the field is missing (undefined) on old documents.
 * $ifNull wraps it safely: $ifNull: ["$applications", []]
 */
const getStats = async (req, res) => {
  try {
    const [totals, appStats] = await Promise.all([
      // Simple counts — these never crash
      Promise.all([
        Career.countDocuments({}),
        Career.countDocuments({ isActive: true }),
        Career.countDocuments({ isActive: false }),
      ]),

      // Aggregation — safe with $ifNull
      Career.aggregate([
        {
          $project: {
            // FIX: $ifNull prevents crash when applications field is missing
            appCount: { $size: { $ifNull: ['$applications', []] } },
          },
        },
        {
          $group: {
            _id: null,
            totalApplications: { $sum: '$appCount' },
          },
        },
      ]),
    ]);

    const [total, active, inactive] = totals;
    const totalApplications = appStats[0]?.totalApplications || 0;

    res.json({
      success: true,
      data: { total, active, inactive, totalApplications },
    });
  } catch (err) {
    console.error('getStats:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * GET /api/admin/careers
 *
 * FIX: was doing career.applications.length inline which throws
 * if applications is undefined on old docs.
 * Now uses ?. safe access and falls back to 0.
 */
const adminGetAllCareers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const p = Math.max(1, parseInt(page, 10));
    const l = Math.max(1, parseInt(limit, 10));

    const filter = {};
    if (search) filter.$or = [
      { title:    { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ];
    if (status === 'active')   filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;

    const [careers, total] = await Promise.all([
      Career.find(filter)
        .sort({ createdAt: -1 })
        .skip((p - 1) * l)
        .limit(l)
        .lean(),
      Career.countDocuments(filter),
    ]);

    // FIX: safe application count — old docs may have applications: undefined
    const data = careers.map(c => ({
      ...c,
      applicationCount: Array.isArray(c.applications) ? c.applications.length : 0,
      applications: undefined, // strip from list response — too heavy
    }));

    res.json({
      success: true,
      data,
      pagination: { total, page: p, limit: l, pages: Math.ceil(total / l) },
    });
  } catch (err) {
    console.error('adminGetAllCareers:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const adminGetCareerById = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id).lean();
    if (!career) return res.status(404).json({ success: false, message: 'Career not found' });
    res.json({ success: true, data: career });
  } catch (err) {
    console.error('adminGetCareerById:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createCareer = async (req, res) => {
  try {
    const body = req.body;
    const file = req.file;

    const data = {
      title:       body.title,
      category:    body.category,
      need:        body.need        || 'Full Time',
      location:    body.location,
      description: body.description,
      requirements:         body.requirements         || '',
      requirementsList:     parseList(body.requirementsList),
      responsibilities:     body.responsibilities     || '',
      responsibilitiesList: parseList(body.responsibilitiesList),
      jobNumber:    body.jobNumber    || '',
      company:      body.company      || '',
      website:      body.website      || '',
      salaryMin:    body.salaryMin    ? Number(body.salaryMin)  : null,
      salaryMax:    body.salaryMax    ? Number(body.salaryMax)  : null,
      salaryPeriod: body.salaryPeriod || 'month',
      vacancy:      body.vacancy      ? Number(body.vacancy)   : 1,
      applyDeadline: body.applyDeadline ? new Date(body.applyDeadline) : null,
      tags:         parseList(body.tags),
      isActive:     body.isActive !== undefined
        ? body.isActive === 'true' || body.isActive === true
        : true,
      image: file
        ? { url: file.path, publicId: file.filename }
        : { url: body.imageUrl || '', publicId: body.imagePublicId || '' },
    };

    const career = await Career.create(data);
    res.status(201).json({ success: true, data: career, message: 'Career created successfully' });
  } catch (err) {
    console.error('createCareer:', err);
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'A career with this title already exists' });
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const updateCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ success: false, message: 'Career not found' });

    const body = req.body;
    const file = req.file;

    // Image: new file uploaded → replace; explicit empty sent → clear; absent → keep
    let image = career.image || { url: '', publicId: '' };
    if (file) {
      // optionally delete old from cloudinary here
      image = { url: file.path, publicId: file.filename };
    } else if ('imageUrl' in body && body.imageUrl === '') {
      image = { url: '', publicId: '' };
    }

    const fields = {
      title:       body.title       ?? career.title,
      category:    body.category    ?? career.category,
      need:        body.need        ?? career.need,
      location:    body.location    ?? career.location,
      description: body.description ?? career.description,
      requirements:         body.requirements         ?? career.requirements,
      requirementsList:     body.requirementsList     ? parseList(body.requirementsList)     : career.requirementsList,
      responsibilities:     body.responsibilities     ?? career.responsibilities,
      responsibilitiesList: body.responsibilitiesList ? parseList(body.responsibilitiesList) : career.responsibilitiesList,
      jobNumber:    body.jobNumber    ?? career.jobNumber,
      company:      body.company      ?? career.company,
      website:      body.website      ?? career.website,
      salaryMin:    body.salaryMin    !== undefined ? (body.salaryMin    ? Number(body.salaryMin)  : null) : career.salaryMin,
      salaryMax:    body.salaryMax    !== undefined ? (body.salaryMax    ? Number(body.salaryMax)  : null) : career.salaryMax,
      salaryPeriod: body.salaryPeriod ?? career.salaryPeriod,
      vacancy:      body.vacancy      !== undefined ? Number(body.vacancy) : career.vacancy,
      applyDeadline: body.applyDeadline !== undefined
        ? (body.applyDeadline ? new Date(body.applyDeadline) : null)
        : career.applyDeadline,
      tags:     body.tags     ? parseList(body.tags)     : career.tags,
      isActive: body.isActive !== undefined
        ? body.isActive === 'true' || body.isActive === true
        : career.isActive,
      image,
    };

    const updated = await Career.findByIdAndUpdate(req.params.id, fields, { new: true, runValidators: true });
    res.json({ success: true, data: updated, message: 'Career updated successfully' });
  } catch (err) {
    console.error('updateCareer:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const deleteCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ success: false, message: 'Career not found' });
    // optionally delete images from cloudinary here
    await career.deleteOne();
    res.json({ success: true, message: 'Career deleted successfully' });
  } catch (err) {
    console.error('deleteCareer:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const toggleCareerStatus = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ success: false, message: 'Career not found' });
    career.isActive = !career.isActive;
    await career.save();
    res.json({ success: true, data: { isActive: career.isActive }, message: `Career ${career.isActive ? 'activated' : 'deactivated'}` });
  } catch (err) {
    console.error('toggleCareerStatus:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getApplications = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id).select('title applications').lean();
    if (!career) return res.status(404).json({ success: false, message: 'Career not found' });
    // FIX: safe fallback if applications missing on old doc
    res.json({ success: true, data: career.applications || [], title: career.title });
  } catch (err) {
    console.error('getApplications:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected'];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });

    const career = await Career.findById(req.params.careerId);
    if (!career) return res.status(404).json({ success: false, message: 'Career not found' });

    const app = (career.applications || []).id(req.params.appId);
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });

    app.status = status;
    await career.save();
    res.json({ success: true, data: app, message: 'Application status updated' });
  } catch (err) {
    console.error('updateApplicationStatus:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── util ──────────────────────────────────────────────────────────────────────

function parseList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  try { const p = JSON.parse(value); return Array.isArray(p) ? p.filter(Boolean) : []; }
  catch { return value.split(',').map(s => s.trim()).filter(Boolean); }
}

// ── exports ───────────────────────────────────────────────────────────────────

module.exports = {
  getAllCareers,
  getCareerById,
  applyForCareer,
  adminGetAllCareers,
  adminGetCareerById,
  createCareer,
  updateCareer,
  deleteCareer,
  toggleCareerStatus,
  getApplications,
  updateApplicationStatus,
  getStats,
};