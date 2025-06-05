import axios from 'axios';
import { authService } from './authService'; // Import authService directly

export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || '/api';
}

// Create a new Axios instance with a custom configuration
const api = axios.create({
  baseURL: getApiBaseUrl(), // Your backend API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the Authorization header on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Ensure the 'headers' property exists and is correctly typed
      config.headers = config.headers ?? {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors here
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refreshing
api.interceptors.response.use(
  (response) => response, // Directly return successful responses
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 and we haven't already tried to refresh the token for this request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark that we've tried to refresh

      try {
        const refreshToken = localStorage.getItem('authRefreshToken');
        if (!refreshToken) {
          // No refresh token available, so we can't refresh. 
          // Logout or redirect logic should be handled by the UI based on this final error.
          return Promise.reject(error);
        }
        
        // Call your authService's refreshToken method
        const response = await authService.refreshToken(refreshToken);
        const authData = response.data; // This is the AuthSuccessData object

        // Update tokens in localStorage
        localStorage.setItem('authToken', authData.token);
        if (authData.refreshToken) {
          localStorage.setItem('authRefreshToken', authData.refreshToken);
        }

        // Update the authorization header of the original request and retry it
        originalRequest.headers['Authorization'] = `Bearer ${authData.token}`;
        return api(originalRequest);

      } catch (refreshError) {
        // Refreshing the token failed. Clear tokens and let the app handle the logout.
        localStorage.removeItem('authToken');
        localStorage.removeItem('authRefreshToken');
        // Redirect to login or let a protected route handle it.
        // window.location.href = '/login'; // This can be an option
        return Promise.reject(refreshError);
      }
    }

    // For any other errors, just reject the promise
    return Promise.reject(error);
  }
);

export default api; 