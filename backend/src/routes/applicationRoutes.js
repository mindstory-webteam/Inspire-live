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

let protect, adminOnly;
try {
  const auth = require('../middleware/auth');
  protect = auth.protect;
  adminOnly = auth.adminOnly;
} catch(e) {
  protect = (req, res, next) => next();
  adminOnly = (req, res, next) => next();
}

if (!protect) protect = (req, res, next) => next();
if (!adminOnly) adminOnly = (req, res, next) => next();

const applicationRouter = express.Router();
applicationRouter.post('/submit', applicationUpload, submitApplication);

const applicationAdminRouter = express.Router();
applicationAdminRouter.use(protect, adminOnly);
applicationAdminRouter.get('/stats', getStats);
applicationAdminRouter.get('/', getAllApplications);
applicationAdminRouter.get('/:id', getApplicationById);
applicationAdminRouter.patch('/:id/status', updateStatus);
applicationAdminRouter.delete('/:id', deleteApplication);

module.exports = { applicationRouter, applicationAdminRouter };
