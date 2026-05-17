const Goal = require('../models/Goal');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { ErrorResponse } = require('../middleware/errorMiddleware');
const { logAction } = require('../services/auditService');
const { exportToCSV } = require('../utils/csvExport');
const path = require('path');

// @desc    Get all employees
// @route   GET /api/v1/admin/employees
// @access  Private (Admin)
exports.getAllEmployees = async (req, res, next) => {
  try {
    const employees = await User.find({ role: 'employee' }).populate('manager', 'name email');

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all goals
// @route   GET /api/v1/admin/goals
// @access  Private (Admin)
exports.getAllGoals = async (req, res, next) => {
  try {
    // Advanced filtering, sorting, pagination
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Goal.find(JSON.parse(queryStr)).populate('employee', 'name email');

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Goal.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const results = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: results.length,
      pagination,
      data: results,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Unlock goal
// @route   PUT /api/v1/admin/goals/:id/unlock
// @access  Private (Admin)
exports.unlockGoal = async (req, res, next) => {
  try {
    let goal = await Goal.findById(req.params.id);

    if (!goal) {
      return next(new ErrorResponse(`Goal not found with id of ${req.params.id}`, 404));
    }

    const oldGoal = goal.toObject();

    goal.locked = false;
    await goal.save();

    await logAction(req.user.id, 'UNLOCK', 'Goal', goal._id, oldGoal, goal);

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get audit logs
// @route   GET /api/v1/admin/audit-logs
// @access  Private (Admin)
exports.getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find()
      .populate('user', 'name email role')
      .sort('-timestamp');

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Export goals to CSV
// @route   GET /api/v1/admin/export-csv
// @access  Private (Admin)
exports.exportGoalsCSV = async (req, res, next) => {
  try {
    const goals = await Goal.find().populate('employee', 'name email');

    const csvData = goals.map(goal => ({
      employeeName: goal.employee?.name || 'Unknown',
      employeeEmail: goal.employee?.email || 'N/A',
      thrustArea: goal.thrustArea,
      goalTitle: goal.goalTitle,
      unitOfMeasurement: goal.unitOfMeasurement,
      target: goal.target,
      achievement: goal.achievement,
      progress: `${goal.progress || 0}%`,
      weightage: `${goal.weightage || 0}%`,
      status: goal.status,
      quarter: goal.quarter,
      approved: goal.approved ? 'Yes' : 'No',
      locked: goal.locked ? 'Yes' : 'No',
    }));

    const header = [
      { id: 'employeeName', title: 'Employee Name' },
      { id: 'employeeEmail', title: 'Employee Email' },
      { id: 'thrustArea', title: 'Thrust Area' },
      { id: 'goalTitle', title: 'Goal Title' },
      { id: 'unitOfMeasurement', title: 'UOM' },
      { id: 'target', title: 'Target' },
      { id: 'achievement', title: 'Achievement' },
      { id: 'progress', title: 'Progress' },
      { id: 'weightage', title: 'Weightage' },
      { id: 'status', title: 'Status' },
      { id: 'quarter', title: 'Quarter' },
      { id: 'approved', title: 'Approved' },
      { id: 'locked', title: 'Locked' },
    ];

    const fileName = `goals-report-${Date.now()}.csv`;
    const filePath = await exportToCSV(csvData, fileName, header);

    res.download(filePath);
  } catch (err) {
    next(err);
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/v1/admin/stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'employee' });
    const totalGoals = await Goal.countDocuments();
    const approvedGoals = await Goal.countDocuments({ approved: true });
    const activeManagers = await User.countDocuments({ role: 'manager' });
    
    // Average progress across all goals
    const goals = await Goal.find();
    const completionRate = goals.length > 0 
      ? Math.round(goals.reduce((acc, g) => acc + (g.progress || 0), 0) / goals.length)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalGoals,
        approvedGoals,
        completionRate,
        activeManagers
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get goal trends for chart
// @route   GET /api/v1/admin/trends
// @access  Private (Admin)
exports.getAdminTrends = async (req, res, next) => {
  try {
    // Return dummy trends data for the chart for now
    const trends = [
      { month: 'Jan', target: 80, achieved: 65 },
      { month: 'Feb', target: 85, achieved: 70 },
      { month: 'Mar', target: 90, achieved: 85 },
      { month: 'Apr', target: 95, achieved: 88 },
      { month: 'May', target: 100, achieved: 92 }
    ];

    res.status(200).json({
      success: true,
      data: trends
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get detailed analytics for a specific employee
// @route   GET /api/v1/admin/employees/:id/analytics
// @access  Private (Admin)
exports.getEmployeeAnalytics = async (req, res, next) => {
  try {
    const employee = await User.findById(req.params.id).populate('manager', 'name email');
    if (!employee) {
      return next(new ErrorResponse('Employee not found', 404));
    }

    const goals = await Goal.find({ employee: req.params.id });
    const goalsCount = goals.length;
    const averageProgress = goalsCount > 0 
      ? Math.round(goals.reduce((acc, g) => acc + (g.progress || 0), 0) / goalsCount)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        goalsCount,
        averageProgress,
        goals
      }
    });
  } catch (err) {
    next(err);
  }
};
