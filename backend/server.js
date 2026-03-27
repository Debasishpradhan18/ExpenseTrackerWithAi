const express = require('express');
const cors = require('cors');
require('dotenv').config();

const transactionRoutes = require('./routes/transactions');
const insightRoutes = require('./routes/insights');
const { verifyToken } = require('./config/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Public route test
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SmartExpense backend working!' });
});

// Protected routes
app.use('/api/transactions', verifyToken, transactionRoutes);
app.use('/api/insights', verifyToken, insightRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
