import { Request, Response } from 'express';
import User from '../models/User';
import Note from '../models/Note';
import Exam from '../models/Exam';
import ScheduledAnnouncement from '../models/ScheduledAnnouncement';
import ActivityLog from '../models/ActivityLog';
import { sendNotificationToUser, broadcastNotification } from '../socket';
import { io } from '../index';
import csv from 'csv-parser';
import { Readable } from 'stream';
import bcrypt from 'bcryptjs';

interface AuthRequest extends Request {
  user?: any;
}

/**
 * Schedule announcement
 */
export const scheduleAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { title, message, targetAudience, priority, link, scheduledFor } = req.body;

    const scheduledDate = new Date(scheduledFor);
    if (scheduledDate <= new Date()) {
      return res.status(400).json({ message: 'Scheduled time must be in the future' });
    }

    const announcement = await ScheduledAnnouncement.create({
      createdBy: req.user._id,
      title,
      message,
      targetAudience,
      priority,
      link,
      scheduledFor: scheduledDate
    });

    res.json({
      message: 'Announcement scheduled successfully',
      announcement
    });
  } catch (error: any) {
    console.error('Error scheduling announcement:', error);
    res.status(500).json({ message: error.message || 'Error scheduling announcement' });
  }
};

/**
 * Get scheduled announcements
 */
export const getScheduledAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query: any = { createdBy: req.user._id };
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const announcements = await ScheduledAnnouncement.find(query)
      .sort({ scheduledFor: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await ScheduledAnnouncement.countDocuments(query);

    res.json({
      announcements,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Error fetching scheduled announcements:', error);
    res.status(500).json({ message: error.message || 'Error fetching announcements' });
  }
};

/**
 * Cancel scheduled announcement
 */
export const cancelScheduledAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const announcement = await ScheduledAnnouncement.findOneAndUpdate(
      { _id: id, createdBy: req.user._id, status: 'scheduled' },
      { status: 'cancelled' },
      { new: true }
    );

    if (!announcement) {
      return res.status(404).json({ message: 'Scheduled announcement not found or already sent' });
    }

    res.json({ message: 'Announcement cancelled successfully', announcement });
  } catch (error: any) {
    console.error('Error cancelling announcement:', error);
    res.status(500).json({ message: error.message || 'Error cancelling announcement' });
  }
};

/**
 * Process scheduled announcements (called by cron job)
 */
export const processScheduledAnnouncements = async () => {
  try {
    const now = new Date();

    const announcements = await ScheduledAnnouncement.find({
      status: 'scheduled',
      scheduledFor: { $lte: now }
    }).populate('createdBy', 'organizationName');

    for (const announcement of announcements) {
      try {
        let targetUsers: any[] = [];
        const createdBy = announcement.createdBy as any;

        // Determine target users based on audience
        if (announcement.targetAudience === 'all') {
          targetUsers = await User.find({ isActive: true }).select('_id');
        } else if (announcement.targetAudience === 'students') {
          targetUsers = await User.find({ role: 'student', isActive: true }).select('_id');
        } else if (announcement.targetAudience === 'college' && createdBy?.organizationName) {
          targetUsers = await User.find({
            college: createdBy.organizationName,
            isActive: true
          }).select('_id');
        }

        const userIds = targetUsers.map(user => user._id.toString());

        // Send notifications
        if (io && userIds.length > 0) {
          await broadcastNotification(io, userIds, {
            type: announcement.priority === 'high' ? 'warning' : 'info',
            title: announcement.title,
            message: announcement.message,
            link: announcement.link
          });
        }

        // Update announcement status
        announcement.status = 'sent';
        announcement.sentAt = new Date();
        announcement.recipientCount = userIds.length;
        await announcement.save();
      } catch (error: any) {
        announcement.status = 'failed';
        announcement.error = error.message;
        await announcement.save();
      }
    }
  } catch (error) {
    console.error('Error processing scheduled announcements:', error);
  }
};

/**
 * Bulk import users from CSV
 */
export const bulkImportUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'CSV file is required' });
    }

    const results: any[] = [];
    const errors: any[] = [];

    // Parse CSV
    const stream = Readable.from(req.file.buffer.toString());

    stream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        const imported: any[] = [];

        for (const row of results) {
          try {
            // Validate required fields
            if (!row.name || !row.email) {
              errors.push({ row, error: 'Missing required fields (name, email)' });
              continue;
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email: row.email });
            if (existingUser) {
              errors.push({ row, error: 'User with this email already exists' });
              continue;
            }

            // Generate default password or use provided one
            const password = row.password || Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = await User.create({
              name: row.name,
              email: row.email,
              password: hashedPassword,
              role: row.role || 'student',
              college: row.college || req.user.organizationName,
              course: row.course,
              year: row.year ? parseInt(row.year) : undefined,
              phone: row.phone,
              isActive: true
            });

            imported.push({
              email: user.email,
              name: user.name,
              tempPassword: password
            });
          } catch (error: any) {
            errors.push({ row, error: error.message });
          }
        }

        // Log activity
        await ActivityLog.create({
          userId: req.user._id,
          userEmail: req.user.email,
          userName: req.user.name,
          action: 'bulk_import_users',
          resourceType: 'user',
          details: {
            totalRows: results.length,
            imported: imported.length,
            errors: errors.length
          },
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.get('user-agent')
        });

        res.json({
          message: 'Bulk import completed',
          imported,
          errors,
          stats: {
            total: results.length,
            success: imported.length,
            failed: errors.length
          }
        });
      });
  } catch (error: any) {
    console.error('Error importing users:', error);
    res.status(500).json({ message: error.message || 'Error importing users' });
  }
};

