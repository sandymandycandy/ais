import express from 'express';
import { protect, optionalAuth } from '../middleware/auth';

const router = express.Router();

import {
  createStudyCircle,
  getStudyCircles,
  getStudyCircleById,
  joinCircle,
  leaveCircle,
  createPost,
  getPosts,
  createComment,
  votePost,
  deletePost,
  pinPost
} from '../controllers/studyCircleController';

router.post('/', protect, createStudyCircle);
router.get('/', optionalAuth, getStudyCircles);
router.get('/:id', optionalAuth, getStudyCircleById);
router.post('/:id/join', protect, joinCircle);
router.post('/:id/leave', protect, leaveCircle);
router.post('/:id/posts', protect, createPost);
router.get('/:id/posts', optionalAuth, getPosts);
router.post('/posts/:postId/comments', protect, createComment);
router.post('/posts/:postId/vote', protect, votePost);
router.delete('/posts/:postId', protect, deletePost);
router.put('/posts/:postId/pin', protect, pinPost);

export default router;
