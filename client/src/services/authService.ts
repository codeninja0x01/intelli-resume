// Placeholder authService
interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  name: string;
  email: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface SignupData {
    name: string;
    email: string;
    password: string;
    // confirmPassword is typically handled client-side
}

interface ResetPasswordData {
  token: string; // This would typically come from the URL
  newPassword: string;
  // confirmPassword is for client-side validation
}

export const authService = {
  login: async (data: LoginCredentials): Promise<LoginResponse> => {
    console.log('Login attempt with:', data);
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.email === 'test@example.com' && data.password === 'password') {
          resolve({ token: 'fake-jwt-token', user: { name: 'Test User', email: data.email } });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  },

  signup: async (data: SignupData): Promise<LoginResponse> => { // Assuming signup also returns token and user
    console.log('Signup attempt with:', data);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.email && data.password && data.name) {
          // Simulate new user creation
          resolve({ token: 'new-fake-jwt-token', user: { name: data.name, email: data.email } });
        } else {
          reject(new Error('Missing required signup information'));
        }
      }, 1000);
    });
  },

  forgotPassword: async (email: string): Promise<void> => {
    console.log('Forgot password attempt for email:', email);
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success for any email for now, or specific ones like 'exists@example.com'
        if (email) { 
          console.log('Password reset email sent (simulated) to:', email);
          resolve();
        } else {
          // This case should ideally be caught by form validation
          reject(new Error('Email is required.'));
        }
      }, 1000);
    });
  },

  resetPassword: async (data: ResetPasswordData): Promise<void> => {
    console.log('Reset password attempt for token:', data.token, 'with new password.');
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.token === 'valid-reset-token' && data.newPassword) {
          console.log('Password has been reset successfully (simulated).');
          resolve();
        } else if (data.token !== 'valid-reset-token') {
          reject(new Error('Invalid or expired reset token.'));
        } else {
          reject(new Error('New password is required.'));
        }
      }, 1000);
    });
  }
}; 