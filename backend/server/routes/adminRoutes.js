const express = require('express');
const {
  getAllEmployees,
  getAllGoals,
  unlockGoal,
  getAuditLogs,
  exportGoalsCSV,
  getAdminStats,
  getAdminTrends,
  getEmployeeAnalytics,
} = require('../controllers/adminController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/employees', getAllEmployees);
router.get('/employees/:id/analytics', getEmployeeAnalytics);
router.get('/goals', getAllGoals);
router.put('/goals/:id/unlock', unlockGoal);
router.get('/audit-logs', getAuditLogs);
router.get('/export-csv', exportGoalsCSV);
router.get('/stats', getAdminStats);
router.get('/trends', getAdminTrends);

module.exports = router;
