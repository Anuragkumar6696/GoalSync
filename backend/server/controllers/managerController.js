const Goal = require('../models/Goal');
const User = require('../models/User');
const CheckIn = require('../models/CheckIn');
const { ErrorResponse } = require('../middleware/errorMiddleware');
const { logAction } = require('../services/auditService');

// @desc    Get manager dashboard stats
// @route   GET /api/v1/manager/stats
// @access  Private (Manager)
exports.getManagerStats = async (req, res, next) => {
  try {
    const teamMembers = await User.find({ manager: req.user.id });
    const teamIds = teamMembers.map(member => member._id);

    const goals = await Goal.find({ employee: { $in: teamIds } });

    const totalTeam = teamMembers.length;
    const pendingApprovals = goals.filter(g => !g.approved).length;
    
    // Calculate team average progress
    const teamAvgProgress = goals.length > 0 
      ? Math.round(goals.reduce((acc, g) => acc + (g.progress || 0), 0) / goals.length)
      : 0;

    // Check-ins count for the manager's team
    const completedCheckins = await CheckIn.countDocuments({ manager: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        totalTeam,
        pendingApprovals,
        completedCheckins,
        teamAvgProgress
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get pending goals for approval
// @route   GET /api/v1/manager/pending-goals
// @access  Private (Manager)
exports.getPendingGoals = async (req, res, next) => {
  try {
    const teamMembers = await User.find({ manager: req.user.id });
    const teamIds = teamMembers.map(member => member._id);

    const goals = await Goal.find({ 
      employee: { $in: teamIds },
      isSubmitted: true,
      approved: false 
    }).populate('employee', 'name email manager');

    res.status(200).json({
      success: true,
      data: goals
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get team goals with summary per employee
// @route   GET /api/v1/manager/team-goals
// @access  Private (Manager)
exports.getTeamGoals = async (req, res, next) => {
  try {
    const teamMembers = await User.find({ manager: req.user.id });
    
    const teamWithStats = await Promise.all(teamMembers.map(async (member) => {
      const goals = await Goal.find({ employee: member._id });
      const goalsCount = goals.length;
      const averageProgress = goalsCount > 0 
        ? Math.round(goals.reduce((acc, g) => acc + (g.progress || 0), 0) / goalsCount)
        : 0;
      
      return {
        _id: member._id,
        name: member.name,
        email: member.email,
        goalsCount,
        averageProgress,
        goals // optional: include actual goals if needed
      };
    }));

    res.status(200).json({
      success: true,
      data: teamWithStats
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve goal
// @route   PUT /api/v1/manager/goals/:id/approve
// @access  Private (Manager)
exports.approveGoal = async (req, res, next) => {
  try {
    let goal = await Goal.findById(req.params.id).populate('employee');

    if (!goal) {
      return next(new ErrorResponse(`Goal not found with id of ${req.params.id}`, 404));
    }

    // Check if manager is correct
    if (!goal.employee || !goal.employee.manager || goal.employee.manager.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to approve this goal', 401));
    }

    const oldGoal = goal.toObject();

    goal.approved = true;
    goal.locked = true; // Once approved, goals become locked
    goal.isSubmitted = false; // Reset submitted status after approval
    goal.managerComments = undefined; // Clear previous rejection comments
    await goal.save();

    await logAction(req.user.id, 'APPROVE', 'Goal', goal._id, oldGoal, goal);

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reject goal
// @route   PUT /api/v1/manager/goals/:id/reject
// @access  Private (Manager)
exports.rejectGoal = async (req, res, next) => {
  try {
    let goal = await Goal.findById(req.params.id).populate('employee');

    if (!goal) {
      return next(new ErrorResponse(`Goal not found with id of ${req.params.id}`, 404));
    }

    // Check if manager is correct
    if (!goal.employee || !goal.employee.manager || goal.employee.manager.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to reject this goal', 401));
    }

    const oldGoal = goal.toObject();

    goal.approved = false;
    goal.locked = false;
    goal.isSubmitted = false; // Reset submitted status on rejection
    
    if (req.body.managerComments) {
      goal.managerComments = req.body.managerComments;
    }

    await goal.save();

    await logAction(req.user.id, 'REJECT', 'Goal', goal._id, oldGoal, goal);

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update goal (inline edit target/weightage)
// @route   PUT /api/v1/manager/goals/:id
// @access  Private (Manager)
exports.updateGoalInline = async (req, res, next) => {
  try {
    let goal = await Goal.findById(req.params.id).populate('employee');

    if (!goal) {
      return next(new ErrorResponse(`Goal not found with id of ${req.params.id}`, 404));
    }

    // Check if manager is correct
    if (goal.employee.manager.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to update this goal', 401));
    }

    const oldGoal = goal.toObject();

    // Manager can only update target and weightage inline as per requirements
    const { target, weightage } = req.body;
    if (target) goal.target = target;
    if (weightage) goal.weightage = weightage;

    await goal.save();

    if (oldGoal.locked) {
        await logAction(req.user.id, 'MANAGER_UPDATE', 'Goal', goal._id, oldGoal, goal);
    }

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add check-in comment
// @route   POST /api/v1/manager/goals/:id/checkin
// @access  Private (Manager)
exports.addCheckIn = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id).populate('employee');

    if (!goal) {
      return next(new ErrorResponse(`Goal not found with id of ${req.params.id}`, 404));
    }

    // Check if manager is correct
    if (goal.employee.manager.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to add check-in for this goal', 401));
    }

    const checkIn = await CheckIn.create({
      goal: req.params.id,
      manager: req.user.id,
      comment: req.body.comment,
      quarter: goal.quarter,
    });

    await logAction(req.user.id, 'ADD_CHECKIN', 'CheckIn', checkIn._id, null, checkIn);

    res.status(201).json({
      success: true,
      data: checkIn,
    });
  } catch (err) {
    next(err);
  }
};
