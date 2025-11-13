import mongoose, { Document, Schema } from 'mongoose';

export interface IOpportunity extends Document {
  // Basic Information
  title: string;
  company: string;
  description: string;

  // Opportunity Type
  type: 'government-exam' | 'internship' | 'job' | 'scholarship' | 'fellowship' | 'competition' | 'workshop' | 'research' | 'startup-program' | 'study-abroad' | 'volunteer' | 'conference';

  // Details
  category?: string; // Engineering, Medical, Management, etc.
  domain?: string[]; // Technology, Finance, Marketing, etc.

  // Location
  location: {
    type: 'remote' | 'in-person' | 'hybrid';
    city?: string;
    state?: string;
    country?: string;
  };

  // Eligibility
  eligibility: {
    minEducation?: string;
    requiredSkills?: string[];
    minCGPA?: number;
    yearOfStudy?: number[];
    ageLimit?: { min: number; max: number };
    otherCriteria?: string;
  };

  // Financial Details
  stipend?: {
    amount: number;
    currency: string;
    period: 'per month' | 'per hour' | 'one-time' | 'per annum';
  };

  // Important Dates
  applicationDeadline: Date;
  startDate?: Date;
  duration?: string; // "3 months", "1 year", etc.

  // Application
  applicationUrl: string;
  applicationMethod: 'external' | 'email' | 'platform';
  contactEmail?: string;

  // Requirements
  requiredDocuments?: string[];
  applicationProcess?: string;

  // Additional Information
  benefits?: string[];
  responsibilities?: string[];
  selectionProcess?: string[];

  // Metadata
  views: number;
  applications: number;
  bookmarks: number;

  // Posting Information
  postedBy: mongoose.Types.ObjectId; // User or Admin
  verified: boolean;
  featured: boolean;

  // Status
  status: 'active' | 'closed' | 'expired' | 'draft';

  createdAt: Date;
  updatedAt: Date;
}

export interface IOpportunityApplication extends Document {
  opportunity: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;

  // Application Details
  appliedDate: Date;
  status: 'applied' | 'in-process' | 'shortlisted' | 'selected' | 'rejected' | 'withdrawn';

  // Documents
  resume: string; // file URL
  coverLetter?: string;
  additionalDocuments?: { name: string; url: string }[];

  // Tracking
  statusHistory: {
    status: string;
    date: Date;
    notes?: string;
  }[];

  // Reminders
  reminders: {
    type: 'follow-up' | 'interview' | 'deadline';
    date: Date;
    message: string;
    sent: boolean;
  }[];

  // Notes
  userNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const OpportunitySchema = new Schema<IOpportunity>(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },

    type: {
      type: String,
      enum: ['government-exam', 'internship', 'job', 'scholarship', 'fellowship', 'competition', 'workshop', 'research', 'startup-program', 'study-abroad', 'volunteer', 'conference'],
      required: true
    },

    category: { type: String },
    domain: [{ type: String }],

    location: {
      type: { type: String, enum: ['remote', 'in-person', 'hybrid'], required: true },
      city: { type: String },
      state: { type: String },
      country: { type: String, default: 'India' }
    },

    eligibility: {
      minEducation: { type: String },
      requiredSkills: [{ type: String }],
      minCGPA: { type: Number },
      yearOfStudy: [{ type: Number }],
      ageLimit: {
        min: { type: Number },
        max: { type: Number }
      },
      otherCriteria: { type: String }
    },

    stipend: {
      amount: { type: Number },
      currency: { type: String, default: 'INR' },
      period: { type: String, enum: ['per month', 'per hour', 'one-time', 'per annum'] }
    },

    applicationDeadline: { type: Date, required: true },
    startDate: { type: Date },
    duration: { type: String },

    applicationUrl: { type: String, required: true },
    applicationMethod: { type: String, enum: ['external', 'email', 'platform'], default: 'external' },
    contactEmail: { type: String },

    requiredDocuments: [{ type: String }],
    applicationProcess: { type: String },

    benefits: [{ type: String }],
    responsibilities: [{ type: String }],
    selectionProcess: [{ type: String }],

    views: { type: Number, default: 0 },
    applications: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 },

    postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    verified: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },

    status: { type: String, enum: ['active', 'closed', 'expired', 'draft'], default: 'active' }
  },
  { timestamps: true }
);

const OpportunityApplicationSchema = new Schema<IOpportunityApplication>(
  {
    opportunity: { type: Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    appliedDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['applied', 'in-process', 'shortlisted', 'selected', 'rejected', 'withdrawn'],
      default: 'applied'
    },

    resume: { type: String, required: true },
    coverLetter: { type: String },
    additionalDocuments: [{
      name: { type: String },
      url: { type: String }
    }],

    statusHistory: [{
      status: { type: String, required: true },
      date: { type: Date, default: Date.now },
      notes: { type: String }
    }],

    reminders: [{
      type: { type: String, enum: ['follow-up', 'interview', 'deadline'], required: true },
      date: { type: Date, required: true },
      message: { type: String },
      sent: { type: Boolean, default: false }
    }],

    userNotes: { type: String }
  },
  { timestamps: true }
);

// Indexes
OpportunitySchema.index({ type: 1, status: 1 });
OpportunitySchema.index({ applicationDeadline: 1 });
OpportunitySchema.index({ 'location.city': 1, 'location.state': 1 });
OpportunitySchema.index({ domain: 1 });
OpportunitySchema.index({ featured: 1, status: 1 });

OpportunityApplicationSchema.index({ opportunity: 1, user: 1 }, { unique: true });
OpportunityApplicationSchema.index({ user: 1, status: 1 });

export const Opportunity = mongoose.model<IOpportunity>('Opportunity', OpportunitySchema);
export const OpportunityApplication = mongoose.model<IOpportunityApplication>('OpportunityApplication', OpportunityApplicationSchema);
