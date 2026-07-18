import { Routes, Route, Navigate } from 'react-router-dom';

// Import Pages & Layouts (Adjust paths based on your folder structure)

import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import ChatInterface from './pages/ChatInterface';


import { useAuth } from './hooks/useAuth';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import SettingsPage from './pages/SettingsPage';

// A simple wrapper component for routes that should only be accessed by logged-out guests
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-zinc-800 border-t-zinc-100 rounded-full animate-spin"></div>
          <span className="text-sm">Loading session...</span>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// A simple wrapper component to apply the layout to dashboard routes
const DashboardRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-zinc-800 border-t-zinc-100 rounded-full animate-spin"></div>
          <span className="text-sm">Loading session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<GuestRoute><AuthPage mode="login" /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><AuthPage mode="signup" /></GuestRoute>} />
      <Route path="/auth" element={<Navigate to="/login" replace />} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
      <Route path="/reset-password" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      <Route
        path="/chat"
        element={
          <DashboardRoute>
            <ChatInterface />
          </DashboardRoute>
        }
      />
      <Route
        path="/chat/:conversationId"
        element={
          <DashboardRoute>
            <ChatInterface />
          </DashboardRoute>
        }
      />
      <Route
        path="/chat/:conversationId/questions"
        element={
          <DashboardRoute>
            <AnalyticsDashboard />
          </DashboardRoute>
        }
      />
      <Route
        path="/dashboard"
        element={<Navigate to="/chat" replace />}
      />
      <Route
        path="/settings"
        element={
          <DashboardRoute>
            <SettingsPage />
          </DashboardRoute>
        }
      />

      {/* Fallback Route for 404s */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}