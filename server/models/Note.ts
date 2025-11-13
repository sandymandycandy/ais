import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  // Basic Information
  title: string;
  description?: string;
  uploadedBy: mongoose.Types.ObjectId; // User reference

  // File Information
  fileUrl: string;
  fileType: 'pdf' | 'ppt' | 'doc' | 'image' | 'other';
  fileSize: number; // in bytes
  fileName: string;

  // Organization
  subject?: string;
  topic?: string;
  professor?: string;
  course?: string;
  semester?: number;
  tags: string[];

  // AI-Generated Content
  aiSummary?: string;
  flashcards: {
    question: string;
    answer: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }[];
  keyPoints: string[];

  // Metadata
  views: number;
  downloads: number;

  // Rating & Reviews
  ratings: {
    user: mongoose.Types.ObjectId;
    rating: number; // 1-5
    review?: string;
    date: Date;
  }[];
  averageRating: number;

  // Sharing & Collaboration
  sharedWith: mongoose.Types.ObjectId[]; // User IDs
  studyCircles: mongoose.Types.ObjectId[]; // StudyCircle IDs
  isPublic: boolean;

  // Version Control
  version: number;
  previousVersions: {
    fileUrl: string;
    uploadDate: Date;
    changes: string;
  }[];

  // Status
  status: 'active' | 'archived' | 'deleted';
  verified: boolean; // Professor verified

  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    description: { type: String },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    fileUrl: { type: String, required: true },
    fileType: { type: String, enum: ['pdf', 'ppt', 'doc', 'image', 'other'], required: true },
    fileSize: { type: Number, required: true },
    fileName: { type: String, required: true },

    subject: { type: String },
    topic: { type: String },
    professor: { type: String },
    course: { type: String },
    semester: { type: Number },
    tags: [{ type: String }],

    aiSummary: { type: String },
    flashcards: [{
      question: { type: String, required: true },
      answer: { type: String, required: true },
      difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
    }],
    keyPoints: [{ type: String }],

    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },

    ratings: [{
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5, required: true },
      review: { type: String },
      date: { type: Date, default: Date.now }
    }],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },

    sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    studyCircles: [{ type: Schema.Types.ObjectId, ref: 'StudyCircle' }],
    isPublic: { type: Boolean, default: true },

    version: { type: Number, default: 1 },
    previousVersions: [{
      fileUrl: { type: String },
      uploadDate: { type: Date },
      changes: { type: String }
    }],

    status: { type: String, enum: ['active', 'archived', 'deleted'], default: 'active' },
    verified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Indexes
NoteSchema.index({ uploadedBy: 1 });
NoteSchema.index({ subject: 1, topic: 1 });
NoteSchema.index({ tags: 1 });
NoteSchema.index({ averageRating: -1 });
NoteSchema.index({ createdAt: -1 });
NoteSchema.index({ isPublic: 1, status: 1 });

export default mongoose.model<INote>('Note', NoteSchema);
