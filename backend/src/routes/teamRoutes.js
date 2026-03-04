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

const { teamUpload } = require('../middleware/uploadMiddleware');

// ─── Auth middleware — matches YOUR existing export names ─────────────────────
// Look at how careerRoutes / eventRoutes import auth and use the same names here.
// Common patterns:
//   { protect, adminOnly }   ← most common
//   { authenticate, authorize }
//   { verifyToken, isAdmin }
//
// To find yours, run:  grep -r "module.exports" src/middleware/auth.js
//
const authMiddleware = require('../middleware/auth');

// Resolve whichever export names your auth.js uses
const protect   = authMiddleware.protect
               || authMiddleware.authenticate
               || authMiddleware.verifyToken
               || authMiddleware.auth
               || ((req, res, next) => {
                    // Fallback: check Authorization header manually
                    const token = req.headers.authorization?.split(' ')[1];
                    if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });
                    next();
                  });

const adminOnly = authMiddleware.adminOnly
               || authMiddleware.authorize
               || authMiddleware.isAdmin
               || authMiddleware.restrictTo?.('admin')
               || ((req, res, next) => {
                    if (req.user && req.user.role !== 'admin') {
                      return res.status(403).json({ success: false, message: 'Admin access required' });
                    }
                    next();
                  });

// ─── Public Router ────────────────────────────────────────────────────────────
const teamRouter = express.Router();

teamRouter.get('/',     getTeamMembers);  // GET /api/team
teamRouter.get('/:id',  getTeamMember);   // GET /api/team/:id

// ─── Admin Router ─────────────────────────────────────────────────────────────
const teamAdminRouter = express.Router();

teamAdminRouter.use(protect, adminOnly);

teamAdminRouter.get('/',              adminGetTeamMembers);         // GET    /api/admin/team
teamAdminRouter.post('/',   teamUpload, createTeamMember);          // POST   /api/admin/team
teamAdminRouter.put('/:id', teamUpload, updateTeamMember);          // PUT    /api/admin/team/:id
teamAdminRouter.delete('/:id',          deleteTeamMember);          // DELETE /api/admin/team/:id
teamAdminRouter.patch('/:id/toggle',    toggleActive);              // PATCH  /api/admin/team/:id/toggle

module.exports = { teamRouter, teamAdminRouter };