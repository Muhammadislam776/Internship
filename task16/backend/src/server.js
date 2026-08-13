const express = require('express');
const cors = require('cors');
require('dotenv').config();

const profileRoutes = require('./routes/profileRoutes');
const { ensureBucketExists } = require('./config/supabase');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - Allow frontend interactions
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'ProfileHub API',
    timestamp: new Date().toISOString()
  });
});

// Profile API Routes
app.use('/api/profile', profileRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global API Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'SERVER_ERROR',
    message: err.message || 'Internal server error'
  });
});

// Start Server and initialize Supabase Bucket check
app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(`🚀 ProfileHub Backend running on http://localhost:${PORT}`);
  console.log(`====================================================`);
  
  // Ensure Supabase storage bucket 'profile-pictures' exists
  await ensureBucketExists();
});
