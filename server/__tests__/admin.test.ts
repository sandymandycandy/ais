import request from 'supertest';
import express from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import User from '../models/User';
import Note from '../models/Note';
import authRoutes from '../routes/auth';
import adminRoutes from '../routes/admin';
import { protect } from '../middleware/auth';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

let mongoServer: MongoMemoryServer;
let adminToken: string;
let studentToken: string;
let adminUser: any;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Create admin user
  const adminResponse = await request(app).post('/api/auth/register').send({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Admin123!',
    college: 'Test College',
    course: 'Computer Science',
    year: 4
  });

  adminToken = adminResponse.body.token;
  adminUser = adminResponse.body.user;

  // Update user to admin role
  await User.findByIdAndUpdate(adminUser._id, {
    role: 'college_admin',
    organizationName: 'Test College',
    permissions: ['view:users', 'view:analytics', 'approve:note']
  });

  // Create student user
  const studentResponse = await request(app).post('/api/auth/register').send({
    name: 'Student User',
    email: 'student@example.com',
    password: 'Student123!',
    college: 'Test College',
    course: 'Computer Science',
    year: 2
  });

  studentToken = studentResponse.body.token;
});

afterEach(async () => {
  await User.deleteMany({});
  await Note.deleteMany({});
});

describe('Admin API', () => {
  describe('GET /api/admin/analytics', () => {
    it('should return analytics for admin user', async () => {
      const response = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('overview');
      expect(response.body.overview).toHaveProperty('totalUsers');
      expect(response.body.overview).toHaveProperty('totalNotes');
    });

    it('should fail for non-admin user', async () => {
      await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(403);
    });

    it('should fail without authentication', async () => {
      await request(app)
        .get('/api/admin/analytics')
        .expect(401);
    });
  });

  describe('GET /api/admin/users', () => {
    it('should return list of users for admin', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
      expect(response.body).toHaveProperty('pagination');
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/admin/users?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.pagination).toHaveProperty('currentPage', 1);
      expect(response.body.pagination).toHaveProperty('limit', 10);
    });

    it('should support search filtering', async () => {
      const response = await request(app)
        .get('/api/admin/users?search=student')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('users');
    });
  });

  describe('POST /api/admin/announcements', () => {
    it('should create announcement for admin user', async () => {
      const announcementData = {
        title: 'Test Announcement',
        message: 'This is a test announcement',
        targetAudience: 'all',
        priority: 'normal'
      };

      const response = await request(app)
        .post('/api/admin/announcements')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(announcementData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
    });

    it('should fail for non-admin user', async () => {
      const announcementData = {
        title: 'Test Announcement',
        message: 'This is a test announcement',
        targetAudience: 'all'
      };

      await request(app)
        .post('/api/admin/announcements')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(announcementData)
        .expect(403);
    });
  });

  describe('GET /api/admin/moderation/stats', () => {
    beforeEach(async () => {
      // Create some test notes with different moderation statuses
      await Note.create({
        title: 'Pending Note',
        description: 'Test note',
        subject: 'Computer Science',
        college: 'Test College',
        course: 'CS',
        year: 2,
        uploadedBy: adminUser._id,
        moderationStatus: 'pending',
        fileUrl: 'http://example.com/file.pdf',
        fileType: 'pdf'
      });

      await Note.create({
        title: 'Approved Note',
        description: 'Test note',
        subject: 'Computer Science',
        college: 'Test College',
        course: 'CS',
        year: 2,
        uploadedBy: adminUser._id,
        moderationStatus: 'approved',
        fileUrl: 'http://example.com/file.pdf',
        fileType: 'pdf'
      });
    });

    it('should return moderation statistics', async () => {
      const response = await request(app)
        .get('/api/admin/moderation/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('notes');
      expect(response.body.notes).toHaveProperty('pending');
      expect(response.body.notes).toHaveProperty('approved');
      expect(response.body.notes.pending).toBeGreaterThan(0);
    });
  });

  describe('GET /api/admin/moderation/pending', () => {
    beforeEach(async () => {
      await Note.create({
        title: 'Pending Note 1',
        description: 'Test note',
        subject: 'Computer Science',
        college: 'Test College',
        course: 'CS',
        year: 2,
        uploadedBy: adminUser._id,
        moderationStatus: 'pending',
        fileUrl: 'http://example.com/file.pdf',
        fileType: 'pdf'
      });
    });

    it('should return pending content', async () => {
      const response = await request(app)
        .get('/api/admin/moderation/pending?type=note')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('content');
      expect(Array.isArray(response.body.content)).toBe(true);
      expect(response.body.content.length).toBeGreaterThan(0);
    });
  });

  describe('PATCH /api/admin/users/:userId', () => {
    let targetUserId: string;

    beforeEach(async () => {
      const user = await User.create({
        name: 'Target User',
        email: 'target@example.com',
        password: 'Password123!',
        college: 'Test College',
        course: 'CS',
        year: 2,
        role: 'student'
      });
      targetUserId = user._id.toString();
    });

    it('should update user status', async () => {
      const response = await request(app)
        .patch(`/api/admin/users/${targetUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isActive: false })
        .expect(200);

      expect(response.body.user.isActive).toBe(false);
    });

    it('should fail for invalid user ID', async () => {
      await request(app)
        .patch('/api/admin/users/invalidid')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isActive: false })
        .expect(400);
    });
  });
});
