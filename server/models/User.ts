import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  // Basic Information
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';

  // Academic Information
  college?: string;
  course?: string;
  year?: number;
  rollNumber?: string;

  // Career Interests
  careerInterests: string[]; // government, coding, design, business, research, etc.
  competitiveExamTargets: string[]; // SSC, UPSC, JEE, NEET, etc.

  // Skills & Endorsements
  skills: {
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    endorsements: mongoose.Types.ObjectId[]; // references to users who endorsed
  }[];

  // Professional Links
  githubProfile?: string;
  linkedinProfile?: string;
  portfolioUrl?: string;
  customProfileUrl?: string;

  // Achievements
  achievements: {
    title: string;
    description: string;
    date: Date;
    type: 'certification' | 'competition' | 'internship' | 'project' | 'other';
    documentUrl?: string;
  }[];

  // Certifications
  certifications: {
    name: string;
    issuer: string;
    issueDate: Date;
    expiryDate?: Date;
    credentialId?: string;
    credentialUrl?: string;
  }[];

  // Resume
  resumes: {
    title: string;
    fileUrl: string;
    uploadDate: Date;
    isPrimary: boolean;
  }[];

  // Privacy & Settings
  profileVisibility: 'public' | 'private' | 'connections-only';
  emailVerified: boolean;
  phoneVerified: boolean;

  // Profile Completeness
  profileCompleteness: number; // 0-100

  // Gamification
  xp: number;
  level: number;
  coins: number;
  badges: mongoose.Types.ObjectId[];
  streaks: {
    login: { current: number; longest: number; lastDate: Date };
    study: { current: number; longest: number; lastDate: Date };
    quiz: { current: number; longest: number; lastDate: Date };
    community: { current: number; longest: number; lastDate: Date };
  };
  title?: string; // Novice, Learner, Scholar, Expert, Master, Legend

  // Relationships
  following: mongoose.Types.ObjectId[];
  followers: mongoose.Types.ObjectId[];

  // Timestamps
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    bio: { type: String, maxlength: 500 },
    phone: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },

    college: { type: String },
    course: { type: String },
    year: { type: Number, min: 1, max: 5 },
    rollNumber: { type: String },

    careerInterests: [{ type: String }],
    competitiveExamTargets: [{ type: String }],

    skills: [{
      name: { type: String, required: true },
      level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'beginner' },
      endorsements: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    }],

    githubProfile: { type: String },
    linkedinProfile: { type: String },
    portfolioUrl: { type: String },
    customProfileUrl: { type: String, unique: true, sparse: true },

    achievements: [{
      title: { type: String, required: true },
      description: { type: String },
      date: { type: Date, required: true },
      type: { type: String, enum: ['certification', 'competition', 'internship', 'project', 'other'], required: true },
      documentUrl: { type: String }
    }],

    certifications: [{
      name: { type: String, required: true },
      issuer: { type: String, required: true },
      issueDate: { type: Date, required: true },
      expiryDate: { type: Date },
      credentialId: { type: String },
      credentialUrl: { type: String }
    }],

    resumes: [{
      title: { type: String, required: true },
      fileUrl: { type: String, required: true },
      uploadDate: { type: Date, default: Date.now },
      isPrimary: { type: Boolean, default: false }
    }],

    profileVisibility: { type: String, enum: ['public', 'private', 'connections-only'], default: 'public' },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },

    profileCompleteness: { type: Number, default: 0, min: 0, max: 100 },

    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    coins: { type: Number, default: 0 },
    badges: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
    streaks: {
      login: {
        current: { type: Number, default: 0 },
        longest: { type: Number, default: 0 },
        lastDate: { type: Date }
      },
      study: {
        current: { type: Number, default: 0 },
        longest: { type: Number, default: 0 },
        lastDate: { type: Date }
      },
      quiz: {
        current: { type: Number, default: 0 },
        longest: { type: Number, default: 0 },
        lastDate: { type: Date }
      },
      community: {
        current: { type: Number, default: 0 },
        longest: { type: Number, default: 0 },
        lastDate: { type: Date }
      }
    },
    title: { type: String, default: 'Novice' },

    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    lastActive: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ customProfileUrl: 1 });
UserSchema.index({ college: 1, course: 1 });
UserSchema.index({ competitiveExamTargets: 1 });
UserSchema.index({ level: -1, xp: -1 }); // For leaderboards

export default mongoose.model<IUser>('User', UserSchema);
