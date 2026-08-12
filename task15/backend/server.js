const express = require('express');
const cors = require('cors');
require('dotenv').config();

const adminUsersRouter = require('./routes/adminUsers');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend communication
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key']
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Mount Routes
app.use('/admin/users', adminUsersRouter);
app.use('/api/admin/users', adminUsersRouter);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    server: 'AdminSphere Express Security Node',
    timestamp: new Date().toISOString(),
    supabaseServiceRoleKeyPresent: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('your_service_role_key'))
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: '⚡ Welcome to AdminSphere Express API Server',
    security: 'Supabase Service Role Key is protected on SERVER-ONLY.',
    endpoints: [
      'GET /admin/users',
      'GET /api/admin/users',
      'GET /api/health'
    ]
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`
=====================================================
🚀 AdminSphere Express Server running on port ${PORT}
🔒 Security Check:
   - SUPABASE_URL: ${process.env.SUPABASE_URL ? 'CONFIGURED' : 'NOT SET'}
   - SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'PROTECTED (Server Only)' : 'NOT SET'}
   - Route Ready: GET http://localhost:${PORT}/admin/users
=====================================================
  `);
});
