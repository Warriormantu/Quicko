const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getProfile, updateProfile, addAddress, deleteAddress,
  getAllUsers, toggleBlockUser, updateUserRole, getDashboardStats
} = require('../controllers/userController');

// Named routes FIRST (before /:id wildcard)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

// Admin named routes
router.get('/admin/dashboard', protect, adminOnly, getDashboardStats);
router.get('/', protect, adminOnly, getAllUsers);

// Wildcard /:id admin routes
router.put('/:id/role', protect, adminOnly, updateUserRole);
router.put('/:id/block', protect, adminOnly, toggleBlockUser);

module.exports = router;
