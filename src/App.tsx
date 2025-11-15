import React, { Suspense, useEffect, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/layout/Navbar';

// Eager load auth pages for faster initial load
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Lazy load all other pages for code-splitting
const Notes = lazy(() => import('./pages/Notes'));
const NoteDetail = lazy(() => import('./pages/NoteDetail'));
const UploadNotes = lazy(() => import('./pages/UploadNotes'));
const Exams = lazy(() => import('./pages/Exams'));
const ExamDetail = lazy(() => import('./pages/ExamDetail'));
const MockTest = lazy(() => import('./pages/MockTest'));
const Opportunities = lazy(() => import('./pages/Opportunities'));
const OpportunityDetail = lazy(() => import('./pages/OpportunityDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const StudyCircles = lazy(() => import('./pages/StudyCircles'));
const StudyCircleDetail = lazy(() => import('./pages/StudyCircleDetail'));
const CreateStudyCircle = lazy(() => import('./pages/CreateStudyCircle'));
const Mentors = lazy(() => import('./pages/Mentors'));
const MentorDetail = lazy(() => import('./pages/MentorDetail'));
const Projects = lazy(() => import('./pages/Projects'));
const CreateProject = lazy(() => import('./pages/CreateProject'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const SkillCourses = lazy(() => import('./pages/SkillCourses'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Messages = lazy(() => import('./pages/Messages'));

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

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Layout Component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
      </div>
    </ErrorBoundary>
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

        <Route
          path="/opportunities/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <OpportunityDetail />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Study Circles Routes */}
        <Route
          path="/study-circles"
          element={
            <ProtectedRoute>
              <Layout>
                <StudyCircles />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/study-circles/create"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateStudyCircle />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/study-circles/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <StudyCircleDetail />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Mentors Routes */}
        <Route
          path="/mentors"
          element={
            <ProtectedRoute>
              <Layout>
                <Mentors />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentors/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <MentorDetail />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Projects Routes */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Layout>
                <Projects />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/create"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateProject />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ProjectDetail />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Skill Courses Route */}
        <Route
          path="/skill-courses"
          element={
            <ProtectedRoute>
              <Layout>
                <SkillCourses />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Analytics Route */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <Analytics />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Notifications Route */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Layout>
                <Notifications />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Messages Route */}
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Layout>
                <Messages />
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
