import mongoose, { Document, Schema } from 'mongoose';

export interface IMockTest extends Document {
  // Basic Information
  title: string;
  description: string;
  exam: mongoose.Types.ObjectId; // Exam reference
  createdBy: mongoose.Types.ObjectId; // User reference

  // Test Type
  testType: 'public' | 'private' | 'ai-generated';
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';

  // Test Configuration
  duration: number; // in minutes
  totalMarks: number;
  passMarks?: number;
  negativeMarking: boolean;
  negativeMarksPerQuestion?: number;

  // Questions
  questions: {
    questionText: string;
    options: string[];
    correctAnswer: number; // index of correct option
    marks: number;
    negativeMarks?: number;
    subject?: string;
    topic?: string;
    difficulty: 'easy' | 'medium' | 'hard';
    explanation?: string;
    solutionVideo?: string;
  }[];

  // Sections (for sectional tests)
  sections: {
    name: string;
    questions: number[]; // indices in questions array
    duration?: number;
  }[];

  // Access Control
  isPublic: boolean;
  allowedUsers: mongoose.Types.ObjectId[]; // for private tests
  studyCircles: mongoose.Types.ObjectId[]; // for circle tests

  // Scheduling
  scheduledStart?: Date;
  scheduledEnd?: Date;

  // Statistics
  totalAttempts: number;
  averageScore: number;
  highestScore: number;

  // Status
  status: 'draft' | 'published' | 'archived';

  createdAt: Date;
  updatedAt: Date;
}

export interface IMockTestAttempt extends Document {
  test: mongoose.Types.ObjectId; // MockTest reference
  user: mongoose.Types.ObjectId; // User reference

  // Attempt Information
  startTime: Date;
  endTime?: Date;
  duration: number; // actual time taken in minutes

  // Answers
  answers: {
    questionIndex: number;
    selectedOption: number;
    isCorrect: boolean;
    timeTaken: number; // seconds spent on this question
    marked: boolean; // marked for review
  }[];

  // Results
  score: number;
  totalMarks: number;
  accuracy: number; // percentage
  rank?: number;
  percentile?: number;

  // Section-wise Performance
  sectionPerformance: {
    sectionName: string;
    score: number;
    totalMarks: number;
    accuracy: number;
    timeTaken: number;
  }[];

  // Subject/Topic-wise Performance
  topicPerformance: {
    topic: string;
    correct: number;
    incorrect: number;
    unattempted: number;
    accuracy: number;
  }[];

  // Analytics
  strongTopics: string[];
  weakTopics: string[];
  timeManagement: {
    averageTimePerQuestion: number;
    fastestQuestion: number;
    slowestQuestion: number;
  };

  // Status
  status: 'ongoing' | 'completed' | 'abandoned';

  createdAt: Date;
  updatedAt: Date;
}

const MockTestSchema = new Schema<IMockTest>(
  {
    title: { type: String, required: true },
    description: { type: String },
    exam: { type: Schema.Types.ObjectId, ref: 'Exam' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    testType: { type: String, enum: ['public', 'private', 'ai-generated'], required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard', 'mixed'], default: 'medium' },

    duration: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    passMarks: { type: Number },
    negativeMarking: { type: Boolean, default: false },
    negativeMarksPerQuestion: { type: Number, default: 0 },

    questions: [{
      questionText: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: Number, required: true },
      marks: { type: Number, required: true },
      negativeMarks: { type: Number, default: 0 },
      subject: { type: String },
      topic: { type: String },
      difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
      explanation: { type: String },
      solutionVideo: { type: String }
    }],

    sections: [{
      name: { type: String, required: true },
      questions: [{ type: Number }],
      duration: { type: Number }
    }],

    isPublic: { type: Boolean, default: true },
    allowedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    studyCircles: [{ type: Schema.Types.ObjectId, ref: 'StudyCircle' }],

    scheduledStart: { type: Date },
    scheduledEnd: { type: Date },

    totalAttempts: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    highestScore: { type: Number, default: 0 },

    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' }
  },
  { timestamps: true }
);

const MockTestAttemptSchema = new Schema<IMockTestAttempt>(
  {
    test: { type: Schema.Types.ObjectId, ref: 'MockTest', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    startTime: { type: Date, required: true },
    endTime: { type: Date },
    duration: { type: Number },

    answers: [{
      questionIndex: { type: Number, required: true },
      selectedOption: { type: Number, required: true },
      isCorrect: { type: Boolean, required: true },
      timeTaken: { type: Number, default: 0 },
      marked: { type: Boolean, default: false }
    }],

    score: { type: Number, default: 0 },
    totalMarks: { type: Number, required: true },
    accuracy: { type: Number, default: 0 },
    rank: { type: Number },
    percentile: { type: Number },

    sectionPerformance: [{
      sectionName: { type: String },
      score: { type: Number },
      totalMarks: { type: Number },
      accuracy: { type: Number },
      timeTaken: { type: Number }
    }],

    topicPerformance: [{
      topic: { type: String },
      correct: { type: Number, default: 0 },
      incorrect: { type: Number, default: 0 },
      unattempted: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 }
    }],

    strongTopics: [{ type: String }],
    weakTopics: [{ type: String }],

    timeManagement: {
      averageTimePerQuestion: { type: Number },
      fastestQuestion: { type: Number },
      slowestQuestion: { type: Number }
    },

    status: { type: String, enum: ['ongoing', 'completed', 'abandoned'], default: 'ongoing' }
  },
  { timestamps: true }
);

// Indexes
MockTestSchema.index({ exam: 1, testType: 1 });
MockTestSchema.index({ createdBy: 1 });
MockTestSchema.index({ isPublic: 1, status: 1 });

MockTestAttemptSchema.index({ test: 1, user: 1 });
MockTestAttemptSchema.index({ user: 1, status: 1 });
MockTestAttemptSchema.index({ score: -1 }); // For rankings

export const MockTest = mongoose.model<IMockTest>('MockTest', MockTestSchema);
export const MockTestAttempt = mongoose.model<IMockTestAttempt>('MockTestAttempt', MockTestAttemptSchema);
