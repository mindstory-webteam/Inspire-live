const Banner = require('../models/Banner');
const { deleteFromCloudinary, getPublicIdFromUrl, isCloudinaryUrl } = require('../middleware/upload');

// ─── Helpers ────────────────────────────────────────────────────────────────

const getOrCreateBanner = async () => {
  let banner = await Banner.findOne();
  if (!banner) {
    banner = await Banner.create({ name: 'Hero Banner', slides: [] });
  }
  return banner;
};

// ─── Public ──────────────────────────────────────────────────────────────────

exports.getPublicBanner = async (req, res) => {
  try {
    const banner = await Banner.findOne({ isActive: true }).lean();
    if (!banner) return res.json({ success: true, data: { slides: [] } });

    banner.slides = banner.slides
      .filter((s) => s.isActive)
      .sort((a, b) => a.order - b.order);

    res.json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Admin ───────────────────────────────────────────────────────────────────

exports.getBanner = async (req, res) => {
  try {
    const banner = await getOrCreateBanner();
    banner.slides.sort((a, b) => a.order - b.order);
    res.json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addSlide = async (req, res) => {
  try {
    const banner = await getOrCreateBanner();
    const { title, subtitle, description, type, mediaUrl, thumbUrl, buttonText, buttonUrl, isActive } = req.body;

    let resolvedMediaUrl = mediaUrl;
    let resolvedThumbUrl = thumbUrl || '';

    if (req.file) {
      resolvedMediaUrl = 'https://inspireeducationservice.com/uploads/' + req.file.filename;
      // Always sync thumbUrl to the new media
      resolvedThumbUrl = resolvedMediaUrl;
    }

    const newSlide = {
      title,
      subtitle: subtitle || '',
      description: description || '',
      type: type || 'image',
      mediaUrl: resolvedMediaUrl,
      thumbUrl: resolvedThumbUrl || resolvedMediaUrl,
      buttonText: buttonText || 'Get Started',
      buttonUrl: buttonUrl || '/contact',
      order: banner.slides.length,
      isActive: isActive !== undefined ? isActive : true,
    };

    banner.slides.push(newSlide);
    await banner.save();

    res.status(201).json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSlide = async (req, res) => {
  try {
    const banner = await getOrCreateBanner();
    const slide = banner.slides.id(req.params.slideId);
    if (!slide) return res.status(404).json({ success: false, message: 'Slide not found' });

    const oldMediaUrl = slide.mediaUrl;

    // Apply text fields from body
    const fields = ['title', 'subtitle', 'description', 'type', 'mediaUrl', 'thumbUrl', 'buttonText', 'buttonUrl', 'order', 'isActive'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) slide[f] = req.body[f];
    });

    // Handle new file upload — FIX: always sync thumbUrl to new mediaUrl
    if (req.file) {
      slide.mediaUrl = 'https://inspireeducationservice.com/uploads/' + req.file.filename;           // Cloudinary secure_url
      slide.thumbUrl = 'https://inspireeducationservice.com/uploads/' + req.file.filename;           // ← KEY FIX: keep thumbnail in sync

      // Delete old file from Cloudinary
      if (oldMediaUrl && isCloudinaryUrl(oldMediaUrl)) {
        const publicId = getPublicIdFromUrl(oldMediaUrl);
        if (publicId) {
          const resourceType = slide.type === 'video' ? 'video' : 'image';
          await deleteFromCloudinary(publicId, resourceType).catch((err) =>
            console.error('Failed to delete old file from Cloudinary:', err)
          );
        }
      }
    }

    await banner.save();
    res.json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteSlide = async (req, res) => {
  try {
    const banner = await getOrCreateBanner();
    const slide = banner.slides.id(req.params.slideId);
    if (!slide) return res.status(404).json({ success: false, message: 'Slide not found' });

    if (slide.mediaUrl && isCloudinaryUrl(slide.mediaUrl)) {
      const publicId = getPublicIdFromUrl(slide.mediaUrl);
      if (publicId) {
        const resourceType = slide.type === 'video' ? 'video' : 'image';
        await deleteFromCloudinary(publicId, resourceType).catch((err) =>
          console.error('Failed to delete file from Cloudinary:', err)
        );
      }
    }

    slide.deleteOne();
    await banner.save();
    res.json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.reorderSlides = async (req, res) => {
  try {
    const banner = await getOrCreateBanner();
    const { order } = req.body;
    order.forEach(({ id, order: ord }) => {
      const slide = banner.slides.id(id);
      if (slide) slide.order = ord;
    });
    await banner.save();
    res.json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleBanner = async (req, res) => {
  try {
    const banner = await getOrCreateBanner();
    banner.isActive = !banner.isActive;
    await banner.save();
    res.json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};