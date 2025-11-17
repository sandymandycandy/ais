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
import {
  getPendingContent,
  approveContent,
  rejectContent,
  getModerationStats,
  getActivityLogs
} from '../controllers/moderationController';
import {
  scheduleAnnouncement,
  getScheduledAnnouncements,
  cancelScheduledAnnouncement,
  bulkImportUsers,
  getAdvancedAnalytics,
  generateReport
} from '../controllers/advancedAdminController';
import { uploadSingle } from '../middleware/upload';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

// Dashboard analytics
router.get('/analytics', hasPermission(PERMISSIONS.VIEW_ANALYTICS), getDashboardAnalytics);
router.get('/analytics/content', hasPermission(PERMISSIONS.VIEW_ANALYTICS), getContentStatistics);
router.get('/analytics/advanced', hasPermission(PERMISSIONS.VIEW_ANALYTICS), getAdvancedAnalytics);

// User management
router.get('/users', hasPermission(PERMISSIONS.VIEW_USERS), getUsers);
router.patch('/users/:userId', hasPermission(PERMISSIONS.EDIT_USER), updateUserStatus);
router.post('/users/bulk', hasPermission(PERMISSIONS.EDIT_USER), bulkUserOperation);
router.post('/users/import', uploadSingle, hasPermission(PERMISSIONS.CREATE_USER), bulkImportUsers);

// Announcements
router.post('/announcements', hasPermission(PERMISSIONS.CREATE_ANNOUNCEMENT), createAnnouncement);
router.post('/announcements/schedule', hasPermission(PERMISSIONS.CREATE_ANNOUNCEMENT), scheduleAnnouncement);
router.get('/announcements/scheduled', hasPermission(PERMISSIONS.CREATE_ANNOUNCEMENT), getScheduledAnnouncements);
router.delete('/announcements/scheduled/:id', hasPermission(PERMISSIONS.CREATE_ANNOUNCEMENT), cancelScheduledAnnouncement);

// Content Moderation
router.get('/moderation/pending', hasPermission(PERMISSIONS.APPROVE_NOTE), getPendingContent);
router.get('/moderation/stats', hasPermission(PERMISSIONS.APPROVE_NOTE), getModerationStats);
router.post('/moderation/:contentType/:contentId/approve', hasPermission(PERMISSIONS.APPROVE_NOTE), approveContent);
router.post('/moderation/:contentType/:contentId/reject', hasPermission(PERMISSIONS.APPROVE_NOTE), rejectContent);

// Activity Logs
router.get('/logs', hasPermission(PERMISSIONS.VIEW_LOGS), getActivityLogs);

// Data export & reports
router.post('/export', hasPermission(PERMISSIONS.EXPORT_DATA), exportData);
router.post('/reports/generate', hasPermission(PERMISSIONS.EXPORT_DATA), generateReport);

export default router;
