import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { ApiResponse, CreateUserDto, LoginDto } from '../types';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class AuthController {
  // Sign up
  async signUp(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserDto = req.body;
      
      // Basic validation
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
        const response: ApiResponse = {
          success: false,
          message: 'Email, password, first name, and last name are required',
          error: 'Validation Error',
        };
        res.status(400).json(response);
        return;
      }

      const result = await authService.signUp(userData);
      
      const response: ApiResponse = {
        success: true,
        message: 'User created successfully',
        data: result,
      };
      
      res.status(201).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || 'Failed to create user',
        error: 'Sign Up Error',
      };
      res.status(400).json(response);
    }
  }

  // Sign in
  async signIn(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginDto = req.body;
      
      if (!loginData.email || !loginData.password) {
        const response: ApiResponse = {
          success: false,
          message: 'Email and password are required',
          error: 'Validation Error',
        };
        res.status(400).json(response);
        return;
      }

      const result = await authService.signIn(loginData);
      
      const response: ApiResponse = {
        success: true,
        message: 'Signed in successfully',
        data: result,
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || 'Authentication failed',
        error: 'Sign In Error',
      };
      res.status(401).json(response);
    }
  }

  // Sign out
  async signOut(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      await authService.signOut();
      
      const response: ApiResponse = {
        success: true,
        message: 'Signed out successfully',
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || 'Sign out failed',
        error: 'Sign Out Error',
      };
      res.status(400).json(response);
    }
  }

  // Refresh token
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        const response: ApiResponse = {
          success: false,
          message: 'Refresh token is required',
          error: 'Validation Error',
        };
        res.status(400).json(response);
        return;
      }

      const result = await authService.refreshToken(refreshToken);
      
      const response: ApiResponse = {
        success: true,
        message: 'Token refreshed successfully',
        data: result,
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || 'Token refresh failed',
        error: 'Token Refresh Error',
      };
      res.status(401).json(response);
    }
  }

  // Get current user
  async getCurrentUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = await authService.getUserById(req.user.id);
      
      if (!user) {
        const response: ApiResponse = {
          success: false,
          message: 'User not found',
          error: 'Not Found',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'User retrieved successfully',
        data: user,
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || 'Failed to get user',
        error: 'User Retrieval Error',
      };
      res.status(400).json(response);
    }
  }

  // Reset password
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      
      if (!email) {
        const response: ApiResponse = {
          success: false,
          message: 'Email is required',
          error: 'Validation Error',
        };
        res.status(400).json(response);
        return;
      }

      await authService.resetPassword(email);
      
      const response: ApiResponse = {
        success: true,
        message: 'Password reset email sent',
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || 'Password reset failed',
        error: 'Password Reset Error',
      };
      res.status(400).json(response);
    }
  }

  // Update password
  async updatePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { newPassword } = req.body;
      
      if (!newPassword) {
        const response: ApiResponse = {
          success: false,
          message: 'New password is required',
          error: 'Validation Error',
        };
        res.status(400).json(response);
        return;
      }

      const token = req.headers.authorization?.split(' ')[1] || '';
      await authService.updatePassword(token, newPassword);
      
      const response: ApiResponse = {
        success: true,
        message: 'Password updated successfully',
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || 'Password update failed',
        error: 'Password Update Error',
      };
      res.status(400).json(response);
    }
  }
}

export const authController = new AuthController(); 