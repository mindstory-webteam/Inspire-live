const express = require('express');
const { protect, adminOrAbove } = require('../middleware/auth');
const { teamUpload }            = require('../middleware/uploadMiddleware');
const {
  getOurResourceMembers,
  getOurResourceMember,
  adminGetOurResourceMembers,
  createOurResourceMember,
  updateOurResourceMember,
  deleteOurResourceMember,
  toggleOurResourceActive,
} = require('../controllers/ResourcePersonController');

const ourresourceRouter = express.Router();
ourresourceRouter.get('/',    getOurResourceMembers);
ourresourceRouter.get('/:id', getOurResourceMember);

const resourcepersonAdminRouter = express.Router();

resourcepersonAdminRouter.use(protect, adminOrAbove);

resourcepersonAdminRouter.get('/',               adminGetOurResourceMembers);
resourcepersonAdminRouter.post('/',   teamUpload, createOurResourceMember);
resourcepersonAdminRouter.put('/:id', teamUpload, updateOurResourceMember);
resourcepersonAdminRouter.delete('/:id',          deleteOurResourceMember);
resourcepersonAdminRouter.patch('/:id/toggle',    toggleOurResourceActive);

module.exports = { ourresourceRouter, resourcepersonAdminRouter };