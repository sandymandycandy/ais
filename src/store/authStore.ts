import { create } from 'zustand';
import api from '../lib/api';

interface User {
  _id: string;
  id: string;
  name: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  college?: string;
  course?: string;
  year?: number;
  level: number;
  xp: number;
  coins: number;
  gamification?: {
    xp: number;
    level: number;
    coins: number;
    streak?: {
      current: number;
      longest: number;
      lastLogin?: string;
    };
    badges?: Array<{
      name: string;
      description: string;
      earnedAt?: string;
    }>;
    achievements?: Array<{
      name: string;
      description: string;
      earnedAt?: string;
    }>;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/auth/login', { email, password }) as any;

      localStorage.setItem('token', response.token);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message || 'Login failed', isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/auth/register', data) as any;

      localStorage.setItem('token', response.token);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message || 'Registration failed', isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  fetchUser: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get('/auth/me') as any;
      set({ user: response.user, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      if (error.status === 401) {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      }
    }
  },

  clearError: () => set({ error: null }),
}));
