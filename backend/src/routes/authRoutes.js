const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updatePassword,
  updateProfile,
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require('../controllers/authController');
const { protect, superAdminOnly } = require('../middleware/auth');

// Public
router.post('/register', register);
router.post('/login', login);

// Private — any logged-in user
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);
router.put('/update-profile', protect, updateProfile);

// SuperAdmin only — user management
router.get('/users',        protect, superAdminOnly, getAllUsers);
router.post('/users',       protect, superAdminOnly, createUser);
router.put('/users/:id',    protect, superAdminOnly, updateUser);
router.delete('/users/:id', protect, superAdminOnly, deleteUser);

module.exports = router;