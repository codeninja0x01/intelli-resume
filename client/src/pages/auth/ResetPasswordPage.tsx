import React, { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { TextField, Button, Typography, Link, Alert, CircularProgress, Box } from '@mui/material';
import { motion } from 'framer-motion';

import AuthLayout from '../../components/layout/AuthLayout';
import AuthFormContainer from '../../components/ui/AuthFormContainer';
import { authService } from '../../services/authService'; // Placeholder service
import '../../components/ui/AnimatedBackground.css';

interface ResetPasswordFormInputs {
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormInputs>();
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const newPassword = useRef({});
  newPassword.current = watch("newPassword", "");

  useEffect(() => {
    const resetToken = searchParams.get('token');
    if (resetToken) {
      setToken(resetToken);
      // Optionally, you could validate the token here with the backend immediately
    } else {
      setServerError('Password reset token not found or invalid. Please request a new password reset.');
    }
  }, [searchParams]);

  const onSubmit: SubmitHandler<ResetPasswordFormInputs> = async (data) => {
    if (!token) {
      setServerError('Password reset token is missing.');
      return;
    }
    setIsLoading(true);
    setServerError(null);
    setSuccessMessage(null);
    try {
      await authService.resetPassword({ token, newPassword: data.newPassword });
      setSuccessMessage('Your password has been reset successfully! You can now login with your new password.');
      // Optionally, disable form or redirect after a delay
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setServerError(errorMessage);
      console.error('Reset password failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (!token && !serverError) { // Still checking for token, or initial error state not set
    return (
        <AuthLayout title="Reset Password">
            <CircularProgress />
            <Typography sx={{mt: 2}}>Verifying reset token...</Typography>
        </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset Your Password">
      <div className="animated-background"></div>
      <AuthFormContainer onSubmit={handleSubmit(onSubmit)} variants={formVariants} initial="hidden" animate="visible">
        {!successMessage && (
          <>
            <motion.div variants={itemVariants}>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                required
                {...register('newPassword', { 
                  required: 'New password is required', 
                  minLength: { value: 8, message: "Password must be at least 8 characters" }
                })}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
                disabled={isLoading || !!successMessage}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                required
                {...register('confirmPassword', { 
                  required: 'Please confirm your new password', 
                  validate: value => value === newPassword.current || "The passwords do not match"
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                disabled={isLoading || !!successMessage}
              />
            </motion.div>
          </>
        )}

        {serverError && (
          <motion.div variants={itemVariants}>
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{serverError}</Alert>
          </motion.div>
        )}
        {successMessage && (
          <motion.div variants={itemVariants}>
            <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{successMessage}</Alert>
          </motion.div>
        )}

        {!successMessage && (
            <motion.div variants={itemVariants}>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading || !token}
                sx={{ mt: 3, py: 1.5 }}
            >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
            </Button>
            </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            <Link component={RouterLink} to="/login">
              Back to Login
            </Link>
          </Typography>
        </motion.div>
      </AuthFormContainer>
    </AuthLayout>
  );
};

export default ResetPasswordPage; 