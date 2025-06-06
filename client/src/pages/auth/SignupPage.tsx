import React, { useState, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Typography, Link, Box, CircularProgress, Alert, Divider, Checkbox, FormControlLabel, LinearProgress } from '@mui/material';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';

import AuthLayout from '../../components/layout/AuthLayout';
import AuthFormContainer from '../../components/ui/AuthFormContainer';
import SocialButton from '../../components/ui/SocialButton';
import '../../components/ui/AnimatedBackground.css';

interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

const SignupPage: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormInputs>();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const password = useRef({});
  password.current = watch("password", "");

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    setIsLoading(true);
    setServerError(null);
    setSuccessMessage(null);
    try {
      const response = await signup(data);
      // Your backend returns a message on successful signup
      setSuccessMessage(response.message || 'Registration successful. Please check your email to confirm your account.');
    } catch (error: any) {
      setServerError(error?.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider: 'google' | 'github') => {
    window.location.href = authService.getSocialLoginUrl(provider);
  };
  
  const getPasswordStrength = (pw: string) => {
    let strength = 0;
    if (pw.length >= 8) strength++;
    if (pw.match(/[a-z]/)) strength++;
    if (pw.match(/[A-Z]/)) strength++;
    if (pw.match(/[0-9]/)) strength++;
    if (pw.match(/[^a-zA-Z0-9]/)) strength++;
    return Math.min(strength, 4);
  };
  const passwordStrength = getPasswordStrength(watch("password", ""));

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AuthLayout title="Create Your IntelliResume Account">
      <div className="animated-background"></div>
      <AuthFormContainer onSubmit={handleSubmit(onSubmit)} variants={formVariants} initial="hidden" animate="visible">
        {successMessage ? (
          <motion.div variants={itemVariants}>
            <Alert severity="success">{successMessage}</Alert>
          </motion.div>
        ) : (
          <>
            <motion.div variants={itemVariants}>
              <TextField
                label="Full Name"
                type="text"
                fullWidth
                required
                {...register('name', { required: 'Name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={isLoading}
              />
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

            <motion.div variants={itemVariants}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                {...register('password', { 
                  required: 'Password is required', 
                  minLength: { value: 8, message: "Password must be at least 8 characters" }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={isLoading}
              />
              {watch("password", "") && (
                <Box sx={{ mt: 1 }}>
                  <LinearProgress variant="determinate" value={(passwordStrength / 4) * 100} sx={{ height: '6px', borderRadius: '3px' }} />
                  <Typography variant="caption" color={passwordStrength < 2 ? 'error' : passwordStrength < 4 ? 'warning.main' : 'success.main' }>
                    {['Very Weak', 'Weak', 'Okay', 'Strong', 'Very Strong'][passwordStrength]}
                  </Typography>
                </Box>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                required
                {...register('confirmPassword', { 
                  required: 'Please confirm your password', 
                  validate: value => value === password.current || "The passwords do not match"
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                disabled={isLoading}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
                <FormControlLabel
                    control={<Checkbox {...register('agreeToTerms', { required: 'You must agree to the terms'})} color="primary" />}
                    label={<Typography variant="body2">I agree to the <Link href="/terms" target="_blank">Terms of Service</Link> and <Link href="/privacy" target="_blank">Privacy Policy</Link>.</Typography>}
                />
                {errors.agreeToTerms && <Typography variant="caption" color="error">{errors.agreeToTerms.message}</Typography>}
            </motion.div>

            {serverError && (
              <motion.div variants={itemVariants}>
                <Alert severity="error" sx={{ width: '100%' }}>{serverError}</Alert>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading}
                sx={{ mt: 2, py: 1.5 }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
              </Button>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Divider sx={{ my: 2 }}>Or sign up with</Divider>
            </motion.div>

            <motion.div variants={itemVariants}>
              <SocialButton 
                icon={FaGoogle} 
                onClick={() => handleSocialSignup('google')} 
                isLoading={isLoading}
                disabled={isLoading}
              >
                Sign up with Google
              </SocialButton>
            </motion.div>
            <motion.div variants={itemVariants}>
              <SocialButton 
                icon={FaGithub} 
                onClick={() => handleSocialSignup('github')} 
                isLoading={isLoading}
                disabled={isLoading}
              >
                Sign up with GitHub
              </SocialButton>
            </motion.div>
          </>
        )}

        <motion.div variants={itemVariants}>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login">
              Login
            </Link>
          </Typography>
        </motion.div>
      </AuthFormContainer>
    </AuthLayout>
  );
};

export default SignupPage; 