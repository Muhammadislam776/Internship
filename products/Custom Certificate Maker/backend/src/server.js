const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Core Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CertifyCraft SaaS Backend API Running', timestamp: new Date() });
});

// API Routes Mount
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/org', require('./routes/orgRoutes'));
app.use('/api/certificates', require('./routes/certRoutes'));
app.use('/api/templates', require('./routes/templateRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/verify', require('./routes/verifyRoutes'));

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=================================================`);
  console.log(`🚀 Certificate Platform API Server running on 0.0.0.0:${PORT}`);
  console.log(`=================================================`);
});
