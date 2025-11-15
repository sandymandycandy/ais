import express, { Application, Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import noteRoutes from './routes/notes';
import examRoutes from './routes/exams';
import mockTestRoutes from './routes/mockTests';
import opportunityRoutes from './routes/opportunities';
import studyCircleRoutes from './routes/studyCircles';
import mentorRoutes from './routes/mentors';
import skillCourseRoutes from './routes/skillCourses';
import projectRoutes from './routes/projects';
import dashboardRoutes from './routes/dashboard';
import gamificationRoutes from './routes/gamification';
import notificationRoutes from './routes/notifications';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/mock-tests', mockTestRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/study-circles', studyCircleRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/skill-courses', skillCourseRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Student Hub API is running' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Socket.io connection handling
import { setupSocketHandlers } from './socket';
setupSocketHandlers(io);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⚡ Socket.io enabled`);
});

export default app;
export { io };
