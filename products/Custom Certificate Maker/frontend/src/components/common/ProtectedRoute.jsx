import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner label="Verifying security credentials & session permissions..." />;
  }

  // Not logged in -> Redirect to login page
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role not authorized -> Redirect to their respective authorized home route
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'organization') return <Navigate to="/org" replace />;
    if (user.role === 'recipient') return <Navigate to="/recipient" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
