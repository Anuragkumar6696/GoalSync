const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Goal = require('../models/Goal');
const AuditLog = require('../models/AuditLog');
const CheckIn = require('../models/CheckIn');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Goal.deleteMany();
    await AuditLog.deleteMany();
    await CheckIn.deleteMany();
    console.log('Existing data cleared.');

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
    });
    console.log('Admin user created.');

    // Create Manager
    const manager = await User.create({
      name: 'Manager User',
      email: 'manager@test.com',
      password: 'password123',
      role: 'manager',
    });
    console.log('Manager user created.');

    // Create Employee reporting to Manager
    const employee = await User.create({
      name: 'Employee User',
      email: 'employee@test.com',
      password: 'password123',
      role: 'employee',
      manager: manager._id,
    });
    console.log('Employee user created.');

    // Create some demo goals for the employee
    await Goal.create([
      {
        employee: employee._id,
        thrustArea: 'Technical Excellence',
        goalTitle: 'Master Node.js',
        description: 'Complete advanced Node.js course and implement 3 projects',
        unitOfMeasurement: 'Numeric_Min',
        target: 3,
        achievement: 1,
        weightage: 20,
        quarter: 'Q1',
        status: 'On Track',
        isSubmitted: true,
      },
      {
        employee: employee._id,
        thrustArea: 'Productivity',
        goalTitle: 'Ticket Resolution',
        description: 'Resolve at least 50 tickets per month',
        unitOfMeasurement: 'Numeric_Min',
        target: 50,
        achievement: 45,
        weightage: 30,
        quarter: 'Q1',
        status: 'On Track',
        isSubmitted: true,
      },
      {
        employee: employee._id,
        thrustArea: 'Quality',
        goalTitle: 'Zero Bug Policy',
        description: 'Maintain zero critical bugs in production',
        unitOfMeasurement: 'Zero',
        target: 0,
        achievement: 0,
        weightage: 50,
        quarter: 'Q1',
        status: 'Completed',
        isSubmitted: true,
      }
    ]);
    console.log('Demo goals created.');

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
