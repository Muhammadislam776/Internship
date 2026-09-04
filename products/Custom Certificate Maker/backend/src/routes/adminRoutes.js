const express = require('express');
const router = express.Router();
const {
  getAdminAnalytics,
  getAllOrganizations,
  getAllUsers,
  updateUserStatus,
  getVerificationLogs,
  getActivityLogs,
  getAdminNotifications,
  getSystemSettings,
  updateSystemSettings
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));

router.get('/analytics', getAdminAnalytics);
router.get('/organizations', getAllOrganizations);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/verification-logs', getVerificationLogs);
router.get('/activity-logs', getActivityLogs);
router.get('/notifications', getAdminNotifications);
router.route('/settings')
  .get(getSystemSettings)
  .put(updateSystemSettings);

module.exports = router;
