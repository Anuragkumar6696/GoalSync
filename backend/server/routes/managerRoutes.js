const express = require('express');
const {
  getTeamGoals,
  getManagerStats,
  getPendingGoals,
  approveGoal,
  rejectGoal,
  updateGoalInline,
  addCheckIn,
} = require('../controllers/managerController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');
const {
  validate,
  checkInSchema,
} = require('../middleware/validationMiddleware');

router.use(protect);
router.use(authorize('manager'));

router.get('/stats', getManagerStats);
router.get('/pending-goals', getPendingGoals);
router.get('/team-goals', getTeamGoals);
router.put('/goals/:id/approve', approveGoal);
router.put('/goals/:id/reject', rejectGoal);
router.put('/goals/:id', updateGoalInline);
router.post('/goals/:id/checkin', validate(checkInSchema), addCheckIn);

module.exports = router;
