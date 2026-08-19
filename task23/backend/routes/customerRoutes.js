const express = require('express');
const router = express.Router();
const { handleGetCustomers, handleGetCustomerById, handleGetCustomerOrders } = require('../controllers/customerController');

router.get('/', handleGetCustomers);
router.get('/:id', handleGetCustomerById);
router.get('/:id/orders', handleGetCustomerOrders);

module.exports = router;
