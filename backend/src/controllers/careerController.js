const Career = require('../models/Career');
const { deleteFromCloudinary } = require('../middleware/upload');

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC CONTROLLERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/careers
 * Get all active careers (public)
 */
const getAllCareers = async (req, res) => {
  try {
    const { page = 1, limit = 6, category, location, need, search } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (need)     filter.need = need;
    if (search)   filter.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [careers, total] = await Promise.all([
      Career.find(filter).select('-applications').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Career.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: careers,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('getAllCareers error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * GET /api/careers/:id
 * Get single career (public)
 */
const getCareerById = async (req, res) => {
  try {
    const career = await Career.findOne({ _id: req.params.id, isActive: true }).select('-applications');
    if (!career) return res.status(404).json({ success: false, message: 'Career not found' });
    res.status(200).json({ success: true, data: career });
  } catch (error) {
    console.error('getCareerById error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * POST /api/careers/:id/apply
 * Submit job application (public)
 */
const applyForCareer = async (req, res) => {
  try {
    const career = await Career.findOne({ _id: req.params.id, isActive: true });
    if (!career) return res.status(404).json({ success: false, message: 'Career not found' });

    const { fullName, email, phone, coverLetter } = req.body;
    if (!fullName || !email)
      return res.status(400).json({ success: false, message: 'Full name and email are required' });

    career.applications.push({
      fullName,
      email,
      phone:        phone || '',
      coverLetter:  coverLetter || '',
      resumeUrl:    req.file?.path || '',
      resumePublicId: req.file?.filename || '',
      appliedAt:    new Date(),
    });
    await career.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! We will be in touch soon.',
    });
  } catch (error) {
    console.error('applyForCareer error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN CONTROLLERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/admin/careers
 * Get all careers including inactive (admin)
 */
const adminGetAllCareers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, isActive } = req.query;
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) filter.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [careers, total] = await Promise.all([
      Career.find(filter).select('-applications').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Career.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: careers,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * GET /api/admin/careers/:id
 * Get single career with applications (admin)
 */
const adminGetCareerById = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ success: false, message: 'Career not found' });
    res.status(200).json({ success: true, data: career });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * POST /api/admin/careers
 * Create new career (admin) — accepts multipart/form-data with optional `careerImage` file
 */
const createCareer = async (req, res) => {
  try {
    const {
      title, iconName, category, need, location, description,
      requirements, requirementsList, responsibilities, responsibilitiesList,
      jobNumber, company, website, salaryMin, salaryMax, salaryPeriod,
      vacancy, applyDeadline, tags, isActive,
    } = req.body;

    // ── image uploaded via multer ─────────────────────────────────────────────
    const image = req.file
      ? { url: req.file.path, publicId: req.file.filename }
      : { url: '', publicId: '' };

    const career = await Career.create({
      title,
      iconName,
      image,
      category,
      need,
      location,
      description,
      requirements,
      requirementsList: Array.isArray(requirementsList)
        ? requirementsList
        : requirementsList ? JSON.parse(requirementsList) : [],
      responsibilities,
      responsibilitiesList: Array.isArray(responsibilitiesList)
        ? responsibilitiesList
        : responsibilitiesList ? JSON.parse(responsibilitiesList) : [],
      jobNumber,
      company,
      website,
      salaryMin:    salaryMin    ? Number(salaryMin)  : null,
      salaryMax:    salaryMax    ? Number(salaryMax)  : null,
      salaryPeriod,
      vacancy:      vacancy      ? Number(vacancy)    : 1,
      applyDeadline: applyDeadline || null,
      tags: Array.isArray(tags) ? tags : tags ? JSON.parse(tags) : [],
      isActive: isActive !== undefined ? isActive === 'true' || isActive === true : true,
    });

    res.status(201).json({ success: true, message: 'Career created successfully', data: career });
  } catch (error) {
    console.error('createCareer error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * PUT /api/admin/careers/:id
 * Update career (admin) — accepts multipart/form-data with optional new `careerImage` file
 */
const updateCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ success: false, message: 'Career not found' });

    const updates = { ...req.body };

    // ── new image uploaded? delete old one from Cloudinary first ──────────────
    if (req.file) {
      if (career.image?.publicId) {
        await deleteFromCloudinary(career.image.publicId, 'image').catch(() => {});
      }
      updates.image = { url: req.file.path, publicId: req.file.filename };
    }

    // parse JSON arrays sent as strings
    if (updates.requirementsList && typeof updates.requirementsList === 'string')
      updates.requirementsList = JSON.parse(updates.requirementsList);
    if (updates.responsibilitiesList && typeof updates.responsibilitiesList === 'string')
      updates.responsibilitiesList = JSON.parse(updates.responsibilitiesList);
    if (updates.tags && typeof updates.tags === 'string')
      updates.tags = JSON.parse(updates.tags);
    if (updates.isActive !== undefined)
      updates.isActive = updates.isActive === 'true' || updates.isActive === true;
    if (updates.salaryMin) updates.salaryMin = Number(updates.salaryMin);
    if (updates.salaryMax) updates.salaryMax = Number(updates.salaryMax);
    if (updates.vacancy)   updates.vacancy   = Number(updates.vacancy);

    const updatedCareer = await Career.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-applications');

    res.status(200).json({ success: true, message: 'Career updated successfully', data: updatedCareer });
  } catch (error) {
    console.error('updateCareer error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * DELETE /api/admin/careers/:id
 * Delete career (admin)
 */
const deleteCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ success: false, message: 'Career not found' });

    // delete career image from Cloudinary
    if (career.image?.publicId) {
      await deleteFromCloudinary(career.image.publicId, 'image').catch(() => {});
    }
    // delete resume files from Cloudinary
    const resumeDeletions = career.applications
      .filter((app) => app.resumePublicId)
      .map((app) => deleteFromCloudinary(app.resumePublicId, 'raw').catch(() => {}));
    await Promise.allSettled(resumeDeletions);

    await career.deleteOne();
    res.status(200).json({ success: true, message: 'Career deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * PATCH /api/admin/careers/:id/toggle
 * Toggle career active status (admin)
 */
const toggleCareerStatus = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ success: false, message: 'Career not found' });
    career.isActive = !career.isActive;
    await career.save();
    res.status(200).json({
      success: true,
      message: `Career ${career.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { isActive: career.isActive },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * GET /api/admin/careers/:id/applications
 * Get all applications for a career (admin)
 */
const getApplications = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id).select('title applications');
    if (!career) return res.status(404).json({ success: false, message: 'Career not found' });
    res.status(200).json({
      success: true,
      jobTitle: career.title,
      total: career.applications.length,
      data: career.applications.sort((a, b) => b.appliedAt - a.appliedAt),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * PATCH /api/admin/careers/:careerId/applications/:appId
 * Update application status (admin)
 */
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected'];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });

    const career = await Career.findById(req.params.careerId);
    if (!career) return res.status(404).json({ success: false, message: 'Career not found' });

    const application = career.applications.id(req.params.appId);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    application.status = status;
    await career.save();
    res.status(200).json({ success: true, message: 'Application status updated', data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * GET /api/admin/careers/stats
 * Get career stats (admin)
 */
const getStats = async (req, res) => {
  try {
    const [total, active, inactive, totalApplications] = await Promise.all([
      Career.countDocuments(),
      Career.countDocuments({ isActive: true }),
      Career.countDocuments({ isActive: false }),
      Career.aggregate([
        { $project: { applicationCount: { $size: '$applications' } } },
        { $group: { _id: null, total: { $sum: '$applicationCount' } } },
      ]),
    ]);
    res.status(200).json({
      success: true,
      data: {
        total,
        active,
        inactive,
        totalApplications: totalApplications[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

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