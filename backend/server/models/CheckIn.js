const mongoose = require('mongoose');

const CheckInSchema = new mongoose.Schema({
  goal: {
    type: mongoose.Schema.ObjectId,
    ref: 'Goal',
    required: true,
  },
  manager: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
  },
  quarter: {
    type: String,
    enum: ['Q1', 'Q2', 'Q3', 'Q4'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CheckIn', CheckInSchema);
