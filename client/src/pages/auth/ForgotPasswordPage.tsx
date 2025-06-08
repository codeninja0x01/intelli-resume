import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { TextField, Alert, Typography } from '@mui/material';
import { motion } from 'framer-motion';

import { supabase } from '@/config/supabaseClient';
import AuthPage from '@/components/auth/AuthPage';

interface ForgotPasswordFormInputs {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const { register, formState: { errors } } = useForm<ForgotPasswordFormInputs>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null); // To satisfy AuthPage, though we won't use it
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = async (data) => {
    setIsSubmitting(true);
    setServerError(null);
    setSuccessMessage(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSuccessMessage('If an account with that email exists, a password reset link has been sent.');
    } catch (error: any) {
      setSuccessMessage('If an account with that email exists, a password reset link has been sent.');
      console.error('Forgot password error:', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AuthPage
      title="Forgot Password"
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      serverError={null} // We show a success message instead for security
      setServerError={setServerError}
      submitButtonText="Send Reset Link"
      footerLink={{ text: "Back to Login", to: '/login' }}
      showSocialLogins={false}
    >
      <motion.div variants={itemVariants}>
        <Typography variant="body2" align="center" sx={{ mb: 2 }}>
            Enter your email and we'll send a link to reset your password.
        </Typography>
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
          disabled={isSubmitting || !!successMessage}
        />
      </motion.div>
      
      {successMessage && (
        <motion.div variants={itemVariants}>
            <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{successMessage}</Alert>
        </motion.div>
      )}
    </AuthPage>
  );
};

export default ForgotPasswordPage;