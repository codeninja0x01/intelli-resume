import React, { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { TextField, Box, Link, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/config/supabaseClient';
import AuthPage from '@/components/auth/AuthPage'; // <-- IMPORT THE NEW COMPONENT

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { register, formState: { errors } } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  const { session, isLoading: isAuthLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    // This logic is specific to this page, so it stays here.
    if (!isAuthLoading && session) {
      navigate('/dashboard', { replace: true });
    }
  }, [session, isAuthLoading, navigate]);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
    } catch (error: any) {
      setServerError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };
  
  // You could even move this to a loading component if you wanted.
  if (isAuthLoading) { return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>; }

  return (
    <AuthPage
      title="Login to IntelliResume"
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      serverError={serverError}
      setServerError={setServerError}
      submitButtonText="Login"
      footerLink={{ text: "Don't have an account? Sign Up", to: '/signup' }}
      showSocialLogins={true}
    >
      {/* The children are the unique fields for this form */}
      <motion.div variants={itemVariants}>
        <TextField
          label="Email Address"
          type="email"
          fullWidth
          required
          {...register('email', { required: 'Email is required' })}
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={isSubmitting}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          {...register('password', { required: 'Password is required' })}
          error={!!errors.password}
          helperText={errors.password?.message}
          disabled={isSubmitting}
        />
      </motion.div>

       <motion.div variants={itemVariants}>
            <Box sx={{ mt: 1, textAlign: 'right' }}>
                <Link component={RouterLink} to="/forgot-password" variant="body2">
                    Forgot password?
                </Link>
            </Box>
        </motion.div>
    </AuthPage>
  );
};

export default LoginPage;