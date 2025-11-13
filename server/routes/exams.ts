import express from 'express';
import { protect, optionalAuth } from '../middleware/auth';

const router = express.Router();

import {
  getExams,
  getExamById,
  getExamsByCategory,
  targetExam,
  getMyTargetExams,
  updateSyllabusProgress
} from '../controllers/examController';

router.get('/', optionalAuth, getExams);
router.get('/category/:category', optionalAuth, getExamsByCategory);
router.get('/my-targets', protect, getMyTargetExams);
router.get('/:id', optionalAuth, getExamById);
router.post('/:id/target', protect, targetExam);
router.put('/:id/syllabus-progress', protect, updateSyllabusProgress);

export default router;
