const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// 🚀 Core requirement: POST /create-payment (Stripe Hosted Checkout)
router.post('/create-payment', paymentController.createPayment);

// Mobile SMS OTP Verification Endpoints
router.post('/send-otp', paymentController.sendOtp);
router.post('/verify-otp', paymentController.verifyOtp);
router.post('/update-twilio-keys', paymentController.updateTwilioKeys);

// E-Commerce Direct Payment Endpoints
router.post('/process-card-payment', paymentController.processCardPayment);
router.post('/process-qr-payment', paymentController.processQrPayment);
router.post('/process-cod-payment', paymentController.processCodPayment);

// Catalog & Verification
router.get('/products', paymentController.getProducts);
router.get('/verify-session', paymentController.verifySession);

// Enterprise Features
router.post('/validate-coupon', paymentController.validateCoupon);
router.post('/update-keys', paymentController.updateStripeKeys);
router.post('/refund', paymentController.issueRefund);
router.post('/webhook', paymentController.handleWebhook);

// Analytics & Audit
router.get('/transactions', paymentController.getTransactions);
router.get('/analytics', paymentController.getAnalytics);

module.exports = router;
