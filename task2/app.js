
const express = require('express');
const path = require('path');
const { router: bookRoutes } = require('./routes/books');

const app = express();
const requestedPort = Number(process.env.PORT || 3000);

app.use(express.json());
app.use('/api/books', bookRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function startServer(port) {
  const server = app.listen(port, '0.0.0.0');

  server.on('listening', () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const fallbackPort = port + 1;
      console.log(`Port ${port} is busy, trying ${fallbackPort}...`);
      startServer(fallbackPort);
      return;
    }

    throw error;
  });
}

if (require.main === module) {
  startServer(requestedPort);
}

module.exports = { app, startServer };
