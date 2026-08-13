import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Express built-in JSON body parser
app.use(express.json());

// API Status & Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: "Online",
    service: "ShieldForm Security API",
    middleware: "Active (Zod v3)",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', userRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler caught:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: { server: err.message || "An unexpected error occurred" }
  });
});

app.listen(PORT, () => {
  console.log(`🛡️ ShieldForm Backend Security Engine running on http://localhost:${PORT}`);
});
