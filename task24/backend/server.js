const express = require('express');
const cors = require('cors');
require('dotenv').config();

const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentController = require('./controllers/paymentController');

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for frontend client URL
app.use(cors({
  origin: '*', // Allow all during development or specific process.env.CLIENT_URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Express Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'PayFlow Backend API',
    stripeConfigured: !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_')),
    timestamp: new Date().toISOString()
  });
});

// 🚀 Core technical requirement: Direct POST /create-payment route at root
app.post('/create-payment', paymentController.createPayment);

// API route prefixes
app.use('/api/auth', authRoutes);
app.use('/api', paymentRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error occurred',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`
=====================================================
🚀 PayFlow Server is running on port ${PORT}
💳 Core Route: POST http://localhost:${PORT}/create-payment
⚡ Health Check: GET http://localhost:${PORT}/api/health
=====================================================
  `);
});
