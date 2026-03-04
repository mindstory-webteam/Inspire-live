const Team = require('../models/Team');

// ✅ Correct filename — matches your project's uploadMiddleware.js
const { deleteFromCloudinary, getPublicIdFromUrl, isCloudinaryUrl } = require('../middleware/uploadMiddleware');

// ─── Public: GET all active team members ──────────────────────────────────────
exports.getTeamMembers = async (req, res) => {
  try {
    const members = await Team.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Public: GET single team member by ID ─────────────────────────────────────
exports.getTeamMember = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member)
      return res.status(404).json({ success: false, message: 'Team member not found' });
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Admin: GET all team members (including inactive) ─────────────────────────
exports.adminGetTeamMembers = async (req, res) => {
  try {
    const members = await Team.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Admin: CREATE team member ─────────────────────────────────────────────────
exports.createTeamMember = async (req, res) => {
  try {
    const { name, desig, email, facebook, instagram, twitter, linkedin, order, isActive } = req.body;

    // req.file.path = Cloudinary secure URL (set by teamUpload from uploadMiddleware.js)
    const img = req.file ? req.file.path : (req.body.img || '/images/team/team-1.webp');

    const member = await Team.create({
      name, desig, img, email,
      facebook, instagram, twitter, linkedin,
      order:    order    !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? isActive === 'true' || isActive === true : true,
    });

    res.status(201).json({ success: true, data: member });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── Admin: UPDATE team member ─────────────────────────────────────────────────
exports.updateTeamMember = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member)
      return res.status(404).json({ success: false, message: 'Team member not found' });

    const fields = ['name', 'desig', 'email', 'facebook', 'instagram', 'twitter', 'linkedin'];
    fields.forEach((f) => { if (req.body[f] !== undefined) member[f] = req.body[f]; });
    if (req.body.order    !== undefined) member.order    = Number(req.body.order);
    if (req.body.isActive !== undefined) member.isActive = req.body.isActive === 'true' || req.body.isActive === true;

    // New image — delete old one from Cloudinary first
    if (req.file) {
      if (member.img && isCloudinaryUrl(member.img)) {
        const oldId = getPublicIdFromUrl(member.img);
        if (oldId) {
          await deleteFromCloudinary(oldId, 'image').catch((e) =>
            console.warn('⚠️ Could not delete old team image:', e.message)
          );
        }
      }
      member.img = req.file.path;
    } else if (req.body.img) {
      member.img = req.body.img;
    }

    await member.save();
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── Admin: DELETE team member ─────────────────────────────────────────────────
exports.deleteTeamMember = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member)
      return res.status(404).json({ success: false, message: 'Team member not found' });

    if (member.img && isCloudinaryUrl(member.img)) {
      const publicId = getPublicIdFromUrl(member.img);
      if (publicId) {
        await deleteFromCloudinary(publicId, 'image').catch((e) =>
          console.warn('⚠️ Could not delete team image from Cloudinary:', e.message)
        );
      }
    }

    await member.deleteOne();
    res.json({ success: true, message: 'Team member deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Admin: TOGGLE active status ──────────────────────────────────────────────
exports.toggleActive = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member)
      return res.status(404).json({ success: false, message: 'Team member not found' });
    member.isActive = !member.isActive;
    await member.save();
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};