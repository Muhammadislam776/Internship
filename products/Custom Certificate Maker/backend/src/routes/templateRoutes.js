const express = require('express');
const router = express.Router();
const {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate
} = require('../controllers/templateController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTemplates)
  .post(protect, authorize('admin', 'organization'), createTemplate);

router.route('/:id')
  .get(getTemplateById)
  .put(protect, authorize('admin'), updateTemplate)
  .delete(protect, authorize('admin'), deleteTemplate);

module.exports = router;
