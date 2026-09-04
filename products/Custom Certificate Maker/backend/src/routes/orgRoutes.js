const express = require('express');
const router = express.Router();
const { getOrgProfile, updateOrgProfile, uploadOrgAsset, getOrgStats } = require('../controllers/orgController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/profile', protect, authorize('organization', 'admin'), getOrgProfile);
router.put('/profile', protect, authorize('organization', 'admin'), updateOrgProfile);
router.post('/upload', protect, authorize('organization', 'admin'), upload.single('image'), uploadOrgAsset);
router.get('/stats', protect, authorize('organization'), getOrgStats);

module.exports = router;