/**
 * Advanced analytics with date ranges and filters
 */
export const getAdvancedAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate, college, metric } = req.query;

    const dateFilter: any = {};
    if (startDate) dateFilter.$gte = new Date(startDate as string);
    if (endDate) dateFilter.$lte = new Date(endDate as string);

    const baseQuery: any = {};
    if (req.user.role !== 'super_admin' && req.user.organizationName) {
      baseQuery.college = req.user.organizationName;
    } else if (college) {
      baseQuery.college = college;
    }

    // User metrics
    const userMetrics = await User.aggregate([
      {
        $match: {
          ...baseQuery,
          ...(Object.keys(dateFilter).length && { createdAt: dateFilter })
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          newUsers: { $sum: 1 },
          averageLevel: { $avg: '$level' },
          averageCoins: { $avg: '$coins' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Engagement metrics
    const engagementMetrics = await Note.aggregate([
      {
        $match: {
          ...baseQuery,
          ...(Object.keys(dateFilter).length && { createdAt: dateFilter })
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          uploads: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalDownloads: { $sum: '$downloads' },
          averageRating: { $avg: '$averageRating' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // College-wise distribution
    const collegeDistribution = await User.aggregate([
      {
        $match: {
          ...(req.user.role === 'super_admin' ? {} : baseQuery)
        }
      },
      {
        $group: {
          _id: '$college',
          students: { $sum: 1 },
          averageLevel: { $avg: '$level' }
        }
      },
      { $sort: { students: -1 } },
      { $limit: 10 }
    ]);

    // Subject popularity
    const subjectPopularity = await Note.aggregate([
      {
        $match: {
          ...baseQuery,
          moderationStatus: 'approved'
        }
      },
      {
        $group: {
          _id: '$subject',
          notes: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalDownloads: { $sum: '$downloads' },
          averageRating: { $avg: '$averageRating' }
        }
      },
      { $sort: { notes: -1 } },
      { $limit: 15 }
    ]);

    res.json({
      userMetrics,
      engagementMetrics,
      collegeDistribution,
      subjectPopularity,
      dateRange: {
        start: startDate || 'all-time',
        end: endDate || 'present'
      }
    });
  } catch (error: any) {
    console.error('Error fetching advanced analytics:', error);
    res.status(500).json({ message: error.message || 'Error fetching analytics' });
  }
};

/**
 * Generate downloadable report
 */
export const generateReport = async (req: AuthRequest, res: Response) => {
  try {
    const { type, format = 'json', startDate, endDate } = req.body;

    const dateFilter: any = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    let data: any;

    switch (type) {
      case 'users':
        data = await User.find({
          ...(Object.keys(dateFilter).length && { createdAt: dateFilter })
        }).select('-password');
        break;

      case 'notes':
        data = await Note.find({
          ...(Object.keys(dateFilter).length && { createdAt: dateFilter })
        }).populate('uploadedBy', 'name email');
        break;

      case 'activity':
        data = await ActivityLog.find({
          ...(Object.keys(dateFilter).length && { timestamp: dateFilter })
        });
        break;

      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    // Log activity
    await ActivityLog.create({
      userId: req.user._id,
      userEmail: req.user.email,
      userName: req.user.name,
      action: 'generate_report',
      resourceType: 'system',
      details: { type, format, recordCount: data.length },
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent')
    });

    if (format === 'csv') {
      // Convert to CSV
      if (data.length === 0) {
        return res.status(404).json({ message: 'No data to export' });
      }

      const headers = Object.keys(data[0].toObject ? data[0].toObject() : data[0]).join(',');
      const rows = data.map((item: any) =>
        Object.values(item.toObject ? item.toObject() : item)
          .map(val => JSON.stringify(val))
          .join(',')
      );
      const csv = [headers, ...rows].join('\n');

      res.header('Content-Type', 'text/csv');
      res.header('Content-Disposition', `attachment; filename=${type}-report-${Date.now()}.csv`);
      return res.send(csv);
    }

    res.json({
      reportType: type,
      generatedAt: new Date(),
      recordCount: data.length,
      data
    });
  } catch (error: any) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: error.message || 'Error generating report' });
  }
};
