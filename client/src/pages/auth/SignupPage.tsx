import React, { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TextField, CircularProgress, Box } from '@mui/material';
import { motion } from 'framer-motion';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/config/supabaseClient';
import AuthPage from '@/components/auth/AuthPage';

interface SignupFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const SignupPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormInputs>();
  const navigate = useNavigate();
  const { session, isLoading: isAuthLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && session) {
      navigate('/dashboard', { replace: true });
    }
  }, [session, isAuthLoading, navigate]);

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          // Pass the user's name as metadata so our database trigger can use it
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      });
      if (error) throw error;
      
      // On success, Supabase will send a confirmation email.
      // We can inform the user here, but for now, we'll let the user check their email.
      // A success message could be set in the state here.
      
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

  if (isAuthLoading) { return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>; }

  return (
    <AuthPage
      title="Create Your Account"
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      serverError={serverError}
      setServerError={setServerError}
      submitButtonText="Sign Up"
      footerLink={{ text: "Already have an account? Sign In", to: '/login' }}
      showSocialLogins={true}
    >
      <motion.div variants={itemVariants}>
        <TextField
          label="First Name"
          fullWidth
          required
          {...register('firstName', { required: 'First name is required' })}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          disabled={isSubmitting}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <TextField
          label="Last Name"
          fullWidth
          required
          {...register('lastName', { required: 'Last name is required' })}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          disabled={isSubmitting}
        />
      </motion.div>
      
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
          {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
          error={!!errors.password}
          helperText={errors.password?.message}
          disabled={isSubmitting}
        />
      </motion.div>
    </AuthPage>
  );
};

export default SignupPage;