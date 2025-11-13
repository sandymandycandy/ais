import express from 'express';
import { protect, optionalAuth } from '../middleware/auth';

const router = express.Router();

import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  addTeamMember,
  removeTeamMember,
  createTask,
  updateTask,
  addMilestone,
  likeProject,
  getMyProjects
} from '../controllers/projectController';

router.post('/', protect, createProject);
router.get('/', optionalAuth, getProjects);
router.get('/my-projects', protect, getMyProjects);
router.get('/:id', optionalAuth, getProjectById);
router.put('/:id', protect, updateProject);
router.post('/:id/team', protect, addTeamMember);
router.delete('/:id/team/:userId', protect, removeTeamMember);
router.post('/:id/tasks', protect, createTask);
router.put('/:id/tasks/:taskId', protect, updateTask);
router.post('/:id/milestones', protect, addMilestone);
router.post('/:id/like', protect, likeProject);

export default router;
