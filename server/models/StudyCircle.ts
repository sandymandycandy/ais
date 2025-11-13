import mongoose, { Document, Schema } from 'mongoose';

export interface IStudyCircle extends Document {
  // Basic Information
  name: string;
  description: string;
  avatar?: string;

  // Purpose
  purpose: 'exam' | 'subject' | 'college' | 'course' | 'skill' | 'project' | 'general';
  relatedExam?: mongoose.Types.ObjectId; // Exam reference
  subject?: string;
  topics?: string[];

  // Type & Privacy
  circleType: 'public' | 'private';
  maxMembers?: number;

  // Members
  creator: mongoose.Types.ObjectId;
  admins: mongoose.Types.ObjectId[];
  moderators: mongoose.Types.ObjectId[];
  members: {
    user: mongoose.Types.ObjectId;
    joinedDate: Date;
    role: 'admin' | 'moderator' | 'member';
    reputation: number;
  }[];

  // Statistics
  totalMembers: number;
  totalPosts: number;
  totalResources: number;
  activityScore: number; // Algorithm-based score

  // Settings
  settings: {
    allowMemberPosts: boolean;
    requireApproval: boolean;
    allowResourceSharing: boolean;
    allowEvents: boolean;
  };

  // Tags
  tags: string[];

  // Status
  status: 'active' | 'archived' | 'suspended';

  createdAt: Date;
  updatedAt: Date;
}

export interface IPost extends Document {
  // Basic Information
  studyCircle: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;

  // Content
  title?: string;
  content: string;
  postType: 'discussion' | 'doubt' | 'resource' | 'poll' | 'quiz' | 'announcement';

  // Media
  attachments?: {
    type: 'image' | 'pdf' | 'video' | 'link';
    url: string;
    name: string;
  }[];

  // For Doubt Posts
  subject?: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  solved: boolean;
  bestAnswer?: mongoose.Types.ObjectId; // Comment reference

  // For Poll Posts
  poll?: {
    question: string;
    options: {
      text: string;
      votes: mongoose.Types.ObjectId[]; // User IDs
    }[];
    multipleChoice: boolean;
    endsAt?: Date;
  };

  // Tags
  tags: string[];

  // Engagement
  upvotes: mongoose.Types.ObjectId[]; // User IDs
  downvotes: mongoose.Types.ObjectId[]; // User IDs
  views: number;

  // Moderation
  pinned: boolean;
  locked: boolean; // Can't comment
  anonymous: boolean;

  // Status
  status: 'active' | 'deleted' | 'hidden';

  createdAt: Date;
  updatedAt: Date;
}

export interface IComment extends Document {
  post: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;

  // Content
  content: string;
  attachments?: {
    type: 'image' | 'pdf' | 'link';
    url: string;
  }[];

  // Nested Comments
  parentComment?: mongoose.Types.ObjectId; // For replies
  replies: mongoose.Types.ObjectId[];

  // Engagement
  upvotes: mongoose.Types.ObjectId[];
  downvotes: mongoose.Types.ObjectId[];

  // Moderation
  markedAsBestAnswer: boolean;
  anonymous: boolean;

  // Status
  status: 'active' | 'deleted' | 'hidden';

  createdAt: Date;
  updatedAt: Date;
}

const StudyCircleSchema = new Schema<IStudyCircle>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    avatar: { type: String },

    purpose: {
      type: String,
      enum: ['exam', 'subject', 'college', 'course', 'skill', 'project', 'general'],
      required: true
    },
    relatedExam: { type: Schema.Types.ObjectId, ref: 'Exam' },
    subject: { type: String },
    topics: [{ type: String }],

    circleType: { type: String, enum: ['public', 'private'], default: 'public' },
    maxMembers: { type: Number },

    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    moderators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    members: [{
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      joinedDate: { type: Date, default: Date.now },
      role: { type: String, enum: ['admin', 'moderator', 'member'], default: 'member' },
      reputation: { type: Number, default: 0 }
    }],

    totalMembers: { type: Number, default: 0 },
    totalPosts: { type: Number, default: 0 },
    totalResources: { type: Number, default: 0 },
    activityScore: { type: Number, default: 0 },

    settings: {
      allowMemberPosts: { type: Boolean, default: true },
      requireApproval: { type: Boolean, default: false },
      allowResourceSharing: { type: Boolean, default: true },
      allowEvents: { type: Boolean, default: true }
    },

    tags: [{ type: String }],

    status: { type: String, enum: ['active', 'archived', 'suspended'], default: 'active' }
  },
  { timestamps: true }
);

const PostSchema = new Schema<IPost>(
  {
    studyCircle: { type: Schema.Types.ObjectId, ref: 'StudyCircle', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    title: { type: String },
    content: { type: String, required: true },
    postType: {
      type: String,
      enum: ['discussion', 'doubt', 'resource', 'poll', 'quiz', 'announcement'],
      required: true
    },

    attachments: [{
      type: { type: String, enum: ['image', 'pdf', 'video', 'link'] },
      url: { type: String },
      name: { type: String }
    }],

    subject: { type: String },
    topic: { type: String },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
    solved: { type: Boolean, default: false },
    bestAnswer: { type: Schema.Types.ObjectId, ref: 'Comment' },

    poll: {
      question: { type: String },
      options: [{
        text: { type: String },
        votes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
      }],
      multipleChoice: { type: Boolean, default: false },
      endsAt: { type: Date }
    },

    tags: [{ type: String }],

    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },

    pinned: { type: Boolean, default: false },
    locked: { type: Boolean, default: false },
    anonymous: { type: Boolean, default: false },

    status: { type: String, enum: ['active', 'deleted', 'hidden'], default: 'active' }
  },
  { timestamps: true }
);

const CommentSchema = new Schema<IComment>(
  {
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    content: { type: String, required: true },
    attachments: [{
      type: { type: String, enum: ['image', 'pdf', 'link'] },
      url: { type: String }
    }],

    parentComment: { type: Schema.Types.ObjectId, ref: 'Comment' },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],

    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    markedAsBestAnswer: { type: Boolean, default: false },
    anonymous: { type: Boolean, default: false },

    status: { type: String, enum: ['active', 'deleted', 'hidden'], default: 'active' }
  },
  { timestamps: true }
);

// Indexes
StudyCircleSchema.index({ creator: 1 });
StudyCircleSchema.index({ purpose: 1, circleType: 1 });
StudyCircleSchema.index({ tags: 1 });
StudyCircleSchema.index({ activityScore: -1 });

PostSchema.index({ studyCircle: 1, createdAt: -1 });
PostSchema.index({ author: 1 });
PostSchema.index({ postType: 1, status: 1 });
PostSchema.index({ tags: 1 });

CommentSchema.index({ post: 1, createdAt: 1 });
CommentSchema.index({ author: 1 });

export const StudyCircle = mongoose.model<IStudyCircle>('StudyCircle', StudyCircleSchema);
export const Post = mongoose.model<IPost>('Post', PostSchema);
export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
