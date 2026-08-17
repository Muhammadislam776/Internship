const express = require('express');
const router = express.Router();
const { getProfile, getActivity } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes (require valid Bearer JWT)
router.get('/profile', authMiddleware, getProfile);
router.get('/activity', authMiddleware, getActivity);

module.exports = router;
