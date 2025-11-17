import { Request, Response } from 'express';
import Note from '../models/Note';
import Exam from '../models/Exam';
import { Opportunity } from '../models/Opportunity';
import ActivityLog from '../models/ActivityLog';
import { sendNotificationToUser } from '../socket';
import { io } from '../index';

interface AuthRequest extends Request {
  user?: any;
}

/**
 * Log admin activity
 */
const logActivity = async (
  userId: string,
  userEmail: string,
  userName: string,
  action: string,
  resourceType: string,
  resourceId: string,
  details: any,
  req: Request
) => {
  try {
    await ActivityLog.create({
      userId,
      userEmail,
      userName,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent')
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

/**
 * Get pending content for moderation
 */
export const getPendingContent = async (req: AuthRequest, res: Response) => {
  try {
    const { type = 'note', page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    let Model;
    switch (type) {
      case 'note':
        Model = Note;
        break;
      case 'exam':
        Model = Exam;
        break;
      case 'opportunity':
        Model = Opportunity;
        break;
      default:
        return res.status(400).json({ message: 'Invalid content type' });
    }

    const query: any = { moderationStatus: 'pending' };

    // Filter by organization for non-super-admins
    if (req.user.role !== 'super_admin' && req.user.organizationName) {
      query.college = req.user.organizationName;
    }

    const content = await Model.find(query)
      .populate('uploadedBy', 'name email profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Model.countDocuments(query);

    res.json({
      content,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Error fetching pending content:', error);
    res.status(500).json({ message: error.message || 'Error fetching content' });
  }
};

/**
 * Approve content
 */
export const approveContent = async (req: AuthRequest, res: Response) => {
  try {
    const { contentType, contentId } = req.params;
    const { note } = req.body;

    let Model;
    let resourceType;
    switch (contentType) {
      case 'note':
        Model = Note;
        resourceType = 'note';
        break;
      case 'exam':
        Model = Exam;
        resourceType = 'exam';
        break;
      case 'opportunity':
        Model = Opportunity;
        resourceType = 'opportunity';
        break;
      default:
        return res.status(400).json({ message: 'Invalid content type' });
    }

    const content: any = await Model.findByIdAndUpdate(
      contentId,
      {
        moderationStatus: 'approved',
        moderatedBy: req.user._id,
        moderatedAt: new Date(),
        moderationNote: note
      },
      { new: true }
    ).populate('uploadedBy', 'name email');

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Log activity
    await logActivity(
      req.user._id,
      req.user.email,
      req.user.name,
      'approve_content',
      resourceType,
      contentId,
      { contentTitle: content.title, note },
      req
    );

    // Notify content creator
    if (io && content.uploadedBy) {
      await sendNotificationToUser(io, content.uploadedBy._id.toString(), {
        type: 'success',
        title: 'Content Approved',
        message: `Your ${contentType} "${content.title}" has been approved!`,
        link: `/${contentType}s/${contentId}`
      });
    }

    res.json({
      message: 'Content approved successfully',
      content
    });
  } catch (error: any) {
    console.error('Error approving content:', error);
    res.status(500).json({ message: error.message || 'Error approving content' });
  }
};

/**
 * Reject content
 */
export const rejectContent = async (req: AuthRequest, res: Response) => {
  try {
    const { contentType, contentId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    let Model;
    let resourceType;
    switch (contentType) {
      case 'note':
        Model = Note;
        resourceType = 'note';
        break;
      case 'exam':
        Model = Exam;
        resourceType = 'exam';
        break;
      case 'opportunity':
        Model = Opportunity;
        resourceType = 'opportunity';
        break;
      default:
        return res.status(400).json({ message: 'Invalid content type' });
    }

    const content: any = await Model.findByIdAndUpdate(
      contentId,
      {
        moderationStatus: 'rejected',
        moderatedBy: req.user._id,
        moderatedAt: new Date(),
        moderationNote: reason
      },
      { new: true }
    ).populate('uploadedBy', 'name email');

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Log activity
    await logActivity(
      req.user._id,
      req.user.email,
      req.user.name,
      'reject_content',
      resourceType,
      contentId,
      { contentTitle: content.title, reason },
      req
    );

    // Notify content creator
    if (io && content.uploadedBy) {
      await sendNotificationToUser(io, content.uploadedBy._id.toString(), {
        type: 'warning',
        title: 'Content Rejected',
        message: `Your ${contentType} "${content.title}" was not approved. Reason: ${reason}`,
        link: `/${contentType}s/${contentId}`
      });
    }

    res.json({
      message: 'Content rejected successfully',
      content
    });
  } catch (error: any) {
    console.error('Error rejecting content:', error);
    res.status(500).json({ message: error.message || 'Error rejecting content' });
  }
};

/**
 * Get moderation statistics
 */
export const getModerationStats = async (req: AuthRequest, res: Response) => {
  try {
    const query: any = {};

    // Filter by organization for non-super-admins
    if (req.user.role !== 'super_admin' && req.user.organizationName) {
      query.college = req.user.organizationName;
    }

    const stats = await Promise.all([
      Note.countDocuments({ ...query, moderationStatus: 'pending' }),
      Note.countDocuments({ ...query, moderationStatus: 'approved' }),
      Note.countDocuments({ ...query, moderationStatus: 'rejected' }),
      Exam.countDocuments({ ...query, moderationStatus: 'pending' }),
      Opportunity.countDocuments({ moderationStatus: 'pending' })
    ]);

    res.json({
      notes: {
        pending: stats[0],
        approved: stats[1],
        rejected: stats[2]
      },
      exams: {
        pending: stats[3]
      },
      opportunities: {
        pending: stats[4]
      },
      totalPending: stats[0] + stats[3] + stats[4]
    });
  } catch (error: any) {
    console.error('Error fetching moderation stats:', error);
    res.status(500).json({ message: error.message || 'Error fetching stats' });
  }
};

/**
 * Get activity logs
 */
export const getActivityLogs = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 50,
      action,
      resourceType,
      userId,
      startDate,
      endDate
    } = req.query;

    const query: any = {};

    if (action) query.action = action;
    if (resourceType) query.resourceType = resourceType;
    if (userId) query.userId = userId;

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate as string);
      if (endDate) query.timestamp.$lte = new Date(endDate as string);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const logs = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await ActivityLog.countDocuments(query);

    res.json({
      logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ message: error.message || 'Error fetching logs' });
  }
};
