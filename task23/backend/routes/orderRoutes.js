const express = require('express');
const router = express.Router();
const { handleGetOrders, handleGetOrderById } = require('../controllers/orderController');

router.get('/', handleGetOrders);
router.get('/:id', handleGetOrderById);

module.exports = router;
