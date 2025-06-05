import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Typography, Link, Box, CircularProgress, Alert, Divider } from '@mui/material';
import { FaGoogle, FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

import AuthLayout from '../../components/layout/AuthLayout';
import AuthFormContainer from '../../components/ui/AuthFormContainer';
import SocialButton from '../../components/ui/SocialButton';
// import { authService } from '../../services/authService'; // No longer directly needed here
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  
  const { login } = useAuth(); // Use login from AuthContext
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard"; // For redirecting after login

  const [isLoading, setIsLoading] = useState(false); // Keep local loading for form submission visual feedback
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await login(data); // Call login from AuthContext
      navigate(from, { replace: true }); // Navigate to intended page or dashboard
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setServerError(errorMessage);
      console.error('Login failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsSocialLoading(provider);
    setServerError(null);
    console.log(`Attempting ${provider} login...`);
    // TODO: Implement social login via AuthContext if needed
    // await socialLogin(provider); 
    setTimeout(() => {
      console.log(`${provider} login flow completed (simulated).`);
      setServerError(`Social login with ${provider} is not yet implemented in AuthContext.`);
      setIsSocialLoading(null);
      // navigate(from, { replace: true });
    }, 1500);
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
            disabled={isLoading || !!isSocialLoading}
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
            disabled={isLoading || !!isSocialLoading}
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
            disabled={isLoading || !!isSocialLoading}
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
            onClick={() => handleSocialLogin('Google')} 
            isLoading={isSocialLoading === 'Google'}
            disabled={isLoading || !!isSocialLoading}
          >
            Sign in with Google
          </SocialButton>
        </motion.div>
        <motion.div variants={itemVariants}>
          <SocialButton 
            icon={FaGithub} 
            onClick={() => handleSocialLogin('GitHub')} 
            isLoading={isSocialLoading === 'GitHub'}
            disabled={isLoading || !!isSocialLoading}
          >
            Sign in with GitHub
          </SocialButton>
        </motion.div>
        <motion.div variants={itemVariants}>
          <SocialButton 
            icon={FaLinkedin} 
            onClick={() => handleSocialLogin('LinkedIn')}
            isLoading={isSocialLoading === 'LinkedIn'}
            disabled={isLoading || !!isSocialLoading}
          >
            Sign in with LinkedIn
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