import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import Notification from '../models/Notification';
import Message from '../models/Message';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userEmail?: string;
}

// Store online users: userId -> socketId
const onlineUsers = new Map<string, string>();

// Middleware to authenticate socket connections
const authenticateSocket = (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication token required'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as {
      userId: string;
      email: string;
    };
    socket.userId = decoded.userId;
    socket.userEmail = decoded.email;
    next();
  } catch (error) {
    next(new Error('Invalid authentication token'));
  }
};

export const setupSocketHandlers = (io: Server) => {
  // Apply authentication middleware
  io.use(authenticateSocket);

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    // Add user to online users
    if (socket.userId) {
      onlineUsers.set(socket.userId, socket.id);

      // Broadcast to all users that this user is online
      io.emit('user:online', {
        userId: socket.userId,
        timestamp: new Date()
      });

      // Send current online users to the newly connected user
      socket.emit('users:online', {
        userIds: Array.from(onlineUsers.keys())
      });
    }

    // Join personal room for direct notifications
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Handle joining study circle rooms
    socket.on('studyCircle:join', (studyCircleId: string) => {
      socket.join(`studyCircle:${studyCircleId}`);
      console.log(`User ${socket.userId} joined study circle ${studyCircleId}`);
    });

    // Handle leaving study circle rooms
    socket.on('studyCircle:leave', (studyCircleId: string) => {
      socket.leave(`studyCircle:${studyCircleId}`);
      console.log(`User ${socket.userId} left study circle ${studyCircleId}`);
    });

    // Handle sending direct messages
    socket.on('message:send', async (data: {
      recipientId: string;
      content: string;
      type?: 'text' | 'file' | 'image';
    }) => {
      try {
        const message = await Message.create({
          senderId: socket.userId,
          recipientId: data.recipientId,
          content: data.content,
          type: data.type || 'text'
        });

        await message.populate('senderId', 'name email avatar');

        // Send to recipient if online
        io.to(`user:${data.recipientId}`).emit('message:received', message);

        // Confirm to sender
        socket.emit('message:sent', message);

        // Create notification for recipient
        const notification = await Notification.create({
          userId: data.recipientId,
          type: 'message',
          title: 'New Message',
          message: `You have a new message`,
          link: `/messages/${socket.userId}`
        });

        io.to(`user:${data.recipientId}`).emit('notification:new', notification);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle sending study circle messages
    socket.on('studyCircle:message', async (data: {
      studyCircleId: string;
      content: string;
      type?: 'text' | 'file' | 'image';
    }) => {
      try {
        const message = await Message.create({
          senderId: socket.userId,
          studyCircleId: data.studyCircleId,
          content: data.content,
          type: data.type || 'text'
        });

        await message.populate('senderId', 'name email avatar');

        // Broadcast to all members in the study circle
        io.to(`studyCircle:${data.studyCircleId}`).emit('studyCircle:message:received', {
          studyCircleId: data.studyCircleId,
          message
        });
      } catch (error) {
        console.error('Error sending study circle message:', error);
        socket.emit('error', { message: 'Failed to send study circle message' });
      }
    });

    // Handle marking messages as read
    socket.on('message:read', async (messageId: string) => {
      try {
        await Message.findByIdAndUpdate(messageId, { read: true });
        socket.emit('message:read:confirmed', messageId);
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle marking notifications as read
    socket.on('notification:read', async (notificationId: string) => {
      try {
        await Notification.findByIdAndUpdate(notificationId, { read: true });
        socket.emit('notification:read:confirmed', notificationId);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    });

    // Handle marking all notifications as read
    socket.on('notifications:readAll', async () => {
      try {
        await Notification.updateMany(
          { userId: socket.userId, read: false },
          { read: true }
        );
        socket.emit('notifications:readAll:confirmed');
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
      }
    });

    // Handle typing indicators
    socket.on('typing:start', (data: { recipientId?: string; studyCircleId?: string }) => {
      if (data.recipientId) {
        io.to(`user:${data.recipientId}`).emit('typing:started', {
          userId: socket.userId,
          userEmail: socket.userEmail
        });
      } else if (data.studyCircleId) {
        socket.to(`studyCircle:${data.studyCircleId}`).emit('typing:started', {
          userId: socket.userId,
          userEmail: socket.userEmail,
          studyCircleId: data.studyCircleId
        });
      }
    });

    socket.on('typing:stop', (data: { recipientId?: string; studyCircleId?: string }) => {
      if (data.recipientId) {
        io.to(`user:${data.recipientId}`).emit('typing:stopped', {
          userId: socket.userId
        });
      } else if (data.studyCircleId) {
        socket.to(`studyCircle:${data.studyCircleId}`).emit('typing:stopped', {
          userId: socket.userId,
          studyCircleId: data.studyCircleId
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);

      if (socket.userId) {
        onlineUsers.delete(socket.userId);

        // Broadcast to all users that this user is offline
        io.emit('user:offline', {
          userId: socket.userId,
          timestamp: new Date()
        });
      }
    });
  });
};

// Helper function to send notification to a specific user
export const sendNotificationToUser = async (
  io: Server,
  userId: string,
  notification: {
    type: 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'message' | 'reminder';
    title: string;
    message: string;
    link?: string;
  }
) => {
  try {
    const newNotification = await Notification.create({
      userId,
      ...notification
    });

    // Send via socket if user is online
    io.to(`user:${userId}`).emit('notification:new', newNotification);

    return newNotification;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

// Helper function to broadcast notification to multiple users
export const broadcastNotification = async (
  io: Server,
  userIds: string[],
  notification: {
    type: 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'message' | 'reminder';
    title: string;
    message: string;
    link?: string;
  }
) => {
  try {
    const notifications = await Promise.all(
      userIds.map(userId =>
        Notification.create({
          userId,
          ...notification
        })
      )
    );

    // Send to all online users
    userIds.forEach((userId, index) => {
      io.to(`user:${userId}`).emit('notification:new', notifications[index]);
    });

    return notifications;
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    throw error;
  }
};
