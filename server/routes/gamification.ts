import express from 'express';
import { protect, optionalAuth } from '../middleware/auth';

const router = express.Router();

import {
  getLeaderboard,
  getBadges,
  getMyBadges,
  awardXP,
  redeemCoins,
  getRewards
} from '../controllers/gamificationController';

router.get('/leaderboard', optionalAuth, getLeaderboard);
router.get('/badges', optionalAuth, getBadges);
router.get('/my-badges', protect, getMyBadges);
router.post('/xp', protect, awardXP);
router.post('/redeem', protect, redeemCoins);
router.get('/rewards', optionalAuth, getRewards);

export default router;
