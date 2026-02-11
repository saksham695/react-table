import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './types/enums';

// Pages
import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import TrainerProfile from './pages/Profile/TrainerProfile';
import ClientProfile from './pages/Profile/ClientProfile';
import TrainerList from './pages/Trainers/TrainerList';
import TrainerDetail from './pages/Trainers/TrainerDetail';
import CourseList from './pages/Courses/CourseList';
import CreateCourse from './pages/Courses/CreateCourse';
import CourseDetail from './pages/Courses/CourseDetail';
import MyCourses from './pages/Courses/MyCourses';
import ClientList from './pages/Clients/ClientList';
import ClientDetail from './pages/Clients/ClientDetail';
import Goals from './pages/Goals/Goals';
import AvailabilityManagement from './pages/Availability/AvailabilityManagement';
import BookSession from './pages/Booking/BookSession';
import TrainerBookings from './pages/Booking/TrainerBookings';
import ClientBookings from './pages/Booking/ClientBookings';

import './App.css';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const ProfilePage = () => {
    return user?.role === UserRole.TRAINER ? <TrainerProfile /> : <ClientProfile />;
  };

  const BookingsPage = () => {
    return user?.role === UserRole.TRAINER ? <TrainerBookings /> : <ClientBookings />;
  };

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <BookingsPage />
          </ProtectedRoute>
        }
      />

      {/* Trainer Routes */}
      <Route
        path="/availability"
        element={
          <ProtectedRoute allowedRoles={[UserRole.TRAINER]}>
            <AvailabilityManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute allowedRoles={[UserRole.TRAINER]}>
            <CourseList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/create"
        element={
          <ProtectedRoute allowedRoles={[UserRole.TRAINER]}>
            <CreateCourse />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:id"
        element={
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedRoute allowedRoles={[UserRole.TRAINER]}>
            <ClientList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients/:id"
        element={
          <ProtectedRoute allowedRoles={[UserRole.TRAINER]}>
            <ClientDetail />
          </ProtectedRoute>
        }
      />

      {/* Client Routes */}
      <Route
        path="/trainers"
        element={
          <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
            <TrainerList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trainers/:id"
        element={
          <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
            <TrainerDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book-session/:trainerId"
        element={
          <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
            <BookSession />
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
            <Goals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-courses"
        element={
          <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
            <MyCourses />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
