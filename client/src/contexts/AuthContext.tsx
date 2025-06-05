import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';

// Define and export the User type. This should match the user object returned by your backend.
export interface User {
  id: string;
  email?: string;
  role?: string;
  // Add other properties your backend sends for the user, like 'full_name'
}

// Define the shape of the context state
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<any>;
  signup: (signupData: any) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start true to check session

  // On initial load, check for a stored token and validate it with the backend
  useEffect(() => {
    const validateAndSetUser = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Make a request to a protected backend route to get user info
          const { user: validatedUser } = await authService.validateSession();
          setUser(validatedUser);
        } catch (error) {
          console.error("Session validation failed:", error);
          // Token is invalid or expired, clear it
          localStorage.removeItem('authToken');
          localStorage.removeItem('authRefreshToken');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    validateAndSetUser();
  }, []);

  // Helper to handle storing session data after a successful login/signup
  const handleAuthSuccess = (authResponse: any) => {
    // The API response has a 'data' property containing user and tokens
    if (authResponse?.data?.user && authResponse?.data?.token) {
      const { user, token, refreshToken } = authResponse.data;
      setUser(user);
      localStorage.setItem('authToken', token);
      if (refreshToken) {
        localStorage.setItem('authRefreshToken', refreshToken);
      }
    }
  };

  const login = async (credentials: any) => {
    const response = await authService.login(credentials);
    handleAuthSuccess(response);
    return response;
  };

  const signup = async (signupData: any) => {
    // Based on your backend, signup returns a message and doesn't create a session
    // until the user's email is verified. So we don't call handleAuthSuccess here.
    const response = await authService.signup(signupData);
    return response; // Return the full response so UI can show the verification message
  };

  const logout = async () => {
    const token = localStorage.getItem('authToken');
    try {
      if (token) {
        await authService.logout(token);
      }
    } catch (error) {
      console.error("Backend logout failed, proceeding with client-side logout.", error);
    } finally {
      // Always clear local state and storage
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authRefreshToken');
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 