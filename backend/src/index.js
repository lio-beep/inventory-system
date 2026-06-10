const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { getPool } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Inventory System API is running!' });
});

// Start server only after DB connects
const start = async () => {
  try {
    await getPool();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
  }
};

start();