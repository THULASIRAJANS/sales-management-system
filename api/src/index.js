const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const db = require('./utils/database');

app.use(cors());
app.use(express.json());

const routes = require('./routes');

app.use('/api', routes);

app.get('/api', (req, res) => {
  res.json({ 
    message: 'Sales Management API is running!',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

module.exports = app;
