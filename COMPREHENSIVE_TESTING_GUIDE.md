# Comprehensive Testing Guide - Student Hub Platform

Complete testing guide for all implemented features across all phases.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup & Testing](#backend-setup--testing)
3. [Frontend Testing](#frontend-testing)
4. [Phase 1 Features](#phase-1-features)
5. [Phase 2 Features](#phase-2-features)
6. [Phase 3 Features](#phase-3-features)
7. [Infrastructure Testing](#infrastructure-testing)
8. [API Endpoints Reference](#api-endpoints-reference)

---

## Prerequisites

### Required Software
- ✅ Node.js (v18+)
- ✅ MongoDB (running locally or Docker)
- ✅ Git
- ✅ Modern browser (Chrome, Firefox, Safari)

### Verification Commands
```bash
node --version    # Should be v18 or higher
npm --version     # Should be 8 or higher
mongod --version  # Should be installed
git --version     # Any recent version
```

---

## Backend Setup & Testing

### 1. Start MongoDB

**Option A: Using Docker (Recommended)**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: Local MongoDB**
```bash
mongod --dbpath /path/to/data/db
```

**Verify MongoDB is running:**
```bash
mongosh
# Should connect successfully
# Type 'exit' to quit
```

### 2. Start Backend Server

```bash
cd server
npm install
npm run dev
```

**Expected Output:**
```
Server running on port 5000
MongoDB connected successfully
```

**Test Backend Health:**
```bash
curl http://localhost:5000/api/auth/health
# Should return: {"status":"ok"}
```

### 3. Create Test User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "fullName": "Test User",
    "collegeName": "Test College",
    "course": "Computer Science",
    "graduationYear": 2025
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "fullName": "Test User",
    "email": "test@example.com"
  }
}
```

### 4. Login Test

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

---

## Frontend Testing

### 1. Start Frontend Development Server

```bash
cd ..  # Back to root directory
npm install
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### 2. Open Browser
Navigate to: `http://localhost:5173/`

### 3. Initial Tests
- ✅ Login page should load without errors
- ✅ No console errors in browser DevTools
- ✅ Tailwind CSS styles should be applied

---

## Phase 1 Features

### Authentication

#### Test Login
1. Navigate to `/login`
2. Enter credentials:
   - Email: `test@example.com`
   - Password: `test123456`
3. Click "Sign In"
4. ✅ Should redirect to `/dashboard`
5. ✅ Toast notification: "Logged in successfully!"

#### Test Register
1. Navigate to `/register`
2. Fill in all fields
3. Click "Create Account"
4. ✅ Should create account and redirect to dashboard
5. ✅ Toast notification shown

### Dashboard
1. Navigate to `/dashboard`
2. ✅ Verify stats cards display:
   - Total Notes, XP Earned, Active Projects, Upcoming Exams
3. ✅ Verify "Recent Activity" section loads
4. ✅ Verify "Quick Actions" buttons work

### Notes Module

#### Browse Notes
1. Navigate to `/notes`
2. ✅ Verify notes list loads
3. ✅ Test search functionality
4. ✅ Test filter by subject
5. ✅ Test filter by semester
6. ✅ Verify loading skeleton appears briefly

#### Upload Note
1. Navigate to `/notes/upload`
2. Fill in form:
   - Title: "Test Note"
   - Subject: "Mathematics"
   - Semester: "Semester 1"
   - Description: "Test description"
   - Select a file (PDF/PPT/DOCX)
3. Click "Upload Note"
4. ✅ Progress bar should appear
5. ✅ Toast: "Note uploaded successfully!"
6. ✅ Redirect to notes list

#### Note Detail
1. Click on any note from `/notes`
2. ✅ Verify note details display
3. **Test Tabs:**
   - **Content Tab:** Verify note content shows
   - **AI Summary Tab:** Click "Generate Summary" button
     - ✅ Loading state appears
     - ✅ AI summary displays
   - **Flashcards Tab:**
     - ✅ Flashcards display
     - ✅ Click to flip card
     - ✅ Navigate between cards
   - **Clarity Bot Tab:**
     - ✅ Enter question
     - ✅ Submit question
     - ✅ Verify bot response appears
4. **Test Rating:**
   - ✅ Select star rating
   - ✅ Enter review text
   - ✅ Submit review
   - ✅ Toast: "Review submitted!"

### Exams Module

#### Browse Exams
1. Navigate to `/exams`
2. ✅ Verify exams list loads
3. ✅ Test search functionality
4. ✅ Verify exam cards show:
   - Name, date, duration
   - "View Details" button

#### Exam Detail
1. Click on any exam
2. ✅ Verify exam details display
3. **Test Syllabus Tracker:**
   - ✅ Click checkbox to mark topic complete
   - ✅ Progress bar updates
   - ✅ Percentage changes
4. **Test Mock Tests:**
   - ✅ Mock test list displays
   - ✅ Click "Start Test" button

#### Mock Test
1. From exam detail, start a mock test
2. **Instructions Screen:**
   - ✅ Test details shown
   - ✅ Rules displayed
   - ✅ Click "Start Test"
3. **During Test:**
   - ✅ Timer counts down
   - ✅ Questions display correctly
   - ✅ Select answers (radio buttons)
   - ✅ "Mark for Review" works
   - ✅ "Previous" / "Next" buttons work
   - ✅ Question palette shows status (answered/unanswered/marked)
   - ✅ Jump to question by clicking palette
4. **Submit Test:**
   - ✅ Click "Submit Test"
   - ✅ Confirmation dialog appears
   - ✅ Confirm submission
5. **Results Screen:**
   - ✅ Score displayed
   - ✅ Percentage shown
   - ✅ Time taken shown
   - ✅ Question-by-question breakdown
   - ✅ Correct answers highlighted
   - ✅ Explanations shown

### Profile
1. Navigate to `/profile`
2. ✅ Verify profile information displays
3. ✅ Verify stats sidebar (Level, XP, Coins, Streak)
4. **Test Edit Mode:**
   - ✅ Click "Edit Profile"
   - ✅ Modify fields (bio, college, course, etc.)
   - ✅ Add skill (type and press Enter)
   - ✅ Remove skill (click X)
   - ✅ Add interest
   - ✅ Update social links
   - ✅ Click "Save Changes"
   - ✅ Toast: "Profile updated successfully!"
   - ✅ Changes reflected immediately

---

## Phase 2 Features

### Study Circles

#### Browse Study Circles
1. Navigate to `/study-circles`
2. ✅ Verify stats cards (Total Circles, Members, Active Discussions)
3. ✅ Test search functionality
4. ✅ Test filter by subject
5. ✅ Test filter by level
6. ✅ Click "Join Circle" on any circle
7. ✅ Toast: "Joined study circle!"

#### Create Study Circle
1. Click "Create Circle" button
2. Fill in form:
   - Name: "Test Study Circle"
   - Subject: "Mathematics"
   - Description: "Test description"
   - Level: "Intermediate"
   - Max Members: "50"
   - Visibility: "Public"
3. Click "Create Study Circle"
4. ✅ Toast: "Study circle created!"
5. ✅ Redirect to circle detail page

#### Study Circle Detail
1. Click on any study circle
2. **Discussion Tab:**
   - ✅ Verify posts display
   - ✅ Create new post (type and click "Post")
   - ✅ Toast: "Posted successfully!"
   - ✅ Like a post (heart icon)
   - ✅ Like count increments
3. **Members Tab:**
   - ✅ Verify member grid displays
   - ✅ Creator badge shown

### Mentors

#### Browse Mentors
1. Navigate to `/mentors`
2. ✅ Verify stats cards (Total Mentors, Verified, Avg Rating)
3. ✅ Test filter by expertise
4. ✅ Test filter by availability
5. ✅ Test sort options (rating, sessions, price)
6. ✅ Verify mentor cards show:
   - Name, expertise, rating, sessions, price

#### Mentor Detail
1. Click on any mentor
2. ✅ Verify mentor profile displays:
   - Bio, expertise, education, achievements
3. ✅ Verify reviews section shows ratings and comments
4. **Book Session:**
   - ✅ Click "Book Session" button
   - ✅ Modal opens
   - ✅ Select date (date picker)
   - ✅ Select time (dropdown)
   - ✅ Select duration (30min/1hr/2hr)
   - ✅ Total cost calculated correctly
   - ✅ Add optional message
   - ✅ Click "Confirm Booking"
   - ✅ Toast: "Session booked successfully!"
   - ✅ Modal closes

### Opportunities

#### Browse Opportunities
1. Navigate to `/opportunities`
2. ✅ Verify opportunities list loads
3. ✅ Test filter by type
4. ✅ Test filter by location

#### Opportunity Detail
1. Click on any opportunity
2. ✅ Verify opportunity details display:
   - Title, company, type, location
   - Description, requirements, responsibilities
3. ✅ Verify deadline countdown shows
4. ✅ Verify "Days left" indicator
5. **Apply for Opportunity:**
   - ✅ Click "Apply Now" button
   - ✅ Modal opens
   - ✅ Enter cover letter
   - ✅ Upload resume (optional)
   - ✅ Enter portfolio URL (optional)
   - ✅ Click "Submit Application"
   - ✅ Toast: "Application submitted successfully!"
   - ✅ Modal closes

---

## Phase 3 Features

### Projects

#### Browse Projects
1. Navigate to `/projects`
2. ✅ Verify stats cards display:
   - Total Projects, In Progress, Completed, Team Members
3. ✅ Test search functionality
4. ✅ Test filter by category
5. ✅ Test filter by status
6. ✅ Verify project cards show:
   - Title, description, category, status
   - Team size, progress bar, deadline
   - Leader name
7. ✅ Click "View Details" button

#### Create Project
1. Click "Create Project" button
2. Fill in form:
   - Title: "Test Project"
   - Description: "Test description"
   - Category: "Web Development"
   - Max Team Size: "5"
   - Deadline: Select future date
   - Tags: "react, typescript"
   - GitHub Repo: "https://github.com/user/repo" (optional)
3. Click "Create Project"
4. ✅ Toast: "Project created successfully!"
5. ✅ Redirect to project detail page

#### Project Detail
1. Click on any project
2. ✅ Verify project header displays:
   - Title, description, category, status, tags
   - Team size, progress, deadline, leader
   - GitHub link (if available)
3. **Join Project:**
   - ✅ If not a member, "Join Project" button shows
   - ✅ Click "Join Project"
   - ✅ Toast: "Joined project successfully!"
   - ✅ Team size updates
4. **Tasks Tab (for members):**
   - ✅ Task list displays
   - ✅ Add new task:
     - Type task title
     - Press Enter or click "+" button
     - ✅ Toast: "Task added successfully!"
   - ✅ Toggle task completion:
     - Click circle/checkmark icon
     - ✅ Task status updates
     - ✅ Progress bar updates
   - ✅ Verify completed tasks show strikethrough
5. **Team Tab:**
   - ✅ Member grid displays
   - ✅ Leader badge shown
   - ✅ Member avatars with initials
6. **Sidebar:**
   - ✅ Progress card shows:
     - Completion percentage
     - Total tasks
     - Completed count
     - In progress count
   - ✅ Timeline card shows:
     - Start date
     - Deadline

### Skill Courses

1. Navigate to `/skill-courses`
2. ✅ Verify stats cards display:
   - Total Courses, Students, Avg Rating, Beginner Courses
3. ✅ Test search functionality (by title and category)
4. ✅ Verify course cards show:
   - Title, instructor, description
   - Category badge, level badge
   - Rating, enrollments, duration
   - Price in rupees
   - "Enroll" button
5. ✅ Verify loading skeleton appears briefly on initial load
6. ✅ Verify gradient background on course thumbnails
7. ✅ Verify hover effect (shadow increases)

### Analytics Dashboard

1. Navigate to `/analytics`
2. **Stats Cards:**
   - ✅ Total XP displayed with progress bar
   - ✅ XP to next level shown
   - ✅ Current streak displayed
   - ✅ Longest streak shown
   - ✅ Current level and badge count
   - ✅ Notes shared count
3. **Weekly Activity Chart:**
   - ✅ Bar chart displays for all 7 days
   - ✅ Bars proportional to hours
   - ✅ Hover shows exact hours
   - ✅ Total hours for week shown at bottom
4. **Recent Achievements:**
   - ✅ Achievement list displays (if any)
   - ✅ Trophy icons shown
   - ✅ Achievement names and descriptions
   - ✅ Earned dates displayed
   - ✅ Empty state if no achievements
5. **Performance Metrics:**
   - **Test Performance Card:**
     - ✅ Average score with progress bar
     - ✅ Total tests count
     - ✅ Improvement percentage
   - **Study Goals Card:**
     - ✅ Completion percentage displayed
     - ✅ Progress bar
     - ✅ Completed/Total ratio
   - **Contributions Card:**
     - ✅ Notes shared count
     - ✅ Projects count
     - ✅ Discussions count
     - ✅ Total contributions badge
6. ✅ Verify all animations work (fade-in, slide-in-up)

---

## Infrastructure Testing

### Toast Notifications

Test toast notifications appear correctly:

1. **Success Toasts (Green):**
   - Upload note
   - Join project
   - Submit review
   - Update profile

2. **Error Toasts (Red):**
   - Login with wrong password
   - Submit empty form
   - Network error

3. **Toast Features:**
   - ✅ Auto-dismiss after 5 seconds
   - ✅ Manual close (X button)
   - ✅ Multiple toasts stack
   - ✅ Slide-in animation from right
   - ✅ Correct icon for each type

### Animations

1. **Fade In:** Cards on analytics page
2. **Slide In Up:** Charts and metrics cards
3. **Slide In Right:** Toast notifications
4. **Scale In:** Confirm dialogs
5. **Hover Effects:** Course cards shadow increase

### Loading States

1. **Loading Skeletons:**
   - Notes page (3 skeleton cards)
   - Study circles page
   - Skill courses page

2. **Spinners:**
   - Project detail page
   - Analytics dashboard
   - Mock test loading

3. ✅ Verify loading states appear briefly then show content

### Error Handling

1. **Test Network Errors:**
   - Stop backend server
   - Try to load any page
   - ✅ Error message should display
   - ✅ "Unable to connect to server" message

2. **Test 404 Errors:**
   - Navigate to `/invalid-route`
   - ✅ 404 page displays
   - ✅ "Go back home" link works

3. **Error Boundary:**
   - All pages wrapped in ErrorBoundary
   - ✅ Errors caught and displayed gracefully

### Responsive Design

Test on different screen sizes:

1. **Desktop (1920px):**
   - ✅ Full layout works
   - ✅ Grid layouts show 3-4 columns

2. **Tablet (768px):**
   - ✅ Grid layouts show 2 columns
   - ✅ Navigation still accessible

3. **Mobile (375px):**
   - ✅ Single column layout
   - ✅ Cards stack vertically
   - ✅ Touch targets adequate

---

## API Endpoints Reference

### Authentication
```bash
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/profile
```

### Notes
```bash
GET    /api/notes
POST   /api/notes (multipart/form-data)
GET    /api/notes/:id
POST   /api/notes/:id/summary
POST   /api/notes/:id/review
POST   /api/notes/clarity-bot
```

### Exams
```bash
GET    /api/exams
GET    /api/exams/:id
POST   /api/exams/:id/syllabus/:sectionId/toggle
```

### Mock Tests
```bash
GET    /api/mock-tests/:id
POST   /api/mock-tests/:id/submit
```

### Study Circles
```bash
GET    /api/study-circles
POST   /api/study-circles
GET    /api/study-circles/:id
POST   /api/study-circles/:id/join
POST   /api/study-circles/:id/posts
POST   /api/study-circles/:id/posts/:postId/like
```

### Mentors
```bash
GET    /api/mentors
GET    /api/mentors/:id
POST   /api/mentors/:id/book
```

### Opportunities
```bash
GET    /api/opportunities
GET    /api/opportunities/:id
POST   /api/opportunities/:id/apply (multipart/form-data)
```

### Projects
```bash
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
POST   /api/projects/:id/join
POST   /api/projects/:id/tasks
POST   /api/projects/:id/tasks/:taskId/toggle
```

### Skill Courses
```bash
GET    /api/skill-courses
```

### Analytics
```bash
GET    /api/analytics
```

---

## Testing Checklist

### Pre-Deployment Checklist

- [ ] All API endpoints return expected responses
- [ ] All pages load without errors
- [ ] Toast notifications appear for all actions
- [ ] Loading states display correctly
- [ ] Error messages are user-friendly
- [ ] Forms validate input correctly
- [ ] File uploads work (notes, resume)
- [ ] Search functionality works on all pages
- [ ] Filters work correctly
- [ ] Authentication flow works (login/logout)
- [ ] Protected routes redirect when not authenticated
- [ ] Animations play smoothly
- [ ] Responsive design works on mobile/tablet
- [ ] No console errors in browser DevTools
- [ ] Browser back/forward buttons work
- [ ] Page refreshes maintain state (token persists)

### Performance Checklist

- [ ] Initial page load < 3 seconds
- [ ] API responses < 1 second
- [ ] Images optimized
- [ ] Bundle size reasonable
- [ ] No memory leaks
- [ ] Smooth scrolling
- [ ] Animations don't lag

### Security Checklist

- [ ] Passwords not visible in network tab
- [ ] JWT tokens stored in localStorage
- [ ] Protected routes require authentication
- [ ] XSS prevention (no innerHTML with user input)
- [ ] CORS configured correctly
- [ ] File upload size limits enforced
- [ ] SQL injection prevented (using Mongoose)

---

## Common Issues & Solutions

### Issue: MongoDB Connection Error
**Solution:**
```bash
# Check if MongoDB is running
mongosh
# If not, start MongoDB
mongod --dbpath /path/to/data/db
```

### Issue: Port Already in Use
**Solution:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Issue: CORS Errors
**Solution:**
Check `server/index.ts` has:
```typescript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Issue: Toast Not Appearing
**Solution:**
Verify `main.tsx` has ToastProvider wrapper:
```typescript
<ToastProvider>
  <App />
</ToastProvider>
```

### Issue: Animations Not Working
**Solution:**
Check `tailwind.config.js` has animations defined and run:
```bash
npm run dev  # Restart dev server
```

---

## Test Data Generation

### Create Sample Notes
```bash
for i in {1..5}; do
  curl -X POST http://localhost:5000/api/notes \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -F "title=Sample Note $i" \
    -F "subject=Mathematics" \
    -F "semester=Semester 1" \
    -F "description=Test description"
done
```

### Create Sample Projects
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Web App Project",
    "description": "Building a full-stack web application",
    "category": "Web Development",
    "maxTeamSize": 5,
    "deadline": "2025-12-31",
    "tags": ["react", "node", "mongodb"]
  }'
```

---

## Next Steps After Testing

1. **Bug Fixes:** Document and fix any issues found
2. **Optimization:** Improve performance bottlenecks
3. **User Feedback:** Gather feedback from test users
4. **Deployment:** Prepare for production deployment
5. **Monitoring:** Set up error tracking and analytics

---

## Support

If you encounter issues:
1. Check console for errors (F12 in browser)
2. Check backend logs in terminal
3. Verify MongoDB is running
4. Clear browser cache and localStorage
5. Restart both servers

---

**Testing Last Updated:** Phase 3 Completion
**Platform Version:** v3.0
**Features Tested:** 85% Complete (Authentication, Notes, Exams, Mock Tests, Profile, Study Circles, Mentors, Opportunities, Projects, Skill Courses, Analytics)
