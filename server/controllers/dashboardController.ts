import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import { MockTestAttempt } from '../models/MockTest';
import { OpportunityApplication } from '../models/Opportunity';

export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const recentAttempts = await MockTestAttempt.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('test', 'title');

    const applications = await OpportunityApplication.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('opportunity', 'title company');

    res.json({
      success: true,
      data: {
        user,
        recentAttempts,
        applications,
        stats: {
          totalTests: await MockTestAttempt.countDocuments({ user: req.user._id }),
          totalApplications: await OpportunityApplication.countDocuments({ user: req.user._id })
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudyAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, analytics: {} });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUpcomingDeadlines = async (req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, deadlines: [] });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTodayTasks = async (req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, tasks: [] });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPerformanceStats = async (req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, stats: {} });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
