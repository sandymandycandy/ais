# 🗄️ MongoDB Local Setup Guide

## Quick Setup Options

### Option 1: MongoDB with Docker (Easiest) ⭐ Recommended

**Install Docker first:**
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

**Then run MongoDB:**
```bash
# Create a MongoDB container
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -v mongodb_data:/data/db \
  mongo:6.0

# Check if it's running
docker ps

# View logs
docker logs mongodb

# Connect to MongoDB shell
docker exec -it mongodb mongosh

# Stop MongoDB
docker stop mongodb

# Start MongoDB (after stopping)
docker start mongodb
```

**Update your .env file:**
```env
MONGODB_URI=mongodb://admin:password123@localhost:27017/student-hub?authSource=admin
```

---

### Option 2: Install MongoDB Directly (Ubuntu/Debian)

```bash
# 1. Import MongoDB GPG Key
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | \
  sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-6.0.gpg

# 2. Add MongoDB Repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] \
  https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# 3. Update package list
sudo apt-get update

# 4. Install MongoDB
sudo apt-get install -y mongodb-org

# 5. Start MongoDB service
sudo systemctl start mongod

# 6. Enable MongoDB to start on boot
sudo systemctl enable mongod

# 7. Check status
sudo systemctl status mongod

# 8. Test connection
mongosh
```

**Your .env file:**
```env
MONGODB_URI=mongodb://localhost:27017/student-hub
```

---

### Option 3: Install MongoDB (macOS with Homebrew)

```bash
# 1. Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Add MongoDB tap
brew tap mongodb/brew

# 3. Install MongoDB
brew install mongodb-community@6.0

# 4. Start MongoDB
brew services start mongodb-community@6.0

# 5. Check status
brew services list

# 6. Test connection
mongosh
```

**Your .env file:**
```env
MONGODB_URI=mongodb://localhost:27017/student-hub
```

---

### Option 4: MongoDB Atlas (Cloud - Free Tier) 🌐

**No installation needed!**

1. **Sign up:** Go to https://www.mongodb.com/cloud/atlas/register
2. **Create free cluster:** Choose M0 Free tier
3. **Create database user:** Set username and password
4. **Whitelist IP:** Add `0.0.0.0/0` (allow from anywhere) or your specific IP
5. **Get connection string:** Click "Connect" → "Connect your application"

**Update .env with Atlas URI:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/student-hub?retryWrites=true&w=majority
```

---

## Verify MongoDB Connection

### Test with Node.js:

Create a test file:

```javascript
// test-db.js
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-hub';

mongoose.connect(uri)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
```

Run test:
```bash
node test-db.js
```

### Test with mongosh (MongoDB Shell):

```bash
# Connect to local MongoDB
mongosh

# Or connect to specific database
mongosh "mongodb://localhost:27017/student-hub"

# Test commands
use student-hub
db.test.insertOne({test: "Hello MongoDB!"})
db.test.find()
db.test.drop()
```

---

## Common MongoDB Commands

```bash
# Check MongoDB status
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Stop MongoDB
sudo systemctl stop mongod

# Restart MongoDB
sudo systemctl restart mongod

# View MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# MongoDB shell
mongosh

# Show databases
mongosh --eval "show dbs"

# Show collections in student-hub
mongosh student-hub --eval "show collections"
```

---

## Troubleshooting

### Port 27017 already in use:
```bash
# Find process using port 27017
sudo lsof -i :27017

# Kill the process
sudo kill -9 <PID>
```

### Permission denied:
```bash
# Fix MongoDB data directory permissions
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown mongodb:mongodb /tmp/mongodb-27017.sock
```

### Connection refused:
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check MongoDB logs
sudo tail -50 /var/log/mongodb/mongod.log
```

### MongoDB not starting:
```bash
# Remove lock file
sudo rm /var/lib/mongodb/mongod.lock

# Repair MongoDB
sudo mongod --repair

# Restart
sudo systemctl restart mongod
```

---

## Environment Configuration

Your `.env` file should look like this:

```env
# MongoDB - Choose one based on your setup:

# Option 1: Local MongoDB (no auth)
MONGODB_URI=mongodb://localhost:27017/student-hub

# Option 2: Local MongoDB (with Docker auth)
MONGODB_URI=mongodb://admin:password123@localhost:27017/student-hub?authSource=admin

# Option 3: MongoDB Atlas (cloud)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/student-hub?retryWrites=true&w=majority

# JWT
JWT_SECRET=student-hub-super-secret-key-2024
JWT_REFRESH_SECRET=student-hub-refresh-secret-key-2024
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# OpenAI (Optional - for AI features)
OPENAI_API_KEY=sk-demo-key

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## Quick Start After MongoDB Setup

```bash
# 1. Start MongoDB (if not using Docker or cloud)
sudo systemctl start mongod

# 2. Terminal 1 - Start Backend
npm run server

# 3. Terminal 2 - Start Frontend
npm run dev

# 4. Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000/api
# Test API: http://localhost:5000/api/health
```

---

## Database Structure

Once connected, your MongoDB database will automatically create these collections:

- `users` - Student profiles
- `notes` - Study materials
- `exams` - Exam information
- `mocktests` - Test questions
- `mocktestampts` - Test attempts
- `opportunities` - Jobs/internships
- `opportunityapps` - Applications
- `studycircles` - Community groups
- `posts` - Discussion posts
- `comments` - Post comments
- `mentors` - Mentor profiles
- `mentorsessions` - Sessions
- `skillcourses` - Courses
- `courseenrollments` - Enrollments
- `projects` - Team projects
- `badges` - Achievement badges
- `userbadges` - User badges

---

## MongoDB GUI Tools (Optional)

For easier database management:

1. **MongoDB Compass** (Official): https://www.mongodb.com/products/compass
2. **Studio 3T**: https://studio3t.com/
3. **Robo 3T**: https://robomongo.org/

Connection string: `mongodb://localhost:27017`

---

**Recommendation:** Start with Docker (Option 1) for the easiest setup, or use MongoDB Atlas (Option 4) for zero-configuration cloud database.
