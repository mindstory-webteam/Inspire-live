const express = require('express');
const {
  getTeamMembers,
  getTeamMember,
  adminGetTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  toggleActive,
} = require('../controllers/teamController');

// ✅ Correct middleware filenames (matches careerRoutes pattern)
const { protect, adminOrAbove } = require('../middleware/auth');
const { teamUpload }            = require('../middleware/uploadMiddleware');

// ─── Public Router — /api/team ────────────────────────────────────────────────
const teamRouter = express.Router();

teamRouter.get('/',    getTeamMembers);  // GET /api/team
teamRouter.get('/:id', getTeamMember);  // GET /api/team/:id

// ─── Admin Router — /api/admin/team ──────────────────────────────────────────
const teamAdminRouter = express.Router();

teamAdminRouter.use(protect, adminOrAbove); // ✅ matches careerRoutes exactly

teamAdminRouter.get('/',              adminGetTeamMembers);
teamAdminRouter.post('/',   teamUpload, createTeamMember);
teamAdminRouter.put('/:id', teamUpload, updateTeamMember);
teamAdminRouter.delete('/:id',          deleteTeamMember);
teamAdminRouter.patch('/:id/toggle',    toggleActive);

module.exports = { teamRouter, teamAdminRouter };