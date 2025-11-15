import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { initializeSocket, disconnectSocket, getSocket } from '../lib/socket';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
      const newSocket = initializeSocket(token);

      newSocket.on('connect', () => {
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        setConnected(false);
      });

      newSocket.on('users:online', (data: { userIds: string[] }) => {
        setOnlineUsers(data.userIds);
      });

      newSocket.on('user:online', (data: { userId: string }) => {
        setOnlineUsers(prev => {
          if (!prev.includes(data.userId)) {
            return [...prev, data.userId];
          }
          return prev;
        });
      });

      newSocket.on('user:offline', (data: { userId: string }) => {
        setOnlineUsers(prev => prev.filter(id => id !== data.userId));
      });

      newSocket.connect();
      setSocket(newSocket);

      return () => {
        disconnectSocket();
        setSocket(null);
        setConnected(false);
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};
