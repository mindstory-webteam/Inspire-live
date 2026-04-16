const OurResourcePerson = require('../models/OurResourcePerson');

const { deleteFromCloudinary, getPublicIdFromUrl, isCloudinaryUrl } = require('../middleware/upload');

exports.getOurResourceMembers = async (req, res) => {
  try {
    const members = await OurResourcePerson.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOurResourceMember = async (req, res) => {
  try {
    const member = await OurResourcePerson.findById(req.params.id);
    if (!member)
      return res.status(404).json({ success: false, message: 'Team member not found' });
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.adminGetOurResourceMembers = async (req, res) => {
  try {
    const members = await OurResourcePerson.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createOurResourceMember = async (req, res) => {
  try {
    const { name, desig, email, facebook, instagram, twitter, linkedin, order, isActive } = req.body;

    const img = req.file ? 'https://inspireeducationservice.com/uploads/' + req.file.filename : (req.body.img || '/images/team/team-1.webp');

    const member = await OurResourcePerson.create({
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

exports.updateOurResourceMember = async (req, res) => {
  try {
    const member = await OurResourcePerson.findById(req.params.id);
    if (!member)
      return res.status(404).json({ success: false, message: 'Team member not found' });

    const fields = ['name', 'desig', 'email', 'facebook', 'instagram', 'twitter', 'linkedin'];
    fields.forEach((f) => { if (req.body[f] !== undefined) member[f] = req.body[f]; });
    if (req.body.order    !== undefined) member.order    = Number(req.body.order);
    if (req.body.isActive !== undefined) member.isActive = req.body.isActive === 'true' || req.body.isActive === true;

    if (req.file) {
      if (member.img && isCloudinaryUrl(member.img)) {
        const oldId = getPublicIdFromUrl(member.img);
        if (oldId) {
          await deleteFromCloudinary(oldId, 'image').catch((e) =>
            console.warn('Could not delete old team image:', e.message)
          );
        }
      }
      member.img = 'https://inspireeducationservice.com/uploads/' + req.file.filename;
    } else if (req.body.img) {
      member.img = req.body.img;
    }

    await member.save();
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteOurResourceMember = async (req, res) => {
  try {
    const member = await OurResourcePerson.findById(req.params.id);
    if (!member)
      return res.status(404).json({ success: false, message: 'Team member not found' });

    if (member.img && isCloudinaryUrl(member.img)) {
      const publicId = getPublicIdFromUrl(member.img);
      if (publicId) {
        await deleteFromCloudinary(publicId, 'image').catch((e) =>
          console.warn('Could not delete team image from Cloudinary:', e.message)
        );
      }
    }

    await member.deleteOne();
    res.json({ success: true, message: 'Team member deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleOurResourceActive = async (req, res) => {
  try {
    const member = await OurResourcePerson.findById(req.params.id);
    if (!member)
      return res.status(404).json({ success: false, message: 'Resource member not found' });
    member.isActive = !member.isActive;
    await member.save();
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};