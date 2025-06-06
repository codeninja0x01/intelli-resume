import React, { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Link, Box, CircularProgress, Alert, Divider } from '@mui/material';
import { FaGoogle, FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';

import AuthLayout from '../../components/layout/AuthLayout';
import AuthFormContainer from '../../components/ui/AuthFormContainer';
import SocialButton from '../../components/ui/SocialButton';
import '../../components/ui/AnimatedBackground.css';

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await login(data);
      // On successful login, the AuthContext state will change,
      // and the useEffect above will handle the redirect.
      // We could also navigate here directly.
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      setServerError(error?.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    // Redirect the user to the backend's social auth endpoint
    window.location.href = authService.getSocialLoginUrl(provider);
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
    <AuthLayout title="Login to IntelliResume">
      <div className="animated-background"></div>
      <AuthFormContainer 
        onSubmit={handleSubmit(onSubmit)} 
        variants={formVariants} 
        initial="hidden" 
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            required
            {...register('email', { required: 'Email is required' })}
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
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={isLoading}
          />
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
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Box sx={{ mt: 1, textAlign: 'right' }}>
            <Link component={RouterLink} to="/forgot-password" variant="body2">
              Forgot password?
            </Link>
          </Box>
        </motion.div>

        <motion.div variants={itemVariants}>
            <Divider sx={{ my: 2 }}>Or continue with</Divider>
        </motion.div>

        <motion.div variants={itemVariants}>
          <SocialButton 
            icon={FaGoogle} 
            onClick={() => handleSocialLogin('google')} 
            isLoading={isLoading}
            disabled={isLoading}
          >
            Sign in with Google
          </SocialButton>
        </motion.div>
        <motion.div variants={itemVariants}>
          <SocialButton 
            icon={FaGithub} 
            onClick={() => handleSocialLogin('github')} 
            isLoading={isLoading}
            disabled={isLoading}
          >
            Sign in with GitHub
          </SocialButton>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account?{' '}
            <Link component={RouterLink} to="/signup">
              Sign Up
            </Link>
          </Typography>
        </motion.div>
      </AuthFormContainer>
    </AuthLayout>
  );
};

export default LoginPage; 