import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

interface Props {
  children: React.ReactNode;
  requireVerified?: boolean;
}

const ProtectedRoute: React.FC<Props> = ({ children, requireVerified = true }) => {
  const { isAuthenticated, isVerified, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Customize your loading screen if needed
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireVerified && !isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;