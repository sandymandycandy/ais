# 🧪 Testing Guide - Student Hub Platform

This guide will walk you through testing the entire Student Hub Platform, from backend to frontend.

---

## 📋 Prerequisites Check

Before testing, ensure you have:

```bash
# Check Node.js (should be v18+)
node --version

# Check npm
npm --version

# Check if dependencies are installed
ls node_modules/ | wc -l  # Should show 400+ packages
```

If dependencies are missing:
```bash
npm install
```

---

## 🗄️ Step 1: Set Up MongoDB

### Option A: MongoDB with Docker (Recommended)

```bash
# Start MongoDB container
npm run mongo:docker

# Wait 5 seconds for MongoDB to start
sleep 5

# Verify it's running
docker ps | grep mongodb
```

**Update `.env` file:**
```env
MONGODB_URI=mongodb://admin:password123@localhost:27017/student-hub?authSource=admin
```

### Option B: Local MongoDB Installation

**Install MongoDB:**
```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb-org

# macOS
brew install mongodb-community@6.0

# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community@6.0  # macOS
```

**Update `.env` file:**
```env
MONGODB_URI=mongodb://localhost:27017/student-hub
```

### Option C: MongoDB Atlas (Cloud)

1. Create free cluster at https://cloud.mongodb.com
2. Get connection string
3. Update `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/student-hub?retryWrites=true&w=majority
```

---

## 🚀 Step 2: Start the Backend Server

Open a new terminal and run:

```bash
npm run server
```

**Expected output:**
```
🚀 Server running on port 5000
📍 Environment: development
✅ MongoDB Connected: 127.0.0.1
```

### Troubleshooting Backend

**Error: MongoDB connection failed**
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# Or with Docker
docker logs mongodb
```

**Error: Port 5000 already in use**
```bash
# Find what's using port 5000
lsof -i :5000

# Change port in .env
PORT=5001
```

---

## 🎨 Step 3: Start the Frontend

Open a **second terminal** and run:

```bash
npm run dev
```

**Expected output:**
```
  VITE v7.2.2  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

Frontend will be available at: **http://localhost:5173**

---

## ✅ Step 4: Test Authentication Flow

### 1. Register a New User

1. Open http://localhost:5173
2. Click **"Sign up"** or go to `/register`
3. Fill in the form:
   - Full Name: Test User
   - Email: test@example.com
   - Password: password123
   - College: Test College
   - Course: B.Tech CSE
   - Year: 3
4. Click **"Create Account"**

**Expected:** Redirect to `/dashboard` with welcome message

### 2. Logout and Login

1. Click your profile dropdown → **Logout**
2. Go to `/login`
3. Enter:
   - Email: test@example.com
   - Password: password123
4. Click **"Sign In"**

**Expected:** Redirect to `/dashboard` with your profile data

### 3. Verify JWT Token

```bash
# In browser console (F12)
localStorage.getItem('token')
# Should show a JWT token string
```

---

## 📝 Step 5: Test Notes Features

### Upload a Note

1. Go to **Notes** page (`/notes`)
2. Click **"Upload Notes"** button
3. Drag and drop a PDF file (or click to browse)
4. Fill in:
   - Title: "Data Structures - Trees"
   - Subject: Computer Science
   - Topic: Binary Trees
   - Course: B.Tech CSE
   - Semester: 3
   - Professor: Dr. Smith
5. Click **"Upload Note"**

**Expected:** Success message and redirect to note detail page

### View Note Details

1. From Notes page, click on any note card
2. Test all tabs:
   - **Content Tab:** Should show file info and download button
   - **AI Summary Tab:** Click "Generate Summary" (requires OpenAI API key)
   - **Flashcards Tab:** Navigate through cards with prev/next
   - **Clarity Bot Tab:** Ask a question about the note

### Backend API Test

```bash
# Test notes endpoint
curl http://localhost:5000/api/notes

# Test with authentication
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     http://localhost:5000/api/notes
```

---

## 🎯 Step 6: Test Exams Features

### Browse Exams

1. Go to **Exams** page (`/exams`)
2. Should see exam categories:
   - Engineering (JEE, GATE, etc.)
   - Medical (NEET, AIIMS)
   - Government (UPSC, SSC)

### Target an Exam

1. Click on any exam card (e.g., JEE Main)
2. Click **"Target Exam"** button
3. Verify badge changes to "Remove Target"

### Track Syllabus

1. On exam detail page, scroll to **Syllabus Tracker**
2. Click checkbox next to any topic to mark as completed
3. Watch progress bar update

### Take Mock Test

1. Scroll to **Available Mock Tests** section
2. Click **"Start Test"** on any mock test
3. Read instructions and click **"Start Test"**
4. Answer questions, use navigation:
   - Select answers by clicking options
   - Use "Mark for Review" flag
   - Navigate with Previous/Next buttons
   - Jump to questions using palette
5. Click **"Submit Test"**
6. Review detailed results with explanations

---

## 👤 Step 7: Test Profile Features

### View Profile

1. Go to **Profile** page (`/profile`)
2. Should see your information and stats:
   - Level, XP, Coins, Streak
   - Notes uploaded, Tests taken
   - Targeted exams

### Edit Profile

1. Click **"Edit Profile"** button
2. Update fields:
   - Full Name
   - Phone
   - Location
   - Bio
   - Skills (add/remove)
   - Interests (add/remove)
   - Social Links
3. Click **"Save Changes"**

**Expected:** Success message and updated profile

---

## 🔍 Step 8: API Testing with Postman/curl

### Health Check

```bash
curl http://localhost:5000/api/health
```

**Expected:**
```json
{"status":"OK","message":"Student Hub API is running"}
```

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "API Test User",
    "email": "apitest@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@example.com",
    "password": "password123"
  }'
```

**Expected:** Returns `token` and `user` object

### Get User Profile

```bash
# Replace YOUR_TOKEN with the token from login
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🧪 Step 9: Database Verification

### Connect to MongoDB

```bash
# Local MongoDB
mongosh student-hub

# Docker MongoDB
docker exec -it mongodb mongosh -u admin -p password123 student-hub
```

### Check Collections

```javascript
// Show all collections
show collections

// Count users
db.users.countDocuments()

// Find all users
db.users.find().pretty()

// Check notes
db.notes.find().pretty()

// Check exams
db.exams.find().pretty()
```

### Useful Database Commands

```javascript
// Find user by email
db.users.findOne({ email: "test@example.com" })

// Check user's gamification data
db.users.findOne(
  { email: "test@example.com" },
  { gamification: 1 }
)

// Count mock test attempts
db.mocktestampts.countDocuments()

// View recent activity
db.users.find().sort({ createdAt: -1 }).limit(5)

// Clear all data (careful!)
db.dropDatabase()
```

---

## 🚨 Common Issues & Solutions

### 1. Cannot Connect to MongoDB

**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solution:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod  # Linux
docker ps | grep mongodb      # Docker

# Start MongoDB
sudo systemctl start mongod   # Linux
npm run mongo:start          # Docker
```

### 2. Backend Won't Start

**Error:** `Port 5000 already in use`

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill it
kill -9 PID

# Or change PORT in .env
PORT=5001
```

### 3. Frontend API Errors

**Error:** `Network Error` or `Unable to connect to server`

**Solution:**
1. Verify backend is running: `curl http://localhost:5000/api/health`
2. Check CORS settings in `server/index.ts`
3. Verify `.env` has correct `CLIENT_URL=http://localhost:5173`

### 4. Authentication Errors

**Error:** `401 Unauthorized`

**Solution:**
1. Check if token exists: `localStorage.getItem('token')`
2. Re-login if token is invalid
3. Verify JWT_SECRET in `.env` matches backend

### 5. File Upload Fails

**Error:** `File upload failed`

**Solution:**
1. Check file size (max 50MB)
2. Verify file type is supported (PDF, PPT, DOCX, JPG, PNG)
3. Check backend logs for Multer errors
4. Ensure `uploads/` directory exists with write permissions

---

## 📊 Performance Testing

### Load Testing with Apache Bench

```bash
# Install ab (Apache Bench)
sudo apt-get install apache2-utils  # Ubuntu
brew install httpd                   # macOS

# Test health endpoint
ab -n 1000 -c 10 http://localhost:5000/api/health

# Test notes endpoint (with auth)
ab -n 100 -c 5 -H "Authorization: Bearer YOUR_TOKEN" \
   http://localhost:5000/api/notes
```

### Monitor Server Performance

```bash
# Watch server logs
npm run server | tee server.log

# Monitor MongoDB
mongosh --eval "db.serverStatus()"

# Check memory usage
htop  # or top
```

---

## 🎯 Testing Checklist

Use this checklist to ensure everything works:

### Backend
- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] Health endpoint responds
- [ ] User registration works
- [ ] User login works
- [ ] JWT authentication works
- [ ] All API endpoints return data
- [ ] File upload works

### Frontend
- [ ] Login page loads
- [ ] Registration works
- [ ] Dashboard displays correctly
- [ ] Notes page loads and displays cards
- [ ] Upload notes page works
- [ ] Note detail page shows all tabs
- [ ] Exams page displays categories
- [ ] Exam detail shows syllabus tracker
- [ ] Mock test interface works
- [ ] Profile page displays and edits
- [ ] Navbar navigation works
- [ ] Logout works
- [ ] Error messages display properly
- [ ] Loading states show correctly

### Integration
- [ ] Frontend connects to backend
- [ ] Authentication flow works end-to-end
- [ ] Data persists in MongoDB
- [ ] Real-time updates work
- [ ] Error handling works
- [ ] File uploads store correctly

---

## 📚 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:id` - Get user by ID

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Upload note
- `GET /api/notes/:id` - Get note details
- `POST /api/notes/:id/summary` - Generate AI summary
- `POST /api/notes/:id/flashcards` - Generate flashcards
- `POST /api/notes/:id/rate` - Rate note

### Exams
- `GET /api/exams` - Get all exams
- `GET /api/exams/:id` - Get exam details
- `POST /api/exams/:id/target` - Target/untarget exam
- `POST /api/exams/:id/syllabus/:sectionId/toggle` - Toggle topic completion

### Mock Tests
- `GET /api/mock-tests` - Get all mock tests
- `GET /api/mock-tests/:id` - Get test details
- `POST /api/mock-tests/:id/submit` - Submit test

---

## 🎉 Next Steps After Testing

Once everything works:

1. **Add Real Data:** Populate MongoDB with actual exams, notes, and mock tests
2. **OpenAI Integration:** Add your OpenAI API key for AI features
3. **Cloudinary Setup:** Configure file storage for production
4. **Deploy:** Follow deployment guide for production hosting

---

## 🆘 Need Help?

### Check Logs
```bash
# Backend logs
npm run server

# Frontend logs
npm run dev

# MongoDB logs (Docker)
npm run mongo:logs

# Browser console
Open DevTools (F12) → Console tab
```

### Debug Mode

Add to `.env`:
```env
NODE_ENV=development
DEBUG=true
```

### Report Issues

When reporting issues, include:
1. Error message
2. Backend logs
3. Frontend console logs
4. Steps to reproduce
5. MongoDB connection status

---

**Happy Testing! 🚀**
