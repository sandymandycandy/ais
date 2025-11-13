# 🎓 Student Hub Platform

> All-in-One Student Hub - A comprehensive digital platform revolutionizing how students manage their academic journey, career preparation, and skill development.

## 🌟 Features

### ✅ Implemented Core Features

#### 1. **Smart Student Profile**
- Comprehensive digital identity with academic and professional information
- Skills management with endorsements
- Achievement timeline
- Resume builder and storage
- Profile completeness tracking
- Gamification (XP, levels, coins, badges)

#### 2. **AI-Powered Smart Notes Hub**
- Universal file upload (PDF, PPT, DOCX, images)
- Smart organization and categorization
- AI-powered summarization (ready for OpenAI integration)
- Clarity Bot for Q&A (placeholder implemented)
- Rating and review system
- Search and filter capabilities

#### 3. **Comprehensive Exam Preparation Zone**
- Support for multiple exam categories (Government, Engineering, Medical, Management, Law)
- Complete syllabus tracking
- Mock test engine with three types (Public, Private, AI-Generated)
- Performance analytics
- Leaderboards and rankings
- Previous year papers database

#### 4. **Opportunities Portal**
- Centralized listing of internships, jobs, scholarships, competitions
- Advanced filtering by type, location, domain
- Deadline countdown timers
- Application tracking system
- Bookmark functionality
- Eligibility checker

#### 5. **Mentorship Platform**
- Verified mentor profiles
- Session booking system
- Rating and review system
- Specialization-based matching
- Session history tracking

#### 6. **Community & Study Circles**
- Create and join study groups
- Discussion forums with upvoting
- Post doubts and get answers
- Resource sharing
- Real-time collaboration support

#### 7. **Personal Dashboard**
- Comprehensive overview of all activities
- Today's tasks and reminders
- Upcoming deadlines
- Recent test performance
- Quick actions
- Progress tracking

#### 8. **Skill Learning Section**
- Course catalog
- Enrollment system
- Progress tracking
- Project submissions
- Certifications

#### 9. **Gamification System**
- XP and level progression
- Streak tracking (login, study, quiz)
- Badge system
- Leaderboards (global, exam-wise, college-wise)
- Virtual coins and rewards

#### 10. **Project Collaboration**
- Team project management
- Task tracking with Kanban board
- Milestone management
- Startup ecosystem support
- Project showcase

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **Bcrypt** - Password hashing

### AI Integration (Ready to activate)
- **OpenAI API** - AI summarization and Clarity Bot
- **Vector Database** - For semantic search (pgvector or Pinecone)

## 📁 Project Structure

```
ais/
├── server/                 # Backend (Express + MongoDB)
│   ├── config/            # Database configuration
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Auth middleware
│   ├── utils/             # Utility functions
│   └── index.ts           # Server entry point
│
├── src/                   # Frontend (React + TypeScript)
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   └── layout/       # Layout components
│   ├── pages/            # Page components
│   ├── store/            # Zustand state management
│   ├── lib/              # Utilities and API client
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
│
├── .env                  # Environment variables
├── package.json          # Dependencies
└── README.md            # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6+ (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ais
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/student-hub

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# OpenAI (Optional - for AI features)
OPENAI_API_KEY=your-openai-api-key

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Create a `.env.local` file for frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start MongoDB**

If using local MongoDB:
```bash
mongod
```

Or use MongoDB Atlas cloud database.

5. **Run the application**

Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/avatar` - Upload avatar
- `POST /api/users/skills` - Add skill
- `POST /api/users/achievements` - Add achievement

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Upload note
- `GET /api/notes/:id` - Get note by ID
- `POST /api/notes/:id/summary` - Generate AI summary
- `POST /api/notes/clarity-bot` - Ask Clarity Bot

### Exams
- `GET /api/exams` - Get all exams
- `GET /api/exams/:id` - Get exam details
- `POST /api/exams/:id/target` - Target an exam
- `GET /api/exams/my-targets` - Get targeted exams

### Mock Tests
- `GET /api/mock-tests` - Get all tests
- `POST /api/mock-tests` - Create test
- `POST /api/mock-tests/:id/start` - Start test
- `POST /api/mock-tests/:id/submit` - Submit test
- `GET /api/mock-tests/:id/leaderboard` - Get leaderboard

### Opportunities
- `GET /api/opportunities` - Get all opportunities
- `GET /api/opportunities/:id` - Get opportunity details
- `POST /api/opportunities/:id/apply` - Apply to opportunity
- `GET /api/opportunities/my-applications` - Get applications

### Study Circles
- `GET /api/study-circles` - Get all circles
- `POST /api/study-circles` - Create circle
- `POST /api/study-circles/:id/join` - Join circle
- `POST /api/study-circles/:id/posts` - Create post

### Mentors
- `GET /api/mentors` - Get all mentors
- `POST /api/mentors/apply` - Apply as mentor
- `POST /api/mentors/:id/book-session` - Book session
- `GET /api/mentors/sessions/my-sessions` - Get sessions

### Dashboard
- `GET /api/dashboard` - Get dashboard data
- `GET /api/dashboard/analytics` - Get analytics
- `GET /api/dashboard/deadlines` - Get deadlines

### Gamification
- `GET /api/gamification/leaderboard` - Get leaderboard
- `GET /api/gamification/badges` - Get badges
- `POST /api/gamification/redeem` - Redeem coins

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation
- CORS configuration
- Rate limiting ready
- XSS protection

## 🚧 Roadmap

### Phase 1: MVP ✅ (Current)
- Core authentication
- Basic notes management
- Exam listing
- Opportunities portal
- Dashboard

### Phase 2: Enhanced Features (Next)
- AI integration (OpenAI)
- Advanced mock test analytics
- Real-time chat in study circles
- Video integration for mentorship
- Advanced gamification

### Phase 3: Scale & Optimize
- Mobile apps (React Native)
- Performance optimization
- Advanced analytics
- Regional language support
- Institutional partnerships

## 📊 Database Schema

### Core Collections
- **users** - User profiles and authentication
- **notes** - Study materials with AI features
- **exams** - Exam information and syllabus
- **mocktests** - Test questions and results
- **opportunities** - Jobs, internships, scholarships
- **studycircles** - Community groups
- **posts** - Discussion threads
- **mentors** - Mentor profiles
- **mentorsessions** - Booking and session data
- **skillcourses** - Course catalog
- **projects** - Team projects
- **badges** - Achievement badges

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI inspiration from modern edtech platforms
- Community feedback and suggestions

---

**Note**: This is a comprehensive educational platform. Some AI features require OpenAI API key to be fully functional. The platform is designed to scale and can handle thousands of concurrent users with proper infrastructure.
