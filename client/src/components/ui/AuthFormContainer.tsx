import React from 'react';
import { Box } from '@mui/material'; // Keep Box for sx prop, or apply sx directly to motion.form
import { motion, type HTMLMotionProps } from 'framer-motion';

// Props for the motion.form component, excluding 'onSubmit' as we handle it via react-hook-form pass-through
interface AuthFormContainerProps extends Omit<HTMLMotionProps<'form'>, 'onSubmit'> {
  children: React.ReactNode;
  onSubmit: (event?: React.BaseSyntheticEvent) => void | Promise<void>; // From react-hook-form handleSubmit
}

const AuthFormContainer: React.FC<AuthFormContainerProps> = ({ children, onSubmit, ...props }) => {
  return (
    <motion.form
      onSubmit={onSubmit}
      style={{
        width: '100%', 
        marginTop: '8px', // Equivalent to theme.spacing(1) 
        display: 'flex',
        flexDirection: 'column',
        gap: '16px', // Equivalent to theme.spacing(2)
      }}
      noValidate // Typically added to forms when using react-hook-form
      {...props} // This will spread variants, initial, animate, etc.
    >
      {children}
    </motion.form>
  );
};

export default AuthFormContainer; 