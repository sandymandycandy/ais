import express from 'express';
import { protect } from '../middleware/auth';
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  addSkill,
  endorseSkill,
  addAchievement,
  addCertification,
  uploadResume,
  getPublicProfile
} from '../controllers/userController';
import multer from 'multer';

const upload = multer({ dest: 'uploads/avatars/' });
const resumeUpload = multer({ dest: 'uploads/resumes/' });

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.post('/skills', protect, addSkill);
router.post('/skills/:skillId/endorse', protect, endorseSkill);
router.post('/achievements', protect, addAchievement);
router.post('/certifications', protect, addCertification);
router.post('/resume', protect, resumeUpload.single('resume'), uploadResume);
router.get('/:userId/public', getPublicProfile);

export default router;
