const express = require('express');
const {
  createGoals,
  updateGoal,
  submitGoals,
  quarterlyUpdate,
  getOwnGoals,
  deleteGoal,
} = require('../controllers/employeeController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');
const {
  validate,
  goalsListSchema,
  updateGoalSchema,
  quarterlyUpdateSchema,
} = require('../middleware/validationMiddleware');

router.use(protect);
router.use(authorize('employee'));

router.route('/goals')
  .get(getOwnGoals)
  .post(validate(goalsListSchema), createGoals);

router.route('/goals/:id')
  .put(validate(updateGoalSchema), updateGoal)
  .delete(deleteGoal);

router.post('/submit-goals', submitGoals);

router.put('/goals/:id/quarterly', validate(quarterlyUpdateSchema), quarterlyUpdate);

module.exports = router;
