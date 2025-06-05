import api, { getApiBaseUrl } from './api'; // Import our configured Axios instance
import type { User } from '../contexts/AuthContext'; // Reuse the User type

// Interfaces based on your backend's DTOs
interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData extends LoginCredentials {
  name: string;
}

// Data shape for a successful authentication
interface AuthSuccessData {
  user: User;
  token: string;
  refreshToken: string;
  // other fields from your backend response can be added here
}

// Generic wrapper for all API responses from your backend
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthSuccessData>> {
    const { data } = await api.post('/auth/signin', credentials);
    return data;
  }

  async signup(signupData: SignupData): Promise<ApiResponse<{ user: User; requires_verification?: boolean }>> {
    const { data } = await api.post('/auth/signup', signupData);
    return data;
  }

  async logout(token: string): Promise<void> {
    // It's good practice to notify the backend of logout for session invalidation
    // Your backend's `signOut` takes an optional token, so we send it.
    await api.post('/auth/signout', { token });
  }

  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    const { data } = await api.post('/auth/password/reset', { email });
    return data;
  }

  async updatePassword(token: string, newPassword: string): Promise<ApiResponse<null>> {
    const { data } = await api.post('/auth/password/update', { token, newPassword });
    return data;
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthSuccessData>> {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data;
  }

  // This calls a protected route to get the current user's info
  async validateSession(): Promise<{ user: User }> {
    const { data } = await api.get('/auth/me'); // Assuming a /me or /profile endpoint
    return data;
  }

  // Social login is handled by redirecting to the backend
  getSocialLoginUrl(provider: 'google' | 'github'): string {
    // Construct the full URL to the backend's social auth endpoint
    return `${getApiBaseUrl()}/auth/${provider}`;
  }
}

export const authService = new AuthService(); 