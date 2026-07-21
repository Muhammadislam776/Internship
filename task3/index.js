const express = require('express');
const app = express();
const port = 3000;

// Basic CORS middleware
const corsMiddleware = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
};

// Custom Logger Middleware
const loggerMiddleware = (req, res, next) => {
    const time = new Date().toISOString();
    
    console.log(`[${time}] ${req.method}`);

    next();
};

app.use(corsMiddleware);
// Use the custom logger middleware for all routes
app.use(loggerMiddleware);

// Sample Route
app.get('/', (req, res) => {
    res.send('Hello World! Check the console for the logger middleware output.');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

