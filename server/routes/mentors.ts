import express from 'express';
import { protect, optionalAuth } from '../middleware/auth';
import multer from 'multer';

const upload = multer({ dest: 'uploads/mentor-docs/' });

const router = express.Router();

import {
  applyAsMentor,
  getMentors,
  getMentorById,
  bookSession,
  getMySessions,
  rateSession,
  updateMentorProfile,
  getMentorAvailability
} from '../controllers/mentorController';

router.post('/apply', protect, upload.array('documents'), applyAsMentor);
router.get('/', optionalAuth, getMentors);
router.get('/:id', optionalAuth, getMentorById);
router.get('/:id/availability', optionalAuth, getMentorAvailability);
router.post('/:id/book-session', protect, bookSession);
router.get('/sessions/my-sessions', protect, getMySessions);
router.post('/sessions/:sessionId/rate', protect, rateSession);
router.put('/profile', protect, updateMentorProfile);

export default router;
