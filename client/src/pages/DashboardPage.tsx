import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, AppBar, Toolbar, CircularProgress } from '@mui/material';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/config/supabaseClient';

const DashboardPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Function to handle user logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    }
    // The onAuthStateChange listener in AuthContext will handle redirecting the user.
    // We can add a navigate call here as a fallback.
    navigate('/login');
  };

  // Display a loading indicator while the user session is being fetched
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Get the user's name from the user_metadata. Fallback to email if name is not available.
  const profileName = user?.user_metadata?.full_name || user?.email || 'User';

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            IntelliResume Dashboard
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Welcome, {profileName}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1">
          This is your protected dashboard page. From here you can manage your profile, skills, and resume details.
        </Typography>
        {/* You can add more dashboard components and content here */}
      </Container>
    </Box>
  );
};

export default DashboardPage;