import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { UserRole } from '../../types';

interface Props {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { user, role, initialized } = useAuthStore();

  // Wait until auth is initialized to avoid flash
  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in → redirect to sign in
  if (!user) return <Navigate to="/sign-in" replace />;

  // Logged in but wrong role → redirect to their correct dashboard
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'employer') return <Navigate to="/dashboard/employer" replace />;
    return <Navigate to="/dashboard/worker" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
