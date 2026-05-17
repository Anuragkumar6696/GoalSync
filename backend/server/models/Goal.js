const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  thrustArea: {
    type: String,
    required: [true, 'Please add a thrust area'],
  },
  goalTitle: {
    type: String,
    required: [true, 'Please add a goal title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  unitOfMeasurement: {
    type: String,
    required: [true, 'Please add a unit of measurement'],
    enum: [
      'Numeric_Min',
      'Numeric_Max',
      'Percentage_Min',
      'Percentage_Max',
      'Timeline',
      'Zero',
    ],
  },
  target: {
    type: Number,
    required: [true, 'Please add a target'],
  },
  achievement: {
    type: Number,
    default: 0,
  },
  weightage: {
    type: Number,
    required: [true, 'Please add weightage'],
    min: [10, 'Minimum weightage per goal is 10%'],
  },
  status: {
    type: String,
    enum: ['Not Started', 'On Track', 'Completed'],
    default: 'Not Started',
  },
  quarter: {
    type: String,
    enum: ['Q1', 'Q2', 'Q3', 'Q4'],
    required: [true, 'Please add a quarter'],
  },
  approved: {
    type: Boolean,
    default: false,
  },
  locked: {
    type: Boolean,
    default: false,
  },
  progress: {
    type: Number,
    default: 0,
  },
  isSubmitted: {
    type: Boolean,
    default: false,
  },
  managerComments: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to calculate progress before saving
GoalSchema.pre('save', function () {
  if (this.isModified('achievement') || this.isModified('target') || this.isModified('unitOfMeasurement')) {
    let calculatedProgress = 0;

    switch (this.unitOfMeasurement) {
      case 'Numeric_Min':
      case 'Percentage_Min':
        calculatedProgress = (this.achievement / this.target) * 100;
        break;
      case 'Numeric_Max':
      case 'Percentage_Max':
        calculatedProgress = (this.target / this.achievement) * 100;
        break;
      case 'Timeline':
        // For timeline, we assume achievement is 1 if completed, 0 if not
        calculatedProgress = this.achievement >= this.target ? 100 : 0;
        break;
      case 'Zero':
        calculatedProgress = this.achievement === 0 ? 100 : 0;
        break;
      default:
        calculatedProgress = 0;
    }

    // Cap progress at 100% or allow over-achievement? 
    // Usually capped at 100% for tracking but formula says otherwise. 
    // I'll cap it at 100% for safety unless target is reached.
    this.progress = Math.min(Math.max(calculatedProgress, 0), 100);
  }
});

module.exports = mongoose.model('Goal', GoalSchema);
