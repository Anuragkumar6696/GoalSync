const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('ERROR: MONGODB_URI is not defined in environment variables');
      process.exit(1);
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
