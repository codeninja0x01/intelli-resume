import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';
import AuthLayout from '@/components/layout/AuthLayout'; // Optional: for consistent loading UI

/**
 * A route component that is only accessible to guests (unauthenticated users).
 * If a logged-in user tries to access these routes, they are redirected to the dashboard.
 */
const GuestRoute: React.FC = () => {
  const { session, isLoading } = useAuth();

  // 1. Show a loading spinner while the session is being validated.
  //    This prevents the page from flashing before the redirect happens.
  if (isLoading) {
    return (
      <AuthLayout title="">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </AuthLayout>
    );
  }

  // 2. If loading is complete and a session exists, redirect to the dashboard.
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. If loading is complete and there is no session, render the requested guest page (e.g., Login, Signup).
  return <Outlet />;
};

export default GuestRoute;