const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
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

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Goal Setting & Tracking Portal API' });
});

// Auth Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
// Employee Routes
app.use('/api/v1/employee', require('./routes/employeeRoutes'));
// Manager Routes
app.use('/api/v1/manager', require('./routes/managerRoutes'));
// Admin Routes
app.use('/api/v1/admin', require('./routes/adminRoutes'));

// Error handler
app.use(errorHandler);

module.exports = app;
