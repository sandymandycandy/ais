import mongoose, { Document, Schema } from 'mongoose';

export interface ISkillCourse extends Document {
  // Basic Information
  title: string;
  description: string;
  thumbnail: string;

  // Category & Tags
  category: 'programming' | 'data-science' | 'design' | 'marketing' | 'business' | 'finance' | 'language' | 'soft-skills' | 'creative' | 'professional-cert';
  subcategory?: string;
  tags: string[];

  // Difficulty & Duration
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedDuration: number; // hours
  totalLessons: number;

  // Content Structure
  modules: {
    title: string;
    description: string;
    order: number;
    lessons: {
      title: string;
      description: string;
      type: 'video' | 'article' | 'quiz' | 'assignment' | 'project';
      content?: string; // Article content or embed code
      videoUrl?: string;
      duration?: number; // minutes
      resources?: { name: string; url: string }[];
      quiz?: {
        questions: {
          question: string;
          options: string[];
          correctAnswer: number;
          explanation?: string;
        }[];
      };
      order: number;
    }[];
  }[];

  // Requirements
  prerequisites?: string[];
  requiredSkills?: string[];

  // Learning Outcomes
  learningOutcomes: string[];
  skillsYouWillLearn: string[];

  // Projects
  projects: {
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedTime: number; // hours
    requirements: string[];
  }[];

  // Instructor
  instructor: {
    name: string;
    bio: string;
    avatar?: string;
    credentials?: string[];
  };

  // Pricing
  isPremium: boolean;
  price?: number;
  coinPrice?: number; // Can be purchased with platform coins

  // Statistics
  enrolledStudents: number;
  completedStudents: number;
  averageRating: number;
  totalRatings: number;

  // Certification
  certificateOffered: boolean;
  certificateType?: 'completion' | 'verified';

  // Status
  status: 'draft' | 'published' | 'archived';
  publishedDate?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface ICourseEnrollment extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;

  // Progress
  enrolledDate: Date;
  lastAccessDate: Date;
  completionPercentage: number;

  // Lesson Progress
  completedLessons: {
    moduleIndex: number;
    lessonIndex: number;
    completedDate: Date;
    score?: number; // For quizzes
  }[];

  // Projects
  projectSubmissions: {
    projectIndex: number;
    submissionUrl: string;
    submittedDate: Date;
    status: 'submitted' | 'reviewed' | 'approved';
    feedback?: string;
    score?: number;
  }[];

  // Time Tracking
  totalTimeSpent: number; // minutes

  // Certificate
  certificateIssued: boolean;
  certificateUrl?: string;
  certificateDate?: Date;

  // Rating
  rating?: {
    overall: number;
    content: number;
    instructor: number;
    value: number;
    review?: string;
    date: Date;
  };

  // Status
  status: 'active' | 'completed' | 'dropped';

  createdAt: Date;
  updatedAt: Date;
}

const SkillCourseSchema = new Schema<ISkillCourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },

    category: {
      type: String,
      enum: ['programming', 'data-science', 'design', 'marketing', 'business', 'finance', 'language', 'soft-skills', 'creative', 'professional-cert'],
      required: true
    },
    subcategory: { type: String },
    tags: [{ type: String }],

    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], required: true },
    estimatedDuration: { type: Number, required: true },
    totalLessons: { type: Number, required: true },

    modules: [{
      title: { type: String, required: true },
      description: { type: String },
      order: { type: Number, required: true },
      lessons: [{
        title: { type: String, required: true },
        description: { type: String },
        type: { type: String, enum: ['video', 'article', 'quiz', 'assignment', 'project'], required: true },
        content: { type: String },
        videoUrl: { type: String },
        duration: { type: Number },
        resources: [{ name: String, url: String }],
        quiz: {
          questions: [{
            question: { type: String },
            options: [{ type: String }],
            correctAnswer: { type: Number },
            explanation: { type: String }
          }]
        },
        order: { type: Number, required: true }
      }]
    }],

    prerequisites: [{ type: String }],
    requiredSkills: [{ type: String }],

    learningOutcomes: [{ type: String }],
    skillsYouWillLearn: [{ type: String }],

    projects: [{
      title: { type: String },
      description: { type: String },
      difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
      estimatedTime: { type: Number },
      requirements: [{ type: String }]
    }],

    instructor: {
      name: { type: String, required: true },
      bio: { type: String },
      avatar: { type: String },
      credentials: [{ type: String }]
    },

    isPremium: { type: Boolean, default: false },
    price: { type: Number },
    coinPrice: { type: Number },

    enrolledStudents: { type: Number, default: 0 },
    completedStudents: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },

    certificateOffered: { type: Boolean, default: true },
    certificateType: { type: String, enum: ['completion', 'verified'] },

    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    publishedDate: { type: Date }
  },
  { timestamps: true }
);

const CourseEnrollmentSchema = new Schema<ICourseEnrollment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'SkillCourse', required: true },

    enrolledDate: { type: Date, default: Date.now },
    lastAccessDate: { type: Date, default: Date.now },
    completionPercentage: { type: Number, default: 0 },

    completedLessons: [{
      moduleIndex: { type: Number },
      lessonIndex: { type: Number },
      completedDate: { type: Date, default: Date.now },
      score: { type: Number }
    }],

    projectSubmissions: [{
      projectIndex: { type: Number },
      submissionUrl: { type: String },
      submittedDate: { type: Date, default: Date.now },
      status: { type: String, enum: ['submitted', 'reviewed', 'approved'], default: 'submitted' },
      feedback: { type: String },
      score: { type: Number }
    }],

    totalTimeSpent: { type: Number, default: 0 },

    certificateIssued: { type: Boolean, default: false },
    certificateUrl: { type: String },
    certificateDate: { type: Date },

    rating: {
      overall: { type: Number, min: 1, max: 5 },
      content: { type: Number, min: 1, max: 5 },
      instructor: { type: Number, min: 1, max: 5 },
      value: { type: Number, min: 1, max: 5 },
      review: { type: String },
      date: { type: Date }
    },

    status: { type: String, enum: ['active', 'completed', 'dropped'], default: 'active' }
  },
  { timestamps: true }
);

// Indexes
SkillCourseSchema.index({ category: 1, difficulty: 1, status: 1 });
SkillCourseSchema.index({ tags: 1 });
SkillCourseSchema.index({ averageRating: -1 });

CourseEnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });
CourseEnrollmentSchema.index({ user: 1, status: 1 });

export const SkillCourse = mongoose.model<ISkillCourse>('SkillCourse', SkillCourseSchema);
export const CourseEnrollment = mongoose.model<ICourseEnrollment>('CourseEnrollment', CourseEnrollmentSchema);
