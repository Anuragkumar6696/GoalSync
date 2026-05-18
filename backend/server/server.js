const app = require('./app');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

const startServer = (port) => {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
    console.log('Press CTRL-C to stop');
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`ERROR: Port ${port} is already in use.`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
};

console.log('Starting server...');
startServer(PORT);
