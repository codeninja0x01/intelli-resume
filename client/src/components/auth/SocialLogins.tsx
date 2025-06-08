import React from 'react';
import { Divider, Typography } from '@mui/material';
import { FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';

import { supabase } from '@/config/supabaseClient';
import SocialButton from '@/components/ui/SocialButton';

interface SocialLoginsProps {
  isSubmitting: boolean;
  setServerError: (error: string | null) => void;
}

const SocialLogins: React.FC<SocialLoginsProps> = ({ isSubmitting, setServerError }) => {
  
  const handleSocialLogin = async (provider: 'google' | 'github' | 'facebook') => {
    if (isSubmitting) return;

    setServerError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          /**
           * NEW: This query parameter forces the user to see the account
           * selection screen every time, preventing automatic re-login
           * with a previously used account.
           */
          queryParams: {
            prompt: 'select_account',
          },
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setServerError(error.message || `Failed to sign in with ${provider}.`);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };
  
  return (
    <>
      <motion.div variants={itemVariants}>
        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Or continue with</Typography>
        </Divider>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SocialButton
          icon={FaGoogle}
          onClick={() => handleSocialLogin('google')}
          disabled={isSubmitting}
        >
          Sign in with Google
        </SocialButton>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SocialButton
          icon={FaGithub}
          onClick={() => handleSocialLogin('github')}
          disabled={isSubmitting}
        >
          Sign in with GitHub
        </SocialButton>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SocialButton
          icon={FaFacebook}
          onClick={() => handleSocialLogin('facebook')}
          disabled={isSubmitting}
        >
          Sign in with Facebook
        </SocialButton>
      </motion.div>
    </>
  );
};

export default SocialLogins;