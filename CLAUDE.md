# 🤖 CLAUDE.md - AI Assistant Development Guide

> **Last Updated:** 2025-11-14
> **Version:** 2.0
> **Purpose:** Comprehensive guide for AI assistants working on the Student Hub Platform

This document provides AI assistants (like Claude) with essential context about the codebase structure, development workflows, conventions, and best practices to follow when making changes or additions to this project.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Codebase Structure](#codebase-structure)
4. [Development Setup](#development-setup)
5. [Coding Conventions](#coding-conventions)
6. [Architecture Patterns](#architecture-patterns)
7. [State Management](#state-management)
8. [API Conventions](#api-conventions)
9. [Authentication & Security](#authentication--security)
10. [Database Patterns](#database-patterns)
11. [Error Handling](#error-handling)
12. [Testing Guidelines](#testing-guidelines)
13. [Common Tasks](#common-tasks)
14. [Git Workflow](#git-workflow)
15. [AI Assistant Guidelines](#ai-assistant-guidelines)

---

## 🎯 Project Overview

**Student Hub Platform** is a comprehensive full-stack edtech application designed to help students manage their academic journey, career preparation, and skill development.

### Core Features
- **Smart Student Profile** - Digital identity with gamification (XP, levels, badges)
- **AI-Powered Smart Notes** - File uploads with AI summarization and Clarity Bot
- **Exam Preparation Zone** - Mock tests, syllabus tracking, performance analytics
- **Opportunities Portal** - Internships, jobs, scholarships, competitions
- **Mentorship Platform** - Session booking, ratings, mentor matching
- **Study Circles** - Community groups, discussions, resource sharing
- **Project Collaboration** - Team projects with Kanban boards
- **Skill Learning** - Course catalog with progress tracking

### Project Goals
1. Provide a unified platform for student needs
2. Leverage AI for personalized learning
3. Gamify the learning experience
4. Build a supportive community
5. Prepare students for competitive exams and careers

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library with latest features
- **TypeScript** - Type safety and better DX
- **Vite** - Fast build tool with HMR
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **React Router 7.x** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Lucide React** - Icon library
- **React Query** - Server state management (partial)

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express 5.x** - Web framework
- **TypeScript** - Type safety on backend
- **MongoDB 6+** - NoSQL database
- **Mongoose 8.x** - ODM with schema validation
- **JWT** - Token-based authentication
- **Bcrypt.js** - Password hashing
- **Multer** - File upload handling
- **Socket.IO** - Real-time communication (ready)

### AI Integration (Ready for Activation)
- **OpenAI API** - GPT models for summarization and chat
- **Vector Database** - Planned for semantic search

### DevOps & Tools
- **Docker** - MongoDB containerization
- **ESLint** - Code linting
- **TypeScript ESLint** - TS-specific linting
- **PostCSS** - CSS processing
- **tsx** - TypeScript execution for backend

---

## 📁 Codebase Structure

### Root Directory Layout

```
ais/
├── server/                   # Backend application
│   ├── config/              # Configuration files
│   │   └── db.ts           # MongoDB connection
│   ├── models/             # Mongoose schemas and models
│   │   ├── User.ts         # User profile with gamification
│   │   ├── Note.ts         # Study notes with AI features
│   │   ├── Exam.ts         # Competitive exam data
│   │   ├── MockTest.ts     # Tests and attempts
│   │   ├── Opportunity.ts  # Jobs, internships, scholarships
│   │   ├── StudyCircle.ts  # Community groups
│   │   ├── Mentor.ts       # Mentor profiles and sessions
│   │   ├── Project.ts      # Team collaboration
│   │   ├── Badge.ts        # Achievement badges
│   │   └── SkillCourse.ts  # Learning courses
│   ├── routes/             # Express route definitions
│   │   ├── auth.ts         # Authentication routes
│   │   ├── users.ts        # User management
│   │   ├── notes.ts        # Notes CRUD and AI features
│   │   ├── exams.ts        # Exam browsing and targeting
│   │   ├── mockTests.ts    # Test creation and submission
│   │   ├── opportunities.ts # Opportunities and applications
│   │   ├── studyCircles.ts # Study groups and posts
│   │   ├── mentors.ts      # Mentor booking and sessions
│   │   ├── skillCourses.ts # Course enrollment
│   │   ├── projects.ts     # Project management
│   │   ├── dashboard.ts    # Dashboard data aggregation
│   │   └── gamification.ts # Leaderboards and badges
│   ├── controllers/        # Request handlers (business logic)
│   │   └── [matching route files]
│   ├── middleware/         # Custom middleware
│   │   └── auth.ts        # JWT authentication (protect, optionalAuth)
│   ├── utils/             # Utility functions
│   │   └── jwt.ts         # Token generation and verification
│   └── index.ts           # Express server entry point
│
├── src/                    # Frontend application
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   │   ├── Button.tsx           # Customizable button with variants
│   │   │   ├── Card.tsx             # Card container with sub-components
│   │   │   ├── Badge.tsx            # Status badges
│   │   │   ├── Input.tsx            # Form input
│   │   │   ├── LoadingSkeleton.tsx  # Loading states
│   │   │   ├── EmptyState.tsx       # Empty state UI
│   │   │   └── ConfirmDialog.tsx    # Confirmation dialogs
│   │   ├── layout/       # Layout components
│   │   │   └── Navbar.tsx           # Main navigation
│   │   ├── ErrorBoundary.tsx        # Error boundary wrapper
│   │   └── ToastProvider.tsx        # Toast notification system
│   ├── pages/            # Page components (17 total)
│   │   ├── Dashboard.tsx            # Main dashboard
│   │   ├── Login.tsx                # Authentication
│   │   ├── Register.tsx             # User registration
│   │   ├── Profile.tsx              # User profile management
│   │   ├── Notes.tsx                # Notes list
│   │   ├── NoteDetail.tsx           # Single note view
│   │   ├── UploadNotes.tsx          # Note upload form
│   │   ├── Exams.tsx                # Exam categories
│   │   ├── ExamDetail.tsx           # Exam details and syllabus
│   │   ├── MockTest.tsx             # Test interface
│   │   ├── Opportunities.tsx        # Opportunities list
│   │   ├── OpportunityDetail.tsx    # Opportunity details
│   │   ├── StudyCircles.tsx         # Study groups list
│   │   ├── StudyCircleDetail.tsx    # Group details and posts
│   │   ├── CreateStudyCircle.tsx    # Create group form
│   │   ├── Mentors.tsx              # Mentor profiles
│   │   └── MentorDetail.tsx         # Mentor booking
│   ├── store/            # Zustand state management
│   │   └── authStore.ts            # Global auth state
│   ├── lib/              # Utilities and configurations
│   │   ├── api.ts                  # Axios instance with interceptors
│   │   └── utils.ts                # Helper functions
│   ├── App.tsx           # Root component with routing
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles and Tailwind imports
│
├── uploads/               # File storage (gitignored)
├── .env                   # Environment variables (gitignored)
├── .env.example           # Environment variable template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration (root)
├── tsconfig.app.json     # Frontend TS config
├── tsconfig.node.json    # Node/build TS config
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── eslint.config.js      # ESLint configuration
├── README.md             # Project documentation
├── TESTING_GUIDE.md      # Comprehensive testing guide
└── CLAUDE.md             # This file
```

### Key File Purposes

#### Backend Core Files

- **`server/index.ts`** - Express server setup, middleware mounting, route registration, error handling
- **`server/config/db.ts`** - MongoDB connection with Mongoose, connection event handling
- **`server/middleware/auth.ts`** - JWT verification, user attachment to request, route protection
- **`server/utils/jwt.ts`** - Token generation and verification utilities

#### Frontend Core Files

- **`src/main.tsx`** - React app mounting, ErrorBoundary and ToastProvider wrapping
- **`src/App.tsx`** - React Router setup, route guards, layout composition
- **`src/lib/api.ts`** - Axios configuration, request/response interceptors, error handling
- **`src/lib/utils.ts`** - Utility functions (formatting, validation, etc.)
- **`src/store/authStore.ts`** - Authentication state, login/logout/register actions

---

## 🚀 Development Setup

### Prerequisites
- Node.js 18+ (check with `node --version`)
- MongoDB 6+ (local, Docker, or Atlas)
- npm or yarn
- Git

### Initial Setup

```bash
# 1. Clone and navigate
git clone <repository-url>
cd ais

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Start MongoDB (choose one)
npm run mongo:docker              # Docker (recommended)
# OR
sudo systemctl start mongod       # Local installation
# OR use MongoDB Atlas connection string

# 5. Start development servers

# Terminal 1 - Backend
npm run server                    # Runs on http://localhost:5000

# Terminal 2 - Frontend
npm run dev                       # Runs on http://localhost:5173
```

### Environment Variables

**Required in `.env`:**
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/student-hub

# JWT (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Optional (for full features):**
```env
# OpenAI (for AI features)
OPENAI_API_KEY=sk-your-key

# Cloudinary (for production file storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### Available npm Scripts

```bash
npm run dev              # Start Vite dev server (frontend)
npm run server           # Start backend with tsx watch mode
npm run server:dev       # Start backend with nodemon
npm run build            # Build frontend for production
npm run preview          # Preview production build
npm run lint             # Run ESLint

# MongoDB Docker commands
npm run mongo:docker     # Create and start MongoDB container
npm run mongo:start      # Start existing container
npm run mongo:stop       # Stop container
npm run mongo:remove     # Remove container
npm run mongo:logs       # View MongoDB logs
```

---

## 📝 Coding Conventions

### TypeScript Guidelines

#### Always Use TypeScript
- All `.ts` and `.tsx` files
- No implicit `any` types
- Define interfaces for all data structures
- Use type imports when only importing types

#### Frontend Type Patterns

```typescript
// Component Props
interface DashboardProps {
  userId: string;
  initialData?: DashboardData;
}

export default function Dashboard({ userId, initialData }: DashboardProps) {
  // Component logic
}

// Zustand Store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Store implementation
}));

// API Response Types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
```

#### Backend Type Patterns

```typescript
// Model Interfaces
import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  // ... other fields
}

// Extended Request for Auth
export interface AuthRequest extends Request {
  user?: IUser;
}

// Controller Types
import { Response } from 'express';

export const getProfile = async (req: AuthRequest, res: Response) => {
  // Implementation
};
```

### Naming Conventions

#### Files and Directories
- **Components:** PascalCase (`Dashboard.tsx`, `NoteDetail.tsx`)
- **Utilities:** camelCase (`api.ts`, `utils.ts`, `jwt.ts`)
- **Models:** PascalCase singular (`User.ts`, `Note.ts`)
- **Routes:** camelCase plural (`users.ts`, `notes.ts`)
- **Controllers:** camelCase with suffix (`authController.ts`)

#### Variables and Functions
- **Constants:** UPPER_SNAKE_CASE (`JWT_SECRET`, `MAX_FILE_SIZE`)
- **Variables:** camelCase (`userData`, `isAuthenticated`)
- **Functions:** camelCase, descriptive (`fetchUserProfile`, `handleSubmit`)
- **Components:** PascalCase (`UserProfile`, `NoteCard`)
- **React Hooks:** camelCase with `use` prefix (`useAuth`, `useNotes`)

#### Database and API
- **Collections:** lowercase plural (`users`, `notes`, `mocktests`)
- **Fields:** camelCase (`firstName`, `createdAt`, `targetExams`)
- **API Endpoints:** lowercase with hyphens (`/api/study-circles`, `/api/mock-tests`)

### Component Structure

Follow this order in React components:

```typescript
// 1. Imports (external, then internal)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

// 2. Type definitions
interface ProfileProps {
  userId: string;
}

interface FormData {
  name: string;
  email: string;
}

// 3. Component definition
export default function Profile({ userId }: ProfileProps) {
  // 4. Hooks (state, context, custom hooks)
  const [formData, setFormData] = useState<FormData>({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // 5. Effects
  useEffect(() => {
    fetchProfile();
  }, [userId]);

  // 6. Event handlers and helper functions
  const fetchProfile = async () => {
    // Implementation
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // Implementation
  };

  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Import Organization

```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 2. UI components
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// 3. Feature components
import { Navbar } from '@/components/layout/Navbar';

// 4. Store/state
import { useAuthStore } from '@/store/authStore';

// 5. Utils/lib
import api from '@/lib/api';
import { formatDate, cn } from '@/lib/utils';

// 6. Types
import type { User, Note } from '@/types';

// 7. Assets/styles (if any)
import './styles.css';
```

### CSS and Styling Conventions

#### Tailwind Utility Classes
- Use `cn()` helper for conditional classes
- Group related utilities (layout, then spacing, then colors, then typography)
- Use responsive breakpoints consistently (`sm:`, `md:`, `lg:`)
- Prefer Tailwind utilities over custom CSS

```typescript
// Good
<div className={cn(
  "flex items-center justify-between",
  "p-4 md:p-6",
  "bg-white dark:bg-gray-800",
  "rounded-lg shadow-md",
  isActive && "border-2 border-blue-500"
)}>

// Avoid
<div className="flex bg-white p-4 rounded-lg items-center shadow-md justify-between md:p-6 dark:bg-gray-800">
```

#### Custom Animations
Available custom animations in `tailwind.config.js`:
- `animate-fade-in` - Fade in with slight upward movement
- `animate-slide-in` - Slide in from left
- `animate-scale-in` - Scale up with fade
- `animate-shimmer` - Loading shimmer effect

### Code Comments

```typescript
// 1. File-level comment (optional for non-obvious files)
/**
 * Authentication store - manages user session, login, logout
 * Uses Zustand for state management with localStorage persistence
 */

// 2. Complex logic comments
// Calculate XP needed for next level (100 XP per level)
const xpForNextLevel = currentLevel * 100;

// 3. TODO comments with context
// TODO: Add refresh token rotation for enhanced security
// TODO: Implement rate limiting on login endpoint (priority: high)

// 4. API/function documentation
/**
 * Generates AI summary for a note using OpenAI
 * @param noteId - MongoDB ObjectId of the note
 * @param userId - User requesting the summary
 * @returns Promise<string> - Generated summary text
 * @throws Error if OpenAI API key is not configured
 */
export const generateSummary = async (noteId: string, userId: string): Promise<string> => {
  // Implementation
};
```

---

## 🏗️ Architecture Patterns

### Frontend Architecture

#### Component Hierarchy
```
App (Routing)
├── ErrorBoundary
│   └── ToastProvider
│       ├── Public Routes
│       │   ├── Login
│       │   └── Register
│       └── Protected Routes
│           └── Layout (Navbar + Outlet)
│               ├── Dashboard
│               ├── Notes
│               ├── Exams
│               └── [other pages]
```

#### Data Flow
1. **User Action** → Event handler in component
2. **API Call** → Using `api.ts` Axios instance
3. **Response** → Update local state or Zustand store
4. **Re-render** → React updates UI
5. **Error** → Caught by interceptor, toast shown

#### State Management Strategy
- **Local State** (`useState`): UI state, form data, temporary data
- **Zustand Store** (`authStore`): Authentication, global user data
- **URL State** (React Router): Current page, URL parameters
- **Server State** (React Query, planned): Cached server data

### Backend Architecture

#### Layered Architecture
```
Request → Route → Middleware → Controller → Model → Database
                                    ↓
                              Response ← ←
```

#### Request Flow Example

```typescript
// 1. Route Definition (server/routes/notes.ts)
router.post('/:id/rate', protect, rateNote);

// 2. Middleware (server/middleware/auth.ts)
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Verify JWT token
  // Attach user to req.user
  next();
};

// 3. Controller (server/controllers/noteController.ts)
export const rateNote = async (req: AuthRequest, res: Response) => {
  try {
    // Validate input
    // Business logic
    // Database operation
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Model (server/models/Note.ts)
const NoteSchema = new Schema({
  // Schema definition
});
export default mongoose.model<INote>('Note', NoteSchema);
```

#### Separation of Concerns
- **Routes** - Define endpoints and attach middleware
- **Controllers** - Handle request/response, validation, business logic
- **Models** - Define data structure, validation, database operations
- **Middleware** - Cross-cutting concerns (auth, logging, validation)
- **Utils** - Reusable helper functions

### Design Patterns Used

#### 1. Repository Pattern (Mongoose Models)
```typescript
// Model encapsulates data access
const user = await User.findById(id);
const notes = await Note.find({ user: userId });
```

#### 2. Middleware Pattern (Express)
```typescript
// Chain of responsibility
router.get('/profile', protect, getProfile);
```

#### 3. Singleton Pattern (Database Connection)
```typescript
// Single database connection instance
let connection = null;
export const connectDB = async () => {
  if (connection) return connection;
  connection = await mongoose.connect(MONGODB_URI);
  return connection;
};
```

#### 4. Factory Pattern (Token Generation)
```typescript
export const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};
```

#### 5. Observer Pattern (Event Emitters, planned for real-time)
```typescript
// Socket.IO for real-time updates
io.on('connection', (socket) => {
  socket.on('join-circle', (circleId) => {
    socket.join(circleId);
  });
});
```

---

## 🗄️ State Management

### Zustand Store Pattern

Current implementation: Single auth store

```typescript
// src/store/authStore.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    const response = await api.get('/auth/me');
    set({ user: response.data });
  },
}));
```

### When to Add New Stores

Create new Zustand stores for:
- Global UI state (theme, sidebar, modals)
- Cross-page data (notifications, cart, drafts)
- Real-time data (online users, live updates)

**Don't create stores for:**
- Page-specific data (use local state)
- Server data (use React Query)
- Form data (use local state)

---

## 🔌 API Conventions

### RESTful Endpoint Structure

```
Resource Collection:
GET    /api/resource              # List all (with pagination/filters)
POST   /api/resource              # Create new

Resource Item:
GET    /api/resource/:id          # Get one
PUT    /api/resource/:id          # Update (replace)
PATCH  /api/resource/:id          # Update (partial)
DELETE /api/resource/:id          # Delete

Resource Actions:
POST   /api/resource/:id/action   # Perform action

Nested Resources:
GET    /api/resource/:id/nested   # Get nested resources
POST   /api/resource/:id/nested   # Create nested resource
```

### Actual API Endpoints

#### Authentication (`/api/auth`)
```
POST   /api/auth/register         # Register new user
POST   /api/auth/login            # Login with email/password
GET    /api/auth/me               # Get current user (protected)
PUT    /api/auth/update-password  # Update password (protected)
POST   /api/auth/refresh          # Refresh JWT token
POST   /api/auth/logout           # Logout user
```

#### Users (`/api/users`)
```
GET    /api/users/profile         # Get current user profile
PUT    /api/users/profile         # Update profile
POST   /api/users/avatar          # Upload avatar
POST   /api/users/skills          # Add skill
DELETE /api/users/skills/:skillId # Remove skill
POST   /api/users/achievements    # Add achievement
```

#### Notes (`/api/notes`)
```
GET    /api/notes                 # List notes (optional auth)
POST   /api/notes                 # Upload note (protected)
GET    /api/notes/:id             # Get note details
PUT    /api/notes/:id             # Update note (protected)
DELETE /api/notes/:id             # Delete note (protected)
POST   /api/notes/:id/rate        # Rate note (protected)
POST   /api/notes/:id/summary     # Generate AI summary (protected)
POST   /api/notes/:id/flashcards  # Generate flashcards (protected)
POST   /api/notes/clarity-bot     # Ask Clarity Bot (protected)
```

#### Exams (`/api/exams`)
```
GET    /api/exams                 # List all exams
GET    /api/exams/:id             # Get exam details
POST   /api/exams/:id/target      # Target/untarget exam (protected)
GET    /api/exams/my-targets      # Get user's targeted exams (protected)
POST   /api/exams/:id/syllabus/:sectionId/toggle # Toggle topic (protected)
```

#### Mock Tests (`/api/mock-tests`)
```
GET    /api/mock-tests            # List tests
POST   /api/mock-tests            # Create test (protected)
GET    /api/mock-tests/:id        # Get test details
POST   /api/mock-tests/:id/start  # Start test (protected)
POST   /api/mock-tests/:id/submit # Submit test (protected)
GET    /api/mock-tests/:id/leaderboard # Get rankings
GET    /api/mock-tests/my-attempts # Get user attempts (protected)
```

#### Opportunities (`/api/opportunities`)
```
GET    /api/opportunities         # List opportunities
GET    /api/opportunities/:id     # Get details
POST   /api/opportunities/:id/apply # Apply (protected)
GET    /api/opportunities/my-applications # Get applications (protected)
POST   /api/opportunities/:id/bookmark # Bookmark (protected)
```

#### Study Circles (`/api/study-circles`)
```
GET    /api/study-circles         # List circles
POST   /api/study-circles         # Create circle (protected)
GET    /api/study-circles/:id     # Get circle details
POST   /api/study-circles/:id/join # Join circle (protected)
POST   /api/study-circles/:id/leave # Leave circle (protected)
GET    /api/study-circles/:id/posts # Get posts
POST   /api/study-circles/:id/posts # Create post (protected)
POST   /api/study-circles/posts/:postId/comment # Comment (protected)
POST   /api/study-circles/posts/:postId/upvote # Upvote (protected)
```

#### Mentors (`/api/mentors`)
```
GET    /api/mentors               # List mentors
GET    /api/mentors/:id           # Get mentor profile
POST   /api/mentors/apply         # Apply as mentor (protected)
POST   /api/mentors/:id/book-session # Book session (protected)
GET    /api/mentors/sessions/my-sessions # Get sessions (protected)
POST   /api/mentors/sessions/:id/rate # Rate session (protected)
```

#### Dashboard (`/api/dashboard`)
```
GET    /api/dashboard             # Get dashboard data (protected)
GET    /api/dashboard/analytics   # Get analytics (protected)
GET    /api/dashboard/deadlines   # Get upcoming deadlines (protected)
```

#### Gamification (`/api/gamification`)
```
GET    /api/gamification/leaderboard # Get leaderboard
GET    /api/gamification/badges   # Get available badges
GET    /api/gamification/my-badges # Get user badges (protected)
POST   /api/gamification/redeem   # Redeem coins (protected)
```

### Request/Response Format

#### Standard Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

#### Standard Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ /* validation errors (optional) */ ]
}
```

#### Pagination Pattern
```typescript
// Request
GET /api/notes?page=1&limit=20&sort=-createdAt&filter=subject:Math

// Response
{
  "success": true,
  "data": {
    "notes": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### API Client Usage (Frontend)

```typescript
// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
});

// Request interceptor - attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response.data, // Return data directly
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Making API Calls

```typescript
// GET request
const notes = await api.get('/notes');
const note = await api.get(`/notes/${id}`);

// POST request
const newNote = await api.post('/notes', formData);
await api.post(`/notes/${id}/rate`, { rating: 5 });

// PUT request
await api.put(`/notes/${id}`, updateData);

// DELETE request
await api.delete(`/notes/${id}`);

// With error handling
try {
  const data = await api.get('/notes');
  setNotes(data.notes);
} catch (error) {
  console.error('Failed to fetch notes:', error);
  // Error toast shown automatically by interceptor
}
```

---

## 🔐 Authentication & Security

### JWT Authentication Flow

1. **Registration/Login**
   - User submits credentials
   - Backend validates and creates JWT
   - Token returned to client
   - Client stores in localStorage

2. **Authenticated Requests**
   - Client attaches token in `Authorization: Bearer <token>` header
   - Backend middleware verifies token
   - User object attached to `req.user`
   - Controller accesses authenticated user

3. **Token Expiry**
   - Token expires after 7 days (configurable)
   - On 401 error, client redirects to login
   - Refresh token flow can be implemented

### Backend Auth Middleware

```typescript
// server/middleware/auth.ts
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request
    req.user = user;

    // Update last active timestamp
    user.lastActive = new Date();
    await user.save();

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

// Optional auth - allows both authenticated and public access
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    next(); // Continue without auth
  }
};
```

### Frontend Route Guards

```typescript
// src/App.tsx
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Usage in routes
<Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
```

### Security Best Practices

#### Password Security
```typescript
// Hash passwords with bcrypt (salt rounds: 10)
import bcrypt from 'bcryptjs';

const hashedPassword = await bcrypt.hash(password, 10);
const isMatch = await bcrypt.compare(password, user.password);
```

#### Input Validation
```typescript
// Use express-validator or manual validation
import { body, validationResult } from 'express-validator';

router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('fullName').trim().notEmpty()
], register);
```

#### CORS Configuration
```typescript
// server/index.ts
import cors from 'cors';

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

#### Environment Variables
- Never commit `.env` to git
- Use `.env.example` as template
- Change JWT secrets in production
- Use strong, random secrets (32+ characters)

#### SQL/NoSQL Injection Prevention
- Mongoose handles query sanitization
- Use parameterized queries
- Validate and sanitize user input

#### XSS Prevention
- React escapes values by default
- Sanitize HTML if using `dangerouslySetInnerHTML`
- Use Content Security Policy headers

---

## 💾 Database Patterns

### Mongoose Schema Conventions

```typescript
import mongoose, { Schema, Document } from 'mongoose';

// 1. Define TypeScript interface
export interface IUser extends Document {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Create schema
const UserSchema = new Schema<IUser>({
  fullName: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include in queries by default
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 3. Add indexes
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });

// 4. Add virtuals, methods, statics (if needed)
UserSchema.virtual('initials').get(function() {
  return this.fullName.split(' ').map(n => n[0]).join('');
});

// 5. Export model
export default mongoose.model<IUser>('User', UserSchema);
```

### Common Schema Patterns

#### References (Population)
```typescript
// Reference another document
creator: {
  type: Schema.Types.ObjectId,
  ref: 'User',
  required: true
},

// Usage
const note = await Note.findById(id).populate('creator', 'fullName email');
```

#### Embedded Subdocuments
```typescript
// For one-to-few relationships
skills: [{
  name: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  endorsements: { type: Number, default: 0 }
}]
```

#### Enums
```typescript
status: {
  type: String,
  enum: ['active', 'inactive', 'pending'],
  default: 'active'
}
```

#### Default Values
```typescript
gamification: {
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  coins: { type: Number, default: 0 },
  streak: {
    login: { type: Number, default: 0 },
    study: { type: Number, default: 0 }
  }
}
```

#### Calculated Fields
```typescript
// Stored calculation
profileCompleteness: {
  type: Number,
  default: 0,
  min: 0,
  max: 100
},

// Virtual calculation (not stored)
UserSchema.virtual('xpForNextLevel').get(function() {
  return this.gamification.level * 100;
});
```

### Query Patterns

```typescript
// Find with filters
const notes = await Note.find({
  subject: 'Mathematics',
  status: 'active'
});

// Find with population
const note = await Note.findById(id)
  .populate('creator', 'fullName email avatar')
  .populate('ratings.user', 'fullName');

// Find with sorting and limiting
const recentNotes = await Note.find()
  .sort({ createdAt: -1 })
  .limit(10);

// Find with pagination
const page = 1;
const limit = 20;
const skip = (page - 1) * limit;
const notes = await Note.find()
  .skip(skip)
  .limit(limit);

// Aggregation pipeline
const stats = await Note.aggregate([
  { $match: { status: 'active' } },
  { $group: {
    _id: '$subject',
    count: { $sum: 1 },
    avgRating: { $avg: '$averageRating' }
  }},
  { $sort: { count: -1 } }
]);

// Update operations
await User.findByIdAndUpdate(userId, {
  $push: { skills: newSkill },
  $inc: { 'gamification.xp': 10 }
});

// Atomic operations
await User.findByIdAndUpdate(userId, {
  $inc: { 'gamification.coins': -50 }, // Decrement
  $set: { 'profile.avatar': newAvatar }, // Set
  $push: { badges: badgeId } // Add to array
});
```

### Database Indexes

Add indexes for frequently queried fields:

```typescript
// Single field index
Schema.index({ email: 1 });
Schema.index({ createdAt: -1 });

// Compound index
Schema.index({ status: 1, createdAt: -1 });

// Text index for search
Schema.index({
  title: 'text',
  description: 'text',
  subject: 'text'
});

// Unique index
Schema.index({ email: 1 }, { unique: true });
```

---

## ⚠️ Error Handling

### Backend Error Handling

#### Try-Catch Pattern
```typescript
export const getNote = async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.json({
      success: true,
      data: note
    });
  } catch (error: any) {
    console.error('Error in getNote:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

#### Validation Errors
```typescript
// Mongoose validation error
catch (error: any) {
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((e: any) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  // ... other error handling
}
```

#### Custom Error Classes (Future)
```typescript
class NotFoundError extends Error {
  statusCode = 404;
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

class ValidationError extends Error {
  statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### Frontend Error Handling

#### API Error Interceptor
```typescript
// src/lib/api.ts
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Network error
    if (!error.response) {
      console.error('Network error:', error);
      toast.error('Unable to connect to server');
      return Promise.reject(error);
    }

    // HTTP errors
    const { status, data } = error.response;

    switch (status) {
      case 401:
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
        break;
      case 403:
        toast.error('Access denied');
        break;
      case 404:
        toast.error('Resource not found');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(data.message || 'An error occurred');
    }

    return Promise.reject(error);
  }
);
```

#### Component Error Handling
```typescript
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await api.get('/notes');
    setNotes(data.notes);
  } catch (err: any) {
    setError(err.response?.data?.message || 'Failed to load notes');
  } finally {
    setLoading(false);
  }
};

return (
  <div>
    {error && <ErrorMessage message={error} />}
    {loading && <LoadingSkeleton />}
    {!loading && !error && <NotesList notes={notes} />}
  </div>
);
```

#### React Error Boundary
```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Toast Notifications

```typescript
// src/components/ToastProvider.tsx
import { createContext, useContext, useState } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast['type']) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Usage
const { showToast } = useToast();
showToast('Note uploaded successfully!', 'success');
```

---

## 🧪 Testing Guidelines

### Testing Infrastructure

**Current Status:** Testing framework not yet implemented

**Recommended Setup:**
- **Frontend:** Vitest + React Testing Library
- **Backend:** Jest + Supertest
- **E2E:** Playwright or Cypress

### Testing Strategy (To Implement)

#### Unit Tests
```typescript
// Example: utils.test.ts
import { formatDate, calculateDaysUntil } from './utils';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2025-01-15');
    expect(formatDate(date)).toBe('Jan 15, 2025');
  });
});

describe('calculateDaysUntil', () => {
  it('calculates days until future date', () => {
    const future = new Date(Date.now() + 86400000 * 5); // 5 days
    expect(calculateDaysUntil(future)).toBe(5);
  });
});
```

#### Component Tests
```typescript
// Example: Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### API Tests
```typescript
// Example: auth.test.ts
import request from 'supertest';
import app from '../index';
import User from '../models/User';

describe('POST /api/auth/register', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('registers a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
    expect(response.body.data.user.email).toBe('test@example.com');
  });

  it('rejects duplicate email', async () => {
    await User.create({
      fullName: 'Existing User',
      email: 'test@example.com',
      password: 'hashedpassword'
    });

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});
```

### Manual Testing

Refer to `TESTING_GUIDE.md` for comprehensive manual testing procedures.

**Quick Test Checklist:**
1. ✅ Authentication (register, login, logout)
2. ✅ Profile management
3. ✅ Notes upload and viewing
4. ✅ Exam targeting and syllabus tracking
5. ✅ Mock test taking and submission
6. ✅ Opportunities browsing and application
7. ✅ Study circles and posts
8. ✅ Mentor booking
9. ✅ Dashboard data display
10. ✅ Error handling and loading states

---

## 🔧 Common Tasks

### Adding a New API Endpoint

1. **Define the route** (`server/routes/resource.ts`):
```typescript
import { Router } from 'express';
import { protect } from '../middleware/auth';
import { getItems, createItem } from '../controllers/resourceController';

const router = Router();

router.get('/', getItems);
router.post('/', protect, createItem);

export default router;
```

2. **Create controller** (`server/controllers/resourceController.ts`):
```typescript
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Resource from '../models/Resource';

export const getItems = async (req: AuthRequest, res: Response) => {
  try {
    const items = await Resource.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createItem = async (req: AuthRequest, res: Response) => {
  try {
    const item = await Resource.create({
      ...req.body,
      creator: req.user!._id
    });
    res.status(201).json({ success: true, data: item });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
```

3. **Register route** (`server/index.ts`):
```typescript
import resourceRoutes from './routes/resource';
app.use('/api/resources', resourceRoutes);
```

4. **Create frontend API call** (`src/pages/ResourcePage.tsx`):
```typescript
const fetchResources = async () => {
  try {
    const data = await api.get('/resources');
    setResources(data.data);
  } catch (error) {
    console.error('Failed to fetch resources:', error);
  }
};
```

### Adding a New Page

1. **Create page component** (`src/pages/NewPage.tsx`):
```typescript
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';

export default function NewPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/endpoint');
      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">New Page</h1>
      {/* Content */}
    </div>
  );
}
```

2. **Add route** (`src/App.tsx`):
```typescript
import NewPage from './pages/NewPage';

// Inside Routes
<Route
  path="/new-page"
  element={
    <ProtectedRoute>
      <NewPage />
    </ProtectedRoute>
  }
/>
```

3. **Add navigation link** (`src/components/layout/Navbar.tsx`):
```typescript
<Link
  to="/new-page"
  className="nav-link"
>
  New Page
</Link>
```

### Adding a Mongoose Model

1. **Create model file** (`server/models/NewModel.ts`):
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface INewModel extends Document {
  _id: string;
  title: string;
  creator: mongoose.Types.ObjectId;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const NewModelSchema = new Schema<INewModel>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes
NewModelSchema.index({ creator: 1, createdAt: -1 });
NewModelSchema.index({ status: 1 });

export default mongoose.model<INewModel>('NewModel', NewModelSchema);
```

2. **Use in controller**:
```typescript
import NewModel from '../models/NewModel';

const item = await NewModel.create({ title, creator: req.user!._id });
```

### Adding a UI Component

1. **Create component** (`src/components/ui/NewComponent.tsx`):
```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface NewComponentProps {
  variant?: 'default' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export function NewComponent({
  variant = 'default',
  size = 'md',
  children,
  className
}: NewComponentProps) {
  return (
    <div className={cn(
      'new-component',
      variant === 'outlined' && 'border',
      size === 'sm' && 'text-sm p-2',
      size === 'md' && 'text-base p-4',
      size === 'lg' && 'text-lg p-6',
      className
    )}>
      {children}
    </div>
  );
}
```

2. **Export from index** (if using barrel exports):
```typescript
// src/components/ui/index.ts
export { NewComponent } from './NewComponent';
```

3. **Use in pages**:
```typescript
import { NewComponent } from '@/components/ui/NewComponent';

<NewComponent variant="outlined" size="lg">
  Content here
</NewComponent>
```

### Updating Environment Variables

1. **Add to `.env.example`**:
```env
NEW_API_KEY=your-new-api-key
NEW_CONFIG=value
```

2. **Add to `.env`** (your local file):
```env
NEW_API_KEY=actual-api-key-value
```

3. **Use in backend**:
```typescript
const apiKey = process.env.NEW_API_KEY;
```

4. **Use in frontend** (Vite - must start with `VITE_`):
```typescript
const apiKey = import.meta.env.VITE_NEW_API_KEY;
```

---

## 🌿 Git Workflow

### Branch Strategy

**Main Branches:**
- `main` - Production-ready code
- Feature branches - `claude/<session-id>` for AI-assisted development

### Commit Message Conventions

Follow conventional commits format:

```
<type>(<scope>): <short description>

<longer description (optional)>

<breaking changes (optional)>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, no logic change)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
```bash
git commit -m "feat(notes): add AI summary generation"
git commit -m "fix(auth): resolve token expiry issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(dashboard): optimize data fetching logic"
```

### Workflow Steps

1. **Create/checkout feature branch**:
```bash
git checkout -b claude/feature-name
```

2. **Make changes and commit**:
```bash
git add .
git commit -m "feat(scope): description"
```

3. **Push to remote**:
```bash
git push -u origin claude/feature-name
```

4. **Create pull request** (if needed):
- Use GitHub interface or `gh` CLI
- Provide clear description of changes
- Reference any related issues

### Pre-commit Checklist

Before committing, ensure:
- [ ] Code compiles without errors (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] All imports are used
- [ ] No console.logs in production code (backend)
- [ ] Environment variables not exposed
- [ ] Comments added for complex logic
- [ ] TypeScript types are correct

---

## 🤖 AI Assistant Guidelines

### Core Principles

1. **Understand Before Changing**
   - Read relevant files before making changes
   - Understand the existing patterns
   - Ask clarifying questions if needed
   - Check related code to maintain consistency

2. **Follow Existing Patterns**
   - Match the coding style in the file you're editing
   - Use the same naming conventions
   - Follow the established architecture
   - Don't introduce new patterns without discussion

3. **Be Explicit and Clear**
   - Write clear commit messages
   - Add comments for complex logic
   - Explain your changes when asked
   - Document new APIs or components

4. **Test Your Changes**
   - Ensure code compiles
   - Check for TypeScript errors
   - Test the feature manually if possible
   - Consider edge cases

5. **Security First**
   - Never expose sensitive data
   - Validate all user input
   - Use parameterized queries
   - Follow authentication patterns
   - Don't weaken existing security

### Specific Guidelines for This Project

#### When Adding Features

1. **Backend Feature:**
   - Create model if needed (with TypeScript interface)
   - Add route with appropriate middleware
   - Implement controller with error handling
   - Add indexes to schema
   - Test endpoint manually

2. **Frontend Feature:**
   - Create page component with proper structure
   - Add route to App.tsx
   - Use existing UI components
   - Implement loading and error states
   - Add navigation link if needed

3. **Full-Stack Feature:**
   - Start with data model (backend)
   - Create API endpoints
   - Test with curl/Postman
   - Build frontend interface
   - Connect frontend to API
   - Test end-to-end

#### When Fixing Bugs

1. **Identify the root cause** - Don't just patch symptoms
2. **Check related code** - Ensure fix doesn't break other features
3. **Add error handling** - Prevent similar issues
4. **Test the fix** - Verify it works
5. **Document if needed** - Add comments if the fix is non-obvious

#### When Refactoring

1. **Don't change behavior** - Only improve structure
2. **Keep changes focused** - One refactor at a time
3. **Maintain types** - Update TypeScript types
4. **Test thoroughly** - Ensure nothing broke
5. **Update documentation** - If public APIs changed

### File Reading Strategy

**Before making changes, read:**
1. The file you're modifying
2. Related model/controller/component files
3. Similar implementations for patterns
4. Type definitions and interfaces

**Example workflow for adding a feature:**
```
1. Read the task/requirement
2. Read README.md and this CLAUDE.md
3. Read related model files
4. Read similar controller implementations
5. Read API client (src/lib/api.ts)
6. Implement the feature
7. Test the implementation
```

### Common Pitfalls to Avoid

❌ **Don't:**
- Make assumptions about data structures
- Skip error handling
- Ignore TypeScript errors
- Mix patterns (e.g., different auth methods)
- Remove existing functionality without understanding
- Commit commented-out code
- Leave TODOs without implementation
- Break existing API contracts

✅ **Do:**
- Read existing code first
- Follow established patterns
- Add comprehensive error handling
- Write TypeScript-compliant code
- Test your changes
- Clean up unused imports
- Add meaningful comments
- Maintain backward compatibility

### Response Format for Users

When explaining changes:

```markdown
## Changes Made

### Backend
- Added new endpoint `POST /api/resource/:id/action`
- Created `ActionController.ts` with error handling
- Updated `Resource` model with new field `actionCount`

### Frontend
- Created `ActionButton` component
- Integrated action API call in `ResourceDetail.tsx`
- Added loading state and error handling

### Files Modified
- `server/routes/resource.ts` - Added action route
- `server/controllers/resourceController.ts` - New controller
- `server/models/Resource.ts` - Added actionCount field
- `src/pages/ResourceDetail.tsx` - Integrated action button

### Testing
- Tested endpoint with curl
- Verified frontend integration
- Confirmed error handling works
```

### When Stuck or Uncertain

1. **Ask questions** instead of guessing
2. **Read more context** from related files
3. **Look for similar implementations** in the codebase
4. **Suggest alternatives** if unsure about approach
5. **Explain limitations** if task is unclear

### Handling Incomplete Information

If a requirement is ambiguous:

```
I understand you want to [feature], but I need clarification on:

1. [Question about data structure]
2. [Question about user flow]
3. [Question about permissions]

Based on the existing codebase, I see these patterns:
- [Pattern 1]
- [Pattern 2]

Should I follow [Pattern 1] or [Pattern 2]? Or would you prefer a different approach?
```

---

## 📚 Additional Resources

### Project Documentation
- `README.md` - Project overview and setup
- `TESTING_GUIDE.md` - Comprehensive testing procedures
- `CLAUDE.md` - This file

### External Documentation
- [React 19 Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JWT.io](https://jwt.io/introduction)

### Helpful Commands

```bash
# Find usage of a function/component
grep -r "functionName" src/

# Find all imports of a module
grep -r "from '@/lib/api'" src/

# Count lines of code
find src/ -name "*.tsx" -o -name "*.ts" | xargs wc -l

# List all API routes
grep -r "router\." server/routes/

# Check MongoDB collections
mongosh student-hub --eval "show collections"

# View server logs
npm run server 2>&1 | tee server.log
```

---

## 📝 Changelog

### Version 2.0 (2025-11-14)
- Complete codebase documentation
- Architecture patterns documented
- Development workflows established
- Security guidelines added
- Testing strategies outlined

### Version 1.0 (Initial)
- Basic project structure
- Core features implemented
- Authentication system
- Database models defined

---

## 🎯 Quick Reference

### Most Important Files
1. `server/index.ts` - Backend entry point
2. `src/App.tsx` - Frontend routing
3. `src/lib/api.ts` - API client configuration
4. `server/middleware/auth.ts` - Authentication logic
5. `src/store/authStore.ts` - Auth state management

### Most Common Commands
```bash
npm run dev          # Start frontend
npm run server       # Start backend
npm run build        # Build for production
npm run lint         # Check code quality
```

### Quick Troubleshooting
- **MongoDB error:** Check if MongoDB is running
- **Port conflict:** Change PORT in `.env`
- **Auth fails:** Check JWT_SECRET matches
- **CORS error:** Verify CLIENT_URL in `.env`
- **Build error:** Run `npm install`, check TypeScript errors

---

**Last Updated:** 2025-11-14
**Maintained By:** Development Team
**For Questions:** Refer to project documentation or create an issue

---

This guide is a living document. Update it as the project evolves to keep it accurate and useful for both AI assistants and human developers.
