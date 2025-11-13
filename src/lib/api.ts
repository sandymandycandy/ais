import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses with better error messages
api.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    // Network error (server not reachable)
    if (!error.response) {
      const networkError = {
        message: 'Unable to connect to server. Please check your connection and try again.',
        status: 'NETWORK_ERROR',
        isNetworkError: true,
      };
      return Promise.reject(networkError);
    }

    // Unauthorized - redirect to login
    if (error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject({
        message: 'Your session has expired. Please login again.',
        status: 401,
      });
    }

    // Forbidden
    if (error.response.status === 403) {
      return Promise.reject({
        message: 'You do not have permission to perform this action.',
        status: 403,
      });
    }

    // Not found
    if (error.response.status === 404) {
      return Promise.reject({
        message: 'The requested resource was not found.',
        status: 404,
      });
    }

    // Server error
    if (error.response.status >= 500) {
      return Promise.reject({
        message: 'Server error. Please try again later.',
        status: error.response.status,
      });
    }

    // Return the error response from API with fallback message
    const apiError = error.response.data as any;
    return Promise.reject({
      message: apiError?.message || 'An unexpected error occurred.',
      status: error.response.status,
      errors: apiError?.errors,
    });
  }
);

// Helper function to check if error is a network error
export const isNetworkError = (error: any): boolean => {
  return error?.isNetworkError === true || error?.status === 'NETWORK_ERROR';
};

// Helper function to get user-friendly error message
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  return 'An unexpected error occurred. Please try again.';
};

export default api;
