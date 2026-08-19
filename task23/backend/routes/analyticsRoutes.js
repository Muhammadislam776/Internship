const express = require('express');
const router = express.Router();
const { handleGetAnalytics } = require('../controllers/analyticsController');

router.get('/', handleGetAnalytics);

module.exports = router;
