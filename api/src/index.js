const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Import database to initialize connection
const db = require('./utils/database');

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const routes = require('./routes');

// API Routes
app.use('/api', routes);

// Root health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Sales Management API',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// API health check
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Sales Management API is running!',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Only listen if not in Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
