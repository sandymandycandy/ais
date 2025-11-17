import mongoose, { Document, Schema } from 'mongoose';

export interface IScheduledAnnouncement extends Document {
  createdBy: mongoose.Types.ObjectId;
  title: string;
  message: string;
  targetAudience: 'all' | 'students' | 'college';
  priority: 'low' | 'normal' | 'high';
  link?: string;
  scheduledFor: Date;
  status: 'scheduled' | 'sent' | 'cancelled' | 'failed';
  sentAt?: Date;
  recipientCount?: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ScheduledAnnouncementSchema = new Schema<IScheduledAnnouncement>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    targetAudience: {
      type: String,
      enum: ['all', 'students', 'college'],
      default: 'all'
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high'],
      default: 'normal'
    },
    link: {
      type: String
    },
    scheduledFor: {
      type: Date,
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['scheduled', 'sent', 'cancelled', 'failed'],
      default: 'scheduled',
      index: true
    },
    sentAt: {
      type: Date
    },
    recipientCount: {
      type: Number
    },
    error: {
      type: String
    }
  },
  { timestamps: true }
);

// Indexes
ScheduledAnnouncementSchema.index({ createdBy: 1, status: 1 });
ScheduledAnnouncementSchema.index({ scheduledFor: 1, status: 1 });

export default mongoose.model<IScheduledAnnouncement>('ScheduledAnnouncement', ScheduledAnnouncementSchema);
