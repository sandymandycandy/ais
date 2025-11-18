import express from 'express';
import { protect } from '../middleware/auth';

const router = express.Router();

import {
  getDashboardData,
  getStudyAnalytics,
  getUpcomingDeadlines,
  getTodayTasks,
  getPerformanceStats,
  getCollegeDashboard,
  getOfficeDashboard
} from '../controllers/dashboardController';

router.get('/', protect, getDashboardData);
router.get('/analytics', protect, getStudyAnalytics);
router.get('/deadlines', protect, getUpcomingDeadlines);
router.get('/tasks', protect, getTodayTasks);
router.get('/performance', protect, getPerformanceStats);
router.get('/college', protect, getCollegeDashboard);
router.get('/office', protect, getOfficeDashboard);

export default router;
