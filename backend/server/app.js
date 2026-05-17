const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/employee', require('./routes/employeeRoutes'));
app.use('/api/v1/manager', require('./routes/managerRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Goal Setting & Tracking Portal API' });
  });
}

// Error handler
app.use(errorHandler);

module.exports = app;
