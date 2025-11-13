import express from 'express';
import { protect, optionalAuth } from '../middleware/auth';

const router = express.Router();

import {
  getCourses,
  getCourseById,
  enrollCourse,
  getMyEnrollments,
  markLessonComplete,
  submitProject,
  rateCourse
} from '../controllers/skillCourseController';

router.get('/', optionalAuth, getCourses);
router.get('/my-enrollments', protect, getMyEnrollments);
router.get('/:id', optionalAuth, getCourseById);
router.post('/:id/enroll', protect, enrollCourse);
router.post('/enrollments/:enrollmentId/lessons/:lessonId/complete', protect, markLessonComplete);
router.post('/enrollments/:enrollmentId/projects/:projectId/submit', protect, submitProject);
router.post('/enrollments/:enrollmentId/rate', protect, rateCourse);

export default router;
