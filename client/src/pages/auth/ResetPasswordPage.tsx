import React, { useState, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import { motion } from 'framer-motion';

import { supabase } from '@/config/supabaseClient';
import AuthPage from '@/components/auth/AuthPage';

interface ResetPasswordFormInputs {
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordFormInputs>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const newPassword = useRef({});
  newPassword.current = watch("newPassword", "");

  const onSubmit: SubmitHandler<ResetPasswordFormInputs> = async (data) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });
      if (error) throw error;
      
      // Optional: Add a success message before redirecting
      setTimeout(() => navigate('/dashboard'), 2000);

    } catch (error: any) {
      setServerError(error.message || 'Failed to update password. The link may have expired.');
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
      title="Set Your New Password"
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      serverError={serverError}
      setServerError={setServerError}
      submitButtonText="Set New Password"
      footerLink={{ text: "Back to Login", to: '/login' }}
      showSocialLogins={false}
    >
      <motion.div variants={itemVariants}>
        <TextField
          label="New Password"
          type="password"
          fullWidth
          required
          {...register('newPassword', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message}
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
      </motion.div>
    </AuthPage>
  );
};

export default ResetPasswordPage;