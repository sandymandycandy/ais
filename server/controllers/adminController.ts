import { Request, Response } from 'express';
import User from '../models/User';
import Note from '../models/Note';
import Exam from '../models/Exam';
import Opportunity from '../models/Opportunity';
import Notification from '../models/Notification';
import { sendNotificationToUser, broadcastNotification } from '../socket';
import { io } from '../index';

interface AuthRequest extends Request {
  user?: any;
}

/**
 * Get admin dashboard analytics
 */
export const getDashboardAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const role = req.user.role;
    const organizationName = req.user.organizationName;

    // Total counts
    const totalUsers = await User.countDocuments(
      role === 'super_admin' ? {} : { college: organizationName }
    );

    const totalNotes = await Note.countDocuments(
      role === 'super_admin' ? {} : { college: organizationName }
    );

    const totalExams = await Exam.countDocuments(
      role === 'super_admin' ? {} : { college: organizationName }
    );

    const totalOpportunities = await Opportunity.countDocuments();

    // Recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      ...(role !== 'super_admin' && { college: organizationName })
    });

    // Active users (active in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activeUsers = await User.countDocuments({
      lastActive: { $gte: sevenDaysAgo },
      ...(role !== 'super_admin' && { college: organizationName })
    });

    // Content stats by category
    const notesBySubject = await Note.aggregate([
      ...(role !== 'super_admin' ? [{ $match: { college: organizationName } }] : []),
      { $group: { _id: '$subject', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // User growth (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          ...(role !== 'super_admin' && { college: organizationName })
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top contributors
    const topContributors = await Note.aggregate([
      ...(role !== 'super_admin' ? [{ $match: { college: organizationName } }] : []),
      { $group: { _id: '$uploadedBy', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          profilePicture: '$user.profilePicture',
          count: 1
        }
      }
    ]);

    res.json({
      overview: {
        totalUsers,
        totalNotes,
        totalExams,
        totalOpportunities,
        newUsers,
        activeUsers
      },
      notesBySubject,
      userGrowth,
      topContributors
    });
  } catch (error: any) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({ message: error.message || 'Error fetching analytics' });
  }
};

/**
 * Get all users with filtering and pagination
 */
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      college,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query: any = {};

    // Filter by organization for non-super-admins
    if (req.user.role !== 'super_admin' && req.user.organizationName) {
      query.college = req.user.organizationName;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) query.role = role;
    if (college) query.college = college;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const skip = (Number(page) - 1) * Number(limit);
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message || 'Error fetching users' });
  }
};

/**
 * Update user status
 */
export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { isActive, role, permissions } = req.body;

    const updateData: any = {};
    if (isActive !== undefined) updateData.isActive = isActive;
    if (role) updateData.role = role;
    if (permissions) updateData.permissions = permissions;

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send notification to user
    if (io) {
      await sendNotificationToUser(io, userId, {
        type: 'info',
        title: 'Account Updated',
        message: `Your account status has been updated by an administrator.`
      });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error: any) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: error.message || 'Error updating user' });
  }
};

/**
 * Create announcement
 */
export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { title, message, targetAudience, priority, link } = req.body;

    let targetUsers: any[] = [];

    // Determine target users based on audience
    if (targetAudience === 'all') {
      targetUsers = await User.find({ isActive: true }).select('_id');
    } else if (targetAudience === 'students') {
      targetUsers = await User.find({ role: 'student', isActive: true }).select('_id');
    } else if (targetAudience === 'college') {
      targetUsers = await User.find({
        college: req.user.organizationName,
        isActive: true
      }).select('_id');
    }

    const userIds = targetUsers.map(user => user._id.toString());

    // Create notifications for all target users
    if (io) {
      await broadcastNotification(io, userIds, {
        type: priority === 'high' ? 'warning' : 'info',
        title,
        message,
        link
      });
    }

    res.json({
      message: 'Announcement sent successfully',
      recipientCount: userIds.length
    });
  } catch (error: any) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ message: error.message || 'Error creating announcement' });
  }
};

