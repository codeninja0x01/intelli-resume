import React, { type ReactNode } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Typography, Link, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';

import AuthLayout from '../layout/AuthLayout';
import AuthFormContainer from '../ui/AuthFormContainer';
import SocialLogins from './SocialLogins';

// Define the props our new generic component will accept
interface AuthPageProps<T extends Record<string, any>> {
  title: string;
  onSubmit: SubmitHandler<T>;
  children: ReactNode; // The unique form fields will be passed as children
  isSubmitting: boolean;
  serverError: string | null;
  setServerError: (error: string | null) => void;
  submitButtonText: string;
  footerLink: {
    text: string;
    to: string;
  };
  showSocialLogins?: boolean;
}

// We use a generic <T> to make this component work with any form data shape
const AuthPage = <T extends Record<string, any>>({
  title,
  onSubmit,
  children,
  isSubmitting,
  serverError,
  setServerError,
  submitButtonText,
  footerLink,
  showSocialLogins = false, // Default to false
}: AuthPageProps<T>) => {

  const { handleSubmit } = useForm<T>();

  // Framer Motion variants for consistent animations
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AuthLayout title={title}>
      <AuthFormContainer
        // Note: The handleSubmit now comes from the component itself
        // but it will call the onSubmit function passed in from the parent page.
        onSubmit={handleSubmit(onSubmit)}
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Render the unique form fields from the parent page */}
        {children}
        
        {serverError && (
          <motion.div variants={itemVariants}>
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{serverError}</Alert>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ mt: 3, py: 1.5 }}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : submitButtonText}
          </Button>
        </motion.div>

        {showSocialLogins && <SocialLogins isSubmitting={isSubmitting} setServerError={setServerError} />}
        
        <motion.div variants={itemVariants}>
          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            <Link component={RouterLink} to={footerLink.to}>
              {footerLink.text}
            </Link>
          </Typography>
        </motion.div>
      </AuthFormContainer>
    </AuthLayout>
  );
};

export default AuthPage;