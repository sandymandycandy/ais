import express from 'express';
import { protect, optionalAuth } from '../middleware/auth';

const router = express.Router();

import {
  createMockTest,
  getMockTests,
  getMockTestById,
  startTest,
  submitAnswer,
  submitTest,
  getTestResults,
  getMyAttempts,
  getLeaderboard
} from '../controllers/mockTestController';

router.post('/', protect, createMockTest);
router.get('/', optionalAuth, getMockTests);
router.get('/my-attempts', protect, getMyAttempts);
router.get('/:id', optionalAuth, getMockTestById);
router.get('/:id/leaderboard', optionalAuth, getLeaderboard);
router.post('/:id/start', protect, startTest);
router.post('/:id/submit-answer', protect, submitAnswer);
router.post('/:id/submit', protect, submitTest);
router.get('/attempts/:attemptId/results', protect, getTestResults);

export default router;
