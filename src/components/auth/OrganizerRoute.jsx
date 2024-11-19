import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';


export default function OrganizerRoute({ children }) {
  const { isAuthenticated, isOrganizer } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isOrganizer) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}