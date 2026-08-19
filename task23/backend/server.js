const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./config/db');

const orderRoutes = require('./routes/orderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const searchIntelligenceRoutes = require('./routes/searchIntelligenceRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/search-intelligence', searchIntelligenceRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'OrderSphere - Customer Order Intelligence API',
    timestamp: new Date().toISOString()
  });
});

// Serve compiled Frontend assets in production
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    error: err.message
  });
});

// Boot Database & Express Server
async function startServer() {
  try {
    initDB();
    app.listen(PORT, () => {
      console.log(`🚀 OrderSphere full-stack application running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
