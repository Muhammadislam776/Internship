const express = require('express');
const router = express.Router();
const { handleGetSearchIntelligence, handleLogSearch } = require('../controllers/searchIntelligenceController');

router.get('/', handleGetSearchIntelligence);
router.post('/log', handleLogSearch);

module.exports = router;
