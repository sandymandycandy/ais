import mongoose, { Document, Schema } from 'mongoose';

export interface IMentor extends Document {
  // User Reference
  user: mongoose.Types.ObjectId;

  // Verification
  verified: boolean;
  verificationDocuments: {
    type: 'marksheet' | 'certificate' | 'id' | 'other';
    url: string;
    uploadDate: Date;
  }[];
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verificationDate?: Date;

  // Professional Information
  bio: string;
  introVideo?: string; // Sample teaching video
  teachingExperience: number; // years
  teachingPhilosophy?: string;

  // Exam & Subject Expertise
  examsCleared: {
    examName: string;
    rank?: number;
    score?: string;
    attemptNumber: number;
    year: number;
  }[];

  specializations: {
    category: 'exam' | 'subject' | 'skill';
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }[];

  // Session Configuration
  sessionTypes: {
    type: '1-on-1' | 'group-small' | 'group-large' | 'webinar' | 'qa';
    duration: number; // minutes
    maxParticipants: number;
    price: number;
  }[];

  languages: string[]; // Languages can teach in

  // Availability
  availability: {
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    slots: {
      startTime: string; // "09:00"
      endTime: string; // "10:00"
      available: boolean;
    }[];
  }[];

  // Pricing
  freeTrialOffered: boolean;
  trialDuration: number; // minutes
  packageDeals: {
    name: string;
    sessions: number;
    pricePerSession: number;
    totalPrice: number;
    validity: number; // days
  }[];

  // Ratings & Reviews
  totalRatings: number;
  averageRating: number;
  ratingBreakdown: {
    teaching: number;
    knowledge: number;
    punctuality: number;
    communication: number;
  };

  // Statistics
  totalSessions: number;
  totalStudents: number;
  successStories: {
    studentName: string;
    achievement: string;
    examCleared?: string;
    rank?: number;
    testimonial?: string;
    date: Date;
  }[];

  // Resources
  sharedResources: mongoose.Types.ObjectId[]; // Note references

