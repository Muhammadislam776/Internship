const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  deleteProfilePicture
} = require('../controllers/profileController');
const { uploadProfileSingle } = require('../middleware/uploadMiddleware');

// Get profile details
router.get('/:id', getProfile);
router.get('/', getProfile);

// Update profile metadata
router.put('/:id', updateProfile);
router.put('/', updateProfile);

// Upload profile picture (POST /api/profile/upload)
router.post('/upload', uploadProfileSingle, uploadProfilePicture);

// Delete profile picture (DELETE /api/profile/image)
router.delete('/image', deleteProfilePicture);

module.exports = router;
