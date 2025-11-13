import express from 'express';
import { protect, optionalAuth } from '../middleware/auth';

const router = express.Router();

import {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  applyToOpportunity,
  getMyApplications,
  updateApplicationStatus,
  bookmarkOpportunity,
  getMyBookmarks
} from '../controllers/opportunityController';

router.post('/', protect, createOpportunity);
router.get('/', optionalAuth, getOpportunities);
router.get('/my-applications', protect, getMyApplications);
router.get('/my-bookmarks', protect, getMyBookmarks);
router.get('/:id', optionalAuth, getOpportunityById);
router.post('/:id/apply', protect, applyToOpportunity);
router.put('/applications/:applicationId', protect, updateApplicationStatus);
router.post('/:id/bookmark', protect, bookmarkOpportunity);

export default router;
