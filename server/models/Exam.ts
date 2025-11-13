import mongoose, { Document, Schema } from 'mongoose';

export interface IExam extends Document {
  // Basic Information
  name: string;
  fullName: string;
  category: 'government' | 'engineering' | 'medical' | 'management' | 'law' | 'design' | 'professional' | 'defense' | 'international' | 'other';
  subcategory?: string; // SSC-CGL, JEE-Main, NEET-UG, etc.

  // Description
  description: string;
  aboutExam: string;

  // Eligibility
  eligibility: {
    minAge?: number;
    maxAge?: number;
    education: string[];
    nationality: string[];
    otherCriteria?: string;
  };

  // Exam Pattern
  examPattern: {
    totalQuestions: number;
    totalMarks: number;
    duration: number; // in minutes
    sections: {
      name: string;
      questions: number;
      marks: number;
      duration?: number;
    }[];
    markingScheme: string;
    negativeMarking?: string;
    examMode: 'online' | 'offline' | 'both';
  };

  // Syllabus
  syllabus: {
    subject: string;
    topics: {
      name: string;
      weightage?: number;
      subtopics?: string[];
    }[];
  }[];

  // Important Dates
  importantDates: {
    applicationStart?: Date;
    applicationEnd?: Date;
    correctionWindow?: { start: Date; end: Date };
    admitCardRelease?: Date;
    examDate?: Date;
    resultDate?: Date;
  };

  // Fees
  fees: {
    general: number;
    obc: number;
    scst: number;
    female?: number;
    other?: string;
  };

  // Cutoffs
  previousCutoffs: {
    year: number;
    category: string;
    cutoff: number;
    remarks?: string;
  }[];

  // Exam Centers
  examCenters: {
    state: string;
    cities: string[];
  }[];

  // Selection Process
  selectionProcess: {
    stages: string[];
    description: string;
  };

  // Vacancy & Salary
  vacancies?: {
    year: number;
    total: number;
    postWise?: { post: string; count: number }[];
    categoryWise?: { category: string; count: number }[];
  }[];

  salary?: {
    min: number;
    max: number;
    inHand?: number;
    allowances?: string[];
  };

  // Resources
  officialWebsite: string;
  notificationUrl?: string;
  syllabusUrl?: string;

  // Study Materials
  recommendedBooks: { name: string; author: string; subject: string }[];
  videoPlaylists: { title: string; url: string; platform: string }[];

  // Statistics
  totalStudentsTargeting: number;

  createdAt: Date;
  updatedAt: Date;
}

const ExamSchema = new Schema<IExam>(
  {
    name: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    category: {
      type: String,
      enum: ['government', 'engineering', 'medical', 'management', 'law', 'design', 'professional', 'defense', 'international', 'other'],
      required: true
    },
    subcategory: { type: String },

    description: { type: String, required: true },
    aboutExam: { type: String, required: true },

    eligibility: {
      minAge: { type: Number },
      maxAge: { type: Number },
      education: [{ type: String }],
      nationality: [{ type: String }],
      otherCriteria: { type: String }
    },

    examPattern: {
      totalQuestions: { type: Number, required: true },
      totalMarks: { type: Number, required: true },
      duration: { type: Number, required: true },
      sections: [{
        name: { type: String, required: true },
        questions: { type: Number, required: true },
        marks: { type: Number, required: true },
        duration: { type: Number }
      }],
      markingScheme: { type: String, required: true },
      negativeMarking: { type: String },
      examMode: { type: String, enum: ['online', 'offline', 'both'], required: true }
    },

    syllabus: [{
      subject: { type: String, required: true },
      topics: [{
        name: { type: String, required: true },
        weightage: { type: Number },
        subtopics: [{ type: String }]
      }]
    }],

    importantDates: {
      applicationStart: { type: Date },
      applicationEnd: { type: Date },
      correctionWindow: {
        start: { type: Date },
        end: { type: Date }
      },
      admitCardRelease: { type: Date },
      examDate: { type: Date },
      resultDate: { type: Date }
    },

    fees: {
      general: { type: Number, required: true },
      obc: { type: Number, required: true },
      scst: { type: Number, required: true },
      female: { type: Number },
      other: { type: String }
    },

    previousCutoffs: [{
      year: { type: Number, required: true },
      category: { type: String, required: true },
      cutoff: { type: Number, required: true },
      remarks: { type: String }
    }],

    examCenters: [{
      state: { type: String, required: true },
      cities: [{ type: String }]
    }],

    selectionProcess: {
      stages: [{ type: String }],
      description: { type: String }
    },

    vacancies: [{
      year: { type: Number },
      total: { type: Number },
      postWise: [{ post: String, count: Number }],
      categoryWise: [{ category: String, count: Number }]
    }],

    salary: {
      min: { type: Number },
      max: { type: Number },
      inHand: { type: Number },
      allowances: [{ type: String }]
    },

    officialWebsite: { type: String, required: true },
    notificationUrl: { type: String },
    syllabusUrl: { type: String },

    recommendedBooks: [{
      name: { type: String },
      author: { type: String },
      subject: { type: String }
    }],

    videoPlaylists: [{
      title: { type: String },
      url: { type: String },
      platform: { type: String }
    }],

    totalStudentsTargeting: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Indexes
ExamSchema.index({ name: 1 });
ExamSchema.index({ category: 1, subcategory: 1 });
ExamSchema.index({ 'importantDates.examDate': 1 });

export default mongoose.model<IExam>('Exam', ExamSchema);
