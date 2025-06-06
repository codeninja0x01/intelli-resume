import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Typography, Link, Alert, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

import AuthLayout from '../../components/layout/AuthLayout';
import AuthFormContainer from '../../components/ui/AuthFormContainer';
import { authService } from '../../services/authService'; // Placeholder service
import '../../components/ui/AnimatedBackground.css';

interface ForgotPasswordFormInputs {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = async (data) => {
    setIsLoading(true);
    setServerError(null);
    setSuccessMessage(null);
    try {
      await authService.forgotPassword(data.email);
      setSuccessMessage('If an account with that email exists, a password reset link has been sent.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setServerError(errorMessage);
      console.error('Forgot password failed', error);
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

  return (
    <AuthLayout title="Forgot Your Password?">
      <div className="animated-background"></div>
      <AuthFormContainer onSubmit={handleSubmit(onSubmit)} variants={formVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}>
            <Typography variant="body2" align="center" sx={{ mb: 2}}>
                Enter your email address and we'll send you a link to reset your password.
            </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            required
            {...register('email', { 
                required: 'Email is required', 
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isLoading}
          />
        </motion.div>

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

        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{ mt: 3, py: 1.5 }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
          </Button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Remember your password?{' '}
            <Link component={RouterLink} to="/login">
              Back to Login
            </Link>
          </Typography>
        </motion.div>
      </AuthFormContainer>
    </AuthLayout>
  );
};

export default ForgotPasswordPage; 