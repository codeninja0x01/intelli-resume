import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute: React.FC = () => {
  const { session, isLoading } = useAuth(); // We now check for the session object
  const location = useLocation();

  // 1. While the AuthContext is loading the session, show a spinner.
  //    This prevents any premature redirects.
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 2. After loading, if there is no session, redirect to login.
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If loading is done and there is a session, render the requested page.
  return <Outlet />;
};

export default ProtectedRoute;