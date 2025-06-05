import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // While the session is being validated on initial load, show a spinner.
    // This is the key change that prevents the premature redirect.
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // After loading is complete, if the user is not authenticated,
    // redirect them to the login page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If loading is complete and the user is authenticated, render the page.
  return <Outlet />;
};

export default ProtectedRoute;