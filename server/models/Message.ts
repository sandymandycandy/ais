import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  studyCircleId?: mongoose.Types.ObjectId;
  content: string;
  type: 'text' | 'file' | 'image' | 'system';
  read: boolean;
  createdAt: Date;
  editedAt?: Date;
  deleted: boolean;
}

const MessageSchema = new Schema<IMessage>({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  studyCircleId: {
    type: Schema.Types.ObjectId,
    ref: 'StudyCircle',
    index: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'file', 'image', 'system'],
    default: 'text'
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  editedAt: {
    type: Date
  },
  deleted: {
    type: Boolean,
    default: false
  }
});

// Compound indexes for efficient queries
MessageSchema.index({ senderId: 1, recipientId: 1, createdAt: -1 });
MessageSchema.index({ studyCircleId: 1, createdAt: -1 });

export default mongoose.model<IMessage>('Message', MessageSchema);
