import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Protected Route wrapper untuk halaman yang memerlukan autentikasi
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Tampilkan loading saat mengecek auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect ke login jika tidak ada user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render children jika user sudah login
  return children;
};

export default ProtectedRoute;
