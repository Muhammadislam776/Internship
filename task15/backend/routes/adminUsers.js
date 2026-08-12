const express = require('express');
const router = express.Router();
const { getAllAdminUsers, createAdminUser } = require('../controllers/adminUsersController');
const { verifyAdminAuth } = require('../middleware/authMiddleware');

// GET /admin/users - Fetch users from Supabase Auth via Service Role key
router.get('/', verifyAdminAuth, getAllAdminUsers);
router.get('/users', verifyAdminAuth, getAllAdminUsers);

// POST /admin/users - Create new user entry
router.post('/', verifyAdminAuth, createAdminUser);
router.post('/users', verifyAdminAuth, createAdminUser);

module.exports = router;
