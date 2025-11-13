import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  // Basic Information
  name: string;
  description: string;
  tagline?: string;
  logo?: string;

  // Project Type
  type: 'academic' | 'hackathon' | 'startup' | 'research' | 'personal' | 'open-source';
  category?: string; // Web Development, AI/ML, IoT, etc.

  // Team
  creator: mongoose.Types.ObjectId;
  team: {
    user: mongoose.Types.ObjectId;
    role: string; // Leader, Developer, Designer, etc.
    joinedDate: Date;
    contributionScore: number;
  }[];
  maxTeamSize?: number;

  // Recruitment
  openForRecruitment: boolean;
  openRoles: {
    role: string;
    description: string;
    requiredSkills: string[];
    positions: number;
  }[];

  // Project Details
  techStack: string[];
  skills: string[];
  tags: string[];

  // Timeline
  startDate: Date;
  expectedEndDate?: Date;
  actualEndDate?: Date;
  status: 'planning' | 'in-progress' | 'paused' | 'completed' | 'abandoned';

  // Progress Tracking
  milestones: {
    title: string;
    description: string;
    dueDate: Date;
    completed: boolean;
    completedDate?: Date;
  }[];

  tasks: {
    title: string;
    description?: string;
    assignedTo: mongoose.Types.ObjectId[];
    status: 'todo' | 'in-progress' | 'review' | 'done';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: Date;
    createdBy: mongoose.Types.ObjectId;
    createdDate: Date;
    completedDate?: Date;
    tags: string[];
  }[];

  // Files & Resources
  repository?: string; // GitHub, GitLab URL
  demoUrl?: string;
  documentation?: string;
  files: {
    name: string;
    url: string;
    type: string;
    uploadedBy: mongoose.Types.ObjectId;
    uploadedDate: Date;
  }[];

  // Collaboration
  meetings: {
    title: string;
    date: Date;
    duration: number;
    attendees: mongoose.Types.ObjectId[];
    agenda?: string;
    notes?: string;
    recordingUrl?: string;
  }[];

  discussions: {
    topic: string;
    content: string;
    author: mongoose.Types.ObjectId;
    replies: {
      content: string;
      author: mongoose.Types.ObjectId;
      date: Date;
    }[];
    date: Date;
  }[];

  // Startup Specific (if type === 'startup')
  startup?: {
    businessModel?: string;
    targetMarket?: string;
    problemStatement?: string;
    solution?: string;
    uniqueValueProposition?: string;
    revenueModel?: string;
    competitors?: string[];
    pitchDeck?: string;
    fundingStage?: 'idea' | 'prototype' | 'mvp' | 'early-revenue' | 'scaling';
    fundingRequired?: number;
    fundingRaised?: number;
    investors?: {
      name: string;
      amount: number;
      date: Date;
    }[];
    customerCount?: number;
    monthlyRevenue?: number;
  };

  // Achievements & Recognition
  achievements: {
    title: string;
    description: string;
    date: Date;
    type: 'award' | 'publication' | 'deployment' | 'funding' | 'user-milestone' | 'other';
  }[];

  awards: {
    name: string;
    organization: string;
    prize?: string;
    date: Date;
  }[];

  // Showcase
  showcaseImages: string[];
  showcaseVideo?: string;
  visibility: 'public' | 'private' | 'team-only';
  featured: boolean;

  // Statistics
  views: number;
  likes: mongoose.Types.ObjectId[];
  bookmarks: mongoose.Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    tagline: { type: String },
    logo: { type: String },

    type: {
      type: String,
      enum: ['academic', 'hackathon', 'startup', 'research', 'personal', 'open-source'],
      required: true
    },
    category: { type: String },

    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: [{
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      role: { type: String, required: true },
      joinedDate: { type: Date, default: Date.now },
      contributionScore: { type: Number, default: 0 }
    }],
    maxTeamSize: { type: Number },

    openForRecruitment: { type: Boolean, default: false },
    openRoles: [{
      role: { type: String, required: true },
      description: { type: String },
      requiredSkills: [{ type: String }],
      positions: { type: Number, default: 1 }
    }],

    techStack: [{ type: String }],
    skills: [{ type: String }],
    tags: [{ type: String }],

    startDate: { type: Date, required: true },
    expectedEndDate: { type: Date },
    actualEndDate: { type: Date },
    status: {
      type: String,
      enum: ['planning', 'in-progress', 'paused', 'completed', 'abandoned'],
      default: 'planning'
    },

    milestones: [{
      title: { type: String, required: true },
      description: { type: String },
      dueDate: { type: Date, required: true },
      completed: { type: Boolean, default: false },
      completedDate: { type: Date }
    }],

    tasks: [{
      title: { type: String, required: true },
      description: { type: String },
      assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      status: { type: String, enum: ['todo', 'in-progress', 'review', 'done'], default: 'todo' },
      priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
      dueDate: { type: Date },
      createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      createdDate: { type: Date, default: Date.now },
      completedDate: { type: Date },
      tags: [{ type: String }]
    }],

    repository: { type: String },
    demoUrl: { type: String },
    documentation: { type: String },
    files: [{
      name: { type: String, required: true },
      url: { type: String, required: true },
      type: { type: String },
      uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      uploadedDate: { type: Date, default: Date.now }
    }],

    meetings: [{
      title: { type: String, required: true },
      date: { type: Date, required: true },
      duration: { type: Number },
      attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      agenda: { type: String },
      notes: { type: String },
      recordingUrl: { type: String }
    }],

    discussions: [{
      topic: { type: String, required: true },
      content: { type: String, required: true },
      author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      replies: [{
        content: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        date: { type: Date, default: Date.now }
      }],
      date: { type: Date, default: Date.now }
    }],

    startup: {
      businessModel: { type: String },
      targetMarket: { type: String },
      problemStatement: { type: String },
      solution: { type: String },
      uniqueValueProposition: { type: String },
      revenueModel: { type: String },
      competitors: [{ type: String }],
      pitchDeck: { type: String },
      fundingStage: { type: String, enum: ['idea', 'prototype', 'mvp', 'early-revenue', 'scaling'] },
      fundingRequired: { type: Number },
      fundingRaised: { type: Number },
      investors: [{
        name: { type: String },
        amount: { type: Number },
        date: { type: Date }
      }],
      customerCount: { type: Number },
      monthlyRevenue: { type: Number }
    },

    achievements: [{
      title: { type: String, required: true },
      description: { type: String },
      date: { type: Date, required: true },
      type: { type: String, enum: ['award', 'publication', 'deployment', 'funding', 'user-milestone', 'other'] }
    }],

    awards: [{
      name: { type: String },
      organization: { type: String },
      prize: { type: String },
      date: { type: Date }
    }],

    showcaseImages: [{ type: String }],
    showcaseVideo: { type: String },
    visibility: { type: String, enum: ['public', 'private', 'team-only'], default: 'public' },
    featured: { type: Boolean, default: false },

    views: { type: Number, default: 0 },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

// Indexes
ProjectSchema.index({ creator: 1 });
ProjectSchema.index({ type: 1, status: 1 });
ProjectSchema.index({ tags: 1 });
ProjectSchema.index({ visibility: 1, featured: 1 });
ProjectSchema.index({ 'team.user': 1 });

export default mongoose.model<IProject>('Project', ProjectSchema);
