import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import { Badge, UserBadge } from '../models/Badge';

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .select('name profilePicture level xp college')
      .sort({ xp: -1 })
      .limit(100);
    res.json({ success: true, leaderboard: users });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBadges = async (req: Request, res: Response) => {
  try {
    const badges = await Badge.find({ active: true });
    res.json({ success: true, badges });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyBadges = async (req: AuthRequest, res: Response) => {
  try {
    const userBadges = await UserBadge.find({ user: req.user._id })
      .populate('badge');
    res.json({ success: true, badges: userBadges });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const awardXP = async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.xp += amount;
    
    // Level up logic
    const newLevel = Math.floor(user.xp / 100) + 1;
    if (newLevel > user.level) {
      user.level = newLevel;
      user.coins += 50; // Bonus coins for leveling up
    }

    await user.save();
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const redeemCoins = async (req: AuthRequest, res: Response) => {
  try {
    const { item, cost } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.coins < cost) {
      return res.status(400).json({ message: 'Insufficient coins' });
    }

    user.coins -= cost;
    await user.save();

    res.json({ success: true, message: 'Item redeemed successfully', user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRewards = async (req: Request, res: Response) => {
  try {
    const rewards = [
      { id: 1, name: 'Premium Access (1 month)', coins: 500 },
      { id: 2, name: 'Mentor Session (30 min)', coins: 1000 },
      { id: 3, name: 'Resume Review', coins: 750 },
      { id: 4, name: 'Mock Test Pack (5 tests)', coins: 200 }
    ];
    res.json({ success: true, rewards });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