/**
 * Get content statistics
 */
export const getContentStatistics = async (req: AuthRequest, res: Response) => {
  try {
    const role = req.user.role;
    const organizationName = req.user.organizationName;

    // Notes statistics
    const notesStats = await Note.aggregate([
      ...(role !== 'super_admin' ? [{ $match: { college: organizationName } }] : []),
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          totalDownloads: { $sum: '$downloads' },
          totalViews: { $sum: '$views' },
          avgRating: { $avg: '$rating' }
        }
      }
    ]);

    // Exams statistics
    const examsStats = await Exam.aggregate([
      ...(role !== 'super_admin' ? [{ $match: { college: organizationName } }] : []),
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          totalAttempts: { $sum: { $size: '$attempts' } }
        }
      }
    ]);

    // Opportunities statistics
    const opportunitiesStats = await Opportunity.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      notes: notesStats[0] || { total: 0, totalDownloads: 0, totalViews: 0, avgRating: 0 },
      exams: examsStats[0] || { total: 0, totalAttempts: 0 },
      opportunities: opportunitiesStats
    });
  } catch (error: any) {
    console.error('Error fetching content statistics:', error);
    res.status(500).json({ message: error.message || 'Error fetching statistics' });
  }
};

/**
 * Bulk user operations
 */
export const bulkUserOperation = async (req: AuthRequest, res: Response) => {
  try {
    const { userIds, operation, data } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'User IDs are required' });
    }

    let result;

    switch (operation) {
      case 'activate':
        result = await User.updateMany(
          { _id: { $in: userIds } },
          { $set: { isActive: true } }
        );
        break;

      case 'deactivate':
        result = await User.updateMany(
          { _id: { $in: userIds } },
          { $set: { isActive: false } }
        );
        break;

      case 'updatePermissions':
        if (!data?.permissions) {
          return res.status(400).json({ message: 'Permissions are required' });
        }
        result = await User.updateMany(
          { _id: { $in: userIds } },
          { $set: { permissions: data.permissions } }
        );
        break;

      case 'delete':
        result = await User.deleteMany({ _id: { $in: userIds } });
        break;

      default:
        return res.status(400).json({ message: 'Invalid operation' });
    }

    res.json({
      message: 'Bulk operation completed successfully',
      modifiedCount: result.modifiedCount || result.deletedCount
    });
  } catch (error: any) {
    console.error('Error performing bulk operation:', error);
    res.status(500).json({ message: error.message || 'Error performing bulk operation' });
  }
};

/**
 * Export data
 */
export const exportData = async (req: AuthRequest, res: Response) => {
  try {
    const { type, format = 'json', filters = {} } = req.body;

    let data: any[] = [];

    switch (type) {
      case 'users':
        data = await User.find(filters).select('-password').lean();
        break;

      case 'notes':
        data = await Note.find(filters).populate('uploadedBy', 'name email').lean();
        break;

      case 'exams':
        data = await Exam.find(filters).lean();
        break;

      case 'opportunities':
        data = await Opportunity.find(filters).lean();
        break;

      default:
        return res.status(400).json({ message: 'Invalid export type' });
    }

    if (format === 'csv') {
      // Convert to CSV (simplified)
      if (data.length === 0) {
        return res.status(404).json({ message: 'No data to export' });
      }

      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(item =>
        Object.values(item).map(val => JSON.stringify(val)).join(',')
      );
      const csv = [headers, ...rows].join('\n');

      res.header('Content-Type', 'text/csv');
      res.header('Content-Disposition', `attachment; filename=${type}-export.csv`);
      return res.send(csv);
    }

    // Default JSON export
    res.json({ data, count: data.length });
  } catch (error: any) {
    console.error('Error exporting data:', error);
    res.status(500).json({ message: error.message || 'Error exporting data' });
  }
};
