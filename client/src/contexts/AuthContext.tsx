import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService'; // Adjust path as needed

// Define User and AuthState types
export interface User {
  id?: string; // Optional: if your backend provides an ID
  name: string;
  email: string;
  // Add other user-specific fields if necessary
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>; // Replace 'any' with LoginCredentials from authService if preferred
  signup: (signupData: any) => Promise<void>; // Replace 'any' with SignupData from authService
  logout: () => void;
}

// Create the context with a default undefined value to ensure consumers are within a provider
const AuthContext = createContext<AuthState | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true); // Start with loading true to check token

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        // TODO: Add a service call to validate token with backend if necessary
        // For now, if token exists, assume it's valid and try to fetch user profile
        // Or, if user data is stored in localStorage alongside token, retrieve it.
        // This is a simplified version. A real app might decode the token or fetch user data.
        try {
            // Placeholder: If your token contains user info or you have a /me endpoint
            // For this example, if a token exists, we'll try to re-login or fetch user
            // Let's assume the token itself is enough for now, or you stored user with token
            const storedUser = localStorage.getItem('authUser');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else if (token) {
                // If only token is stored, you might need a /me endpoint
                // For simplicity, we'll just say if a token exists, we are kind of authenticated
                // but ideally, you'd fetch user details here.
                // setUser({ name: 'User from Token', email: 'user@token.com'}); // Example
            }
        } catch (error) {
            console.error("Failed to validate token or fetch user", error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            setToken(null);
            setUser(null);
        }
      } 
      setIsLoading(false);
    };
    validateToken();
  }, [token]);

  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('authUser', JSON.stringify(response.user));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error; // Re-throw to be caught by the calling component
    }
  };

  const signup = async (signupData: any) => {
    setIsLoading(true);
    try {
      const response = await authService.signup(signupData);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('authUser', JSON.stringify(response.user));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    // Optionally, redirect to login page or notify backend
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user, // Or just !!token if user object might not be immediately available
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 