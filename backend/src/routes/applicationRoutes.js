const express = require('express');
const {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateStatus,
  deleteApplication,
  getStats,
} = require('../controllers/applicationController');
const { applicationUpload } = require('../middleware/applicationUpload');
const { protect, adminOnly } = require('../middleware/auth'); // reuse your existing auth middleware

// ─── Public router ────────────────────────────────────────────────────────────
const applicationRouter = express.Router();

// POST /api/applications/submit  — multipart form with files
applicationRouter.post('/submit', applicationUpload, submitApplication);

// ─── Admin router ─────────────────────────────────────────────────────────────
const applicationAdminRouter = express.Router();

applicationAdminRouter.use(protect, adminOnly);  // lock all admin routes

applicationAdminRouter.get('/stats',        getStats);
applicationAdminRouter.get('/',             getAllApplications);
applicationAdminRouter.get('/:id',          getApplicationById);
applicationAdminRouter.patch('/:id/status', updateStatus);
applicationAdminRouter.delete('/:id',       deleteApplication);

module.exports = { applicationRouter, applicationAdminRouter };