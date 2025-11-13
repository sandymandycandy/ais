import express from 'express';
import {
  register,
  login,
  getMe,
  updatePassword,
  forgotPassword,
  resetPassword
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

export default router;
