import React from 'react';
import { Button, type ButtonProps, CircularProgress } from '@mui/material';
import { type IconType } from 'react-icons';

interface SocialButtonProps extends ButtonProps {
  icon: IconType;
  isLoading?: boolean;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon: Icon, isLoading, children, ...props }) => {
  return (
    <Button
      variant="outlined"
      fullWidth
      startIcon={!isLoading && <Icon size={20} />}
      disabled={isLoading}
      sx={{
        py: 1.5,
        textTransform: 'none',
        fontWeight: 'medium',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 1.5, // Add some margin bottom for spacing when multiple buttons are used
        '.MuiButton-startIcon': {
          marginRight: '4px', // Adjust spacing if needed
          marginLeft: '0px'
        }
      }}
      {...props}
    >
      {isLoading ? <CircularProgress size={24} color="inherit" /> : children}
    </Button>
  );
};

export default SocialButton; 