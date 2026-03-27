const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Import Controllers
const riskController = require('./src/controllers/riskController');

// Routes
app.get('/', (req, res) => {
  res.send('NeuroGuard API is running. Health: Good.');
});

// The core endpoint: Calculate Migraine Risk
app.post('/api/calculate-risk', riskController.calculateRisk);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
