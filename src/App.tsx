import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Navbar from './components/layout/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import NoteDetail from './pages/NoteDetail';
import UploadNotes from './pages/UploadNotes';
import Exams from './pages/Exams';
import ExamDetail from './pages/ExamDetail';
import MockTest from './pages/MockTest';
import Opportunities from './pages/Opportunities';
import Profile from './pages/Profile';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/dashboard" /> : <>{children}</>;
};

// Layout Component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {children}
    </div>
  );
};

const App: React.FC = () => {
  const { isAuthenticated, fetchUser } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Layout>
                <Notes />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes/upload"
          element={
            <ProtectedRoute>
              <Layout>
                <UploadNotes />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <NoteDetail />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/exams"
          element={
            <ProtectedRoute>
              <Layout>
                <Exams />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/exams/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ExamDetail />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/mock-tests/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <MockTest />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/opportunities"
          element={
            <ProtectedRoute>
              <Layout>
                <Opportunities />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Placeholder routes for other pages */}
        <Route
          path="/study-circles"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Study Circles</h1>
                    <p className="text-gray-600">Coming Soon - Join study groups and collaborate with peers</p>
                  </div>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentors"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Mentorship Platform</h1>
                    <p className="text-gray-600">Coming Soon - Connect with expert mentors</p>
                  </div>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />

        {/* 404 Not Found */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Page not found</p>
                <a href={isAuthenticated ? "/dashboard" : "/login"} className="text-blue-600 hover:text-blue-700 font-medium">
                  Go back home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
