const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../public/uploads/applications');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_').slice(0, 40);
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error(`File type ${ext} not allowed.`), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

const applicationUpload = upload.fields([
  { name: 'sslc_file',    maxCount: 1 },
  { name: 'plus2_file',   maxCount: 1 },
  { name: 'degree_file',  maxCount: 1 },
  { name: 'masters_file', maxCount: 1 },
  { name: 'extra_file',   maxCount: 1 },
  { name: 'work_file',    maxCount: 1 },
]);

let Application;
try { Application = require('../models/Application'); } catch(e) { Application = null; }

const submitApplication = async (req, res) => {
  try {
    if (!Application) return res.status(500).json({ success: false, message: 'Application model not found' });
    const files = req.files || {};
    const getFile = (f) => files[f]?.[0]?.filename || null;
    const app = new Application({
      ...req.body,
      sslc_file: getFile('sslc_file'), plus2_file: getFile('plus2_file'),
      degree_file: getFile('degree_file'), masters_file: getFile('masters_file'),
      extra_file: getFile('extra_file'), work_file: getFile('work_file'),
    });
    await app.save();
    res.status(201).json({ success: true, message: 'Application submitted successfully.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getAllApplications = async (req, res) => {
  try {
    if (!Application) return res.status(500).json({ success: false, message: 'Application model not found' });
    const apps = await Application.find().sort({ createdAt: -1 });
    res.json({ success: true, data: apps });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getApplicationById = async (req, res) => {
  try {
    if (!Application) return res.status(500).json({ success: false, message: 'Application model not found' });
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: app });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const updateStatus = async (req, res) => {
  try {
    if (!Application) return res.status(500).json({ success: false, message: 'Application model not found' });
    const app = await Application.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, data: app });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const deleteApplication = async (req, res) => {
  try {
    if (!Application) return res.status(500).json({ success: false, message: 'Application model not found' });
    await Application.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getStats = async (req, res) => {
  try {
    if (!Application) return res.json({ success: true, data: { total: 0, pending: 0, approved: 0, rejected: 0 } });
    const [total, pending, approved, rejected] = await Promise.all([
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      Application.countDocuments({ status: 'approved' }),
      Application.countDocuments({ status: 'rejected' }),
    ]);
    res.json({ success: true, data: { total, pending, approved, rejected } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { applicationUpload, submitApplication, getAllApplications, getApplicationById, updateStatus, deleteApplication, getStats };
