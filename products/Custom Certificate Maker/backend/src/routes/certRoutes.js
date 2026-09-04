const express = require('express');
const router = express.Router();
const {
  createCertificate,
  getCertificates,
  getCertificateById,
  updateCertificate,
  revokeCertificate,
  restoreCertificate,
  deleteCertificate
} = require('../controllers/certController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, authorize('organization', 'admin'), createCertificate)
  .get(protect, getCertificates);

router.route('/:id')
  .get(protect, getCertificateById)
  .put(protect, authorize('organization', 'admin'), updateCertificate)
  .delete(protect, authorize('organization', 'admin'), deleteCertificate);

router.put('/:id/revoke', protect, authorize('organization', 'admin'), revokeCertificate);
router.put('/:id/restore', protect, authorize('admin', 'organization'), restoreCertificate);

module.exports = router;