  // Earnings
  totalEarnings: number;
  pendingPayout: number;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
  };

  // Status
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  probationPeriod: boolean;
  completedProbationSessions: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface IMentorSession extends Document {
  // Basic Information
  mentor: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;

  // Session Details
  sessionType: '1-on-1' | 'group-small' | 'group-large' | 'webinar' | 'qa';
  participants: mongoose.Types.ObjectId[]; // For group sessions

  // Scheduling
  scheduledDate: Date;
  scheduledTime: string;
  duration: number; // minutes
  timezone: string;

  // Topics
  subject?: string;
  topics: string[];
  preSessionQuestions?: string;
  studentGoals?: string;

  // Session Execution
  actualStartTime?: Date;
  actualEndTime?: Date;
  actualDuration?: number;
  meetingLink?: string;
  recordingUrl?: string;
  whiteboard Data?: string;

  // Shared Materials
  sharedFiles: {
    name: string;
    url: string;
    sharedBy: 'mentor' | 'student';
  }[];

  // Homework & Follow-up
  homework?: {
    title: string;
    description: string;
    dueDate: Date;
    completed: boolean;
    submissionUrl?: string;
    feedback?: string;
  }[];

  notes?: string; // Mentor's notes

  // Payment
  price: number;
  paymentStatus: 'pending' | 'completed' | 'refunded' | 'failed';
  paymentId?: string;
  paymentDate?: Date;

  // Rating & Feedback
  studentRating?: {
    overall: number;
    teaching: number;
    knowledge: number;
    punctuality: number;
    communication: number;
    review?: string;
    date: Date;
  };

  mentorFeedback?: {
    studentEngagement: number;
    preparedness: number;
    notes?: string;
    date: Date;
  };

  // Status
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled' | 'no-show';
  cancellationReason?: string;
  cancelledBy?: 'mentor' | 'student' | 'admin';

  // Reminders
  remindersSent: {
    type: '24h' | '1h' | '15min';
    sentAt: Date;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

const MentorSchema = new Schema<IMentor>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    verified: { type: Boolean, default: false },
    verificationDocuments: [{
      type: { type: String, enum: ['marksheet', 'certificate', 'id', 'other'] },
      url: { type: String },
      uploadDate: { type: Date, default: Date.now }
    }],
    verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    verificationDate: { type: Date },

    bio: { type: String, required: true },
    introVideo: { type: String },
    teachingExperience: { type: Number, default: 0 },
    teachingPhilosophy: { type: String },

    examsCleared: [{
      examName: { type: String, required: true },
      rank: { type: Number },
      score: { type: String },
      attemptNumber: { type: Number, required: true },
      year: { type: Number, required: true }
    }],

    specializations: [{
      category: { type: String, enum: ['exam', 'subject', 'skill'], required: true },
      name: { type: String, required: true },
      level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'intermediate' }
    }],

    sessionTypes: [{
      type: { type: String, enum: ['1-on-1', 'group-small', 'group-large', 'webinar', 'qa'], required: true },
      duration: { type: Number, required: true },
      maxParticipants: { type: Number, default: 1 },
      price: { type: Number, required: true }
    }],

    languages: [{ type: String }],

    availability: [{
      day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], required: true },
      slots: [{
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        available: { type: Boolean, default: true }
      }]
    }],

    freeTrialOffered: { type: Boolean, default: true },
    trialDuration: { type: Number, default: 15 },
    packageDeals: [{
      name: { type: String },
      sessions: { type: Number },
      pricePerSession: { type: Number },
      totalPrice: { type: Number },
      validity: { type: Number }
    }],

    totalRatings: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    ratingBreakdown: {
      teaching: { type: Number, default: 0 },
      knowledge: { type: Number, default: 0 },
      punctuality: { type: Number, default: 0 },
      communication: { type: Number, default: 0 }
    },

    totalSessions: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },
    successStories: [{
      studentName: { type: String },
      achievement: { type: String },
      examCleared: { type: String },
      rank: { type: Number },
      testimonial: { type: String },
      date: { type: Date, default: Date.now }
    }],

    sharedResources: [{ type: Schema.Types.ObjectId, ref: 'Note' }],

    totalEarnings: { type: Number, default: 0 },
    pendingPayout: { type: Number, default: 0 },
    bankDetails: {
      accountNumber: { type: String },
      ifscCode: { type: String },
      accountHolderName: { type: String },
      bankName: { type: String }
    },

    status: { type: String, enum: ['pending', 'active', 'suspended', 'inactive'], default: 'pending' },
    probationPeriod: { type: Boolean, default: true },
    completedProbationSessions: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const MentorSessionSchema = new Schema<IMentorSession>(
  {
    mentor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    sessionType: { type: String, enum: ['1-on-1', 'group-small', 'group-large', 'webinar', 'qa'], required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    scheduledDate: { type: Date, required: true },
    scheduledTime: { type: String, required: true },
    duration: { type: Number, required: true },
    timezone: { type: String, default: 'Asia/Kolkata' },

    subject: { type: String },
    topics: [{ type: String }],
    preSessionQuestions: { type: String },
    studentGoals: { type: String },

    actualStartTime: { type: Date },
    actualEndTime: { type: Date },
    actualDuration: { type: Number },
    meetingLink: { type: String },
    recordingUrl: { type: String },
    whiteboardData: { type: String },

    sharedFiles: [{
      name: { type: String },
      url: { type: String },
      sharedBy: { type: String, enum: ['mentor', 'student'] }
    }],

    homework: [{
      title: { type: String },
      description: { type: String },
      dueDate: { type: Date },
      completed: { type: Boolean, default: false },
      submissionUrl: { type: String },
      feedback: { type: String }
    }],

    notes: { type: String },

    price: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'refunded', 'failed'], default: 'pending' },
    paymentId: { type: String },
    paymentDate: { type: Date },

    studentRating: {
      overall: { type: Number, min: 1, max: 5 },
      teaching: { type: Number, min: 1, max: 5 },
      knowledge: { type: Number, min: 1, max: 5 },
      punctuality: { type: Number, min: 1, max: 5 },
      communication: { type: Number, min: 1, max: 5 },
      review: { type: String },
      date: { type: Date }
    },

    mentorFeedback: {
      studentEngagement: { type: Number, min: 1, max: 5 },
      preparedness: { type: Number, min: 1, max: 5 },
      notes: { type: String },
      date: { type: Date }
    },

    status: { type: String, enum: ['scheduled', 'ongoing', 'completed', 'cancelled', 'no-show'], default: 'scheduled' },
    cancellationReason: { type: String },
    cancelledBy: { type: String, enum: ['mentor', 'student', 'admin'] },

    remindersSent: [{
      type: { type: String, enum: ['24h', '1h', '15min'] },
      sentAt: { type: Date }
    }]
  },
  { timestamps: true }
);

// Indexes
MentorSchema.index({ user: 1 });
MentorSchema.index({ verificationStatus: 1, status: 1 });
MentorSchema.index({ averageRating: -1 });
MentorSchema.index({ 'specializations.name': 1 });

MentorSessionSchema.index({ mentor: 1, scheduledDate: 1 });
MentorSessionSchema.index({ student: 1, status: 1 });
MentorSessionSchema.index({ scheduledDate: 1, status: 1 });

export const Mentor = mongoose.model<IMentor>('Mentor', MentorSchema);
export const MentorSession = mongoose.model<IMentorSession>('MentorSession', MentorSessionSchema);
