import express from 'express';
import { protect } from '../middleware/auth';
import {
  isAdmin,
  isSuperAdmin,
  hasPermission,
  PERMISSIONS
} from '../middleware/adminAuth';
import {
  getDashboardAnalytics,
  getUsers,
  updateUserStatus,
  createAnnouncement,
  getContentStatistics,
  bulkUserOperation,
  exportData
} from '../controllers/adminController';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

// Dashboard analytics
router.get('/analytics', hasPermission(PERMISSIONS.VIEW_ANALYTICS), getDashboardAnalytics);
router.get('/analytics/content', hasPermission(PERMISSIONS.VIEW_ANALYTICS), getContentStatistics);

// User management
router.get('/users', hasPermission(PERMISSIONS.VIEW_USERS), getUsers);
router.patch('/users/:userId', hasPermission(PERMISSIONS.EDIT_USER), updateUserStatus);
router.post('/users/bulk', hasPermission(PERMISSIONS.EDIT_USER), bulkUserOperation);

// Announcements
router.post('/announcements', hasPermission(PERMISSIONS.CREATE_ANNOUNCEMENT), createAnnouncement);

// Data export
router.post('/export', hasPermission(PERMISSIONS.EXPORT_DATA), exportData);

export default router;
