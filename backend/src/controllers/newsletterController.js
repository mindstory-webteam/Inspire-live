const Newsletter = require('../models/Newsletter');

// ── PUBLIC ────────────────────────────────────────────────────────────────────

exports.subscribe = async (req, res) => {
  try {
    const { email, agreedToTerms } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    if (!agreedToTerms) {
      return res.status(400).json({ success: false, message: 'You must agree to the Terms & Conditions' });
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase().trim() });

    if (existing) {
      if (existing.status === 'active') {
        return res.status(409).json({ success: false, message: 'This email is already subscribed' });
      }
      // Re-subscribe
      existing.status         = 'active';
      existing.agreedToTerms  = true;
      existing.subscribedAt   = new Date();
      existing.unsubscribedAt = undefined;
      existing.ipAddress      = req.ip || req.headers['x-forwarded-for'];
      await existing.save();
      return res.status(200).json({ success: true, message: 'You have been re-subscribed successfully!' });
    }

    await Newsletter.create({
      email:         email.toLowerCase().trim(),
      agreedToTerms: Boolean(agreedToTerms),
      source:        req.body.source || 'footer',
      ipAddress:     req.ip || req.headers['x-forwarded-for'],
    });

    return res.status(201).json({ success: true, message: 'Subscribed successfully! Thank you.' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'This email is already subscribed' });
    }
    console.error('Newsletter subscribe error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const subscriber = await Newsletter.findOne({ email: email.toLowerCase().trim() });
    if (!subscriber) return res.status(404).json({ success: false, message: 'Email not found' });

    subscriber.status         = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    return res.status(200).json({ success: true, message: 'Unsubscribed successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── ADMIN ─────────────────────────────────────────────────────────────────────

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, sort = '-createdAt' } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) filter.email  = { $regex: search, $options: 'i' };

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Newsletter.countDocuments(filter);
    const data  = await Newsletter.find(filter).sort(sort).skip(skip).limit(Number(limit));

    return res.status(200).json({
      success: true,
      data,
      pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [total, active, unsubscribed, todayCount, thisMonthCount] = await Promise.all([
      Newsletter.countDocuments(),
      Newsletter.countDocuments({ status: 'active' }),
      Newsletter.countDocuments({ status: 'unsubscribed' }),
      Newsletter.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
      Newsletter.countDocuments({ createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } }),
    ]);

    const last7Days = await Newsletter.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({ success: true, data: { total, active, unsubscribed, todayCount, thisMonthCount, last7Days } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);
    if (!subscriber) return res.status(404).json({ success: false, message: 'Subscriber not found' });
    return res.status(200).json({ success: true, data: subscriber });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.toggle = async (req, res) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);
    if (!subscriber) return res.status(404).json({ success: false, message: 'Subscriber not found' });

    subscriber.status = subscriber.status === 'active' ? 'unsubscribed' : 'active';
    if (subscriber.status === 'unsubscribed') subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    return res.status(200).json({ success: true, message: `Subscriber ${subscriber.status}`, data: subscriber });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const subscriber = await Newsletter.findByIdAndDelete(req.params.id);
    if (!subscriber) return res.status(404).json({ success: false, message: 'Subscriber not found' });
    return res.status(200).json({ success: true, message: 'Subscriber deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No IDs provided' });
    }
    const result = await Newsletter.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({ success: true, message: `${result.deletedCount} subscriber(s) deleted` });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.exportSubscribers = async (req, res) => {
  try {
    const { status = 'active' } = req.query;
    const subscribers = await Newsletter.find({ status }).select('email subscribedAt source -_id');

    const csvHeader = 'Email,Subscribed At,Source\n';
    const csvRows   = subscribers.map((s) => `${s.email},${s.subscribedAt.toISOString()},${s.source}`).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="newsletter_subscribers.csv"');
    return res.send(csvHeader + csvRows);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};