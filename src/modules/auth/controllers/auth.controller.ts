import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { CreateUserDto, LoginDto } from '@/shared/types-index';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import { BaseController } from '@/modules/base.controller';
import createError from 'http-errors';

export class AuthController extends BaseController {
  // Extract device info from request
  private getDeviceInfo(req: Request): { ipAddress?: string; userAgent?: string } {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    
    return {
      ...(ipAddress && { ipAddress }),
      ...(userAgent && { userAgent }),
    };
  }

  // Sign up
  async signUp(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserDto = this.getValidatedData(req);
      const deviceInfo = this.getDeviceInfo(req);
      
      // Extract optional emailRedirectTo from request body
      const { emailRedirectTo } = req.body;
      
      const result = await authService.signUp(userData, deviceInfo, emailRedirectTo);
      
      this.sendSuccess(res, result, 'User created successfully', 201);
    } catch (error: any) {
      this.handleError(error, res, 'Failed to create user');
    }
  }

  // Sign in
  async signIn(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginDto = this.getValidatedData(req);
      const deviceInfo = this.getDeviceInfo(req);
      
      const result = await authService.signIn(loginData, deviceInfo);
      
      this.sendSuccess(res, result, 'Signed in successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Authentication failed', 401);
    }
  }

  // Admin sign in
  async adminSignIn(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginDto = this.getValidatedData(req);
      const deviceInfo = this.getDeviceInfo(req);
      
      const result = await authService.adminSignIn(loginData, deviceInfo);
      
      this.sendSuccess(res, result, 'Admin signed in successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Admin authentication failed', 401);
    }
  }

  // Extract redirect logic to separate method
  private handleSuccessRedirect(res: Response, result: any, nextUrl?: string): void {
    if (!nextUrl) {
      this.sendSuccess(res, result, result.message);
      return;
    }

    const decodedNext = decodeURIComponent(nextUrl);
    
    // Prevent redirect loops - don't redirect back to auth endpoints
    if (decodedNext.includes('/auth/') || decodedNext.includes('/api/auth/')) {
      this.sendSuccess(res, result, result.message);
      return;
    }

    // Handle different URL formats
    if (decodedNext.startsWith('http://') || decodedNext.startsWith('https://')) {
      res.redirect(303, decodedNext);
    } else {
      res.redirect(303, decodedNext.startsWith('/') ? decodedNext : `/${decodedNext}`);
    }
  }

  // Handle Supabase auth callback (email verification) - Refactored
  async authCallback(req: Request, res: Response): Promise<void> {
    try {
      // Merge body and query parameters (prioritize query for Supabase redirects)
      const { token_hash, type, next } = { ...this.getValidatedData(req), ...req.query };
      
      // Validate required parameters
      if (!token_hash || !type) {
        throw createError(400, 'Missing required verification parameters (token_hash and type)', {
          code: 'MISSING_VERIFICATION_PARAMS'
        });
      }

      // Process email verification
      const result = await authService.handleEmailVerification(token_hash as string, type as string);
      
      if (result.success) {
        this.handleSuccessRedirect(res, result, next as string);
      } else {
        this.sendMessage(res, result.message, 400);
      }
    } catch (error: any) {
      this.handleError(error, res, 'Email verification failed', 400);
    }
  }

  // Sign out
  async signOut(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      await authService.signOut(token);
      
      this.sendMessage(res, 'Signed out successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Sign out failed');
    }
  }

  // Refresh token
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = this.getValidatedData(req);
      
      const result = await authService.refreshToken(refreshToken);
      
      this.sendSuccess(res, result, 'Token refreshed successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Token refresh failed', 401);
    }
  }

  // Get current user
  async getCurrentUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = await authService.getUserById(req.user!.id);
      
      if (!user) {
        this.sendNotFound(res, 'User');
        return;
      }

      this.sendSuccess(res, user, 'User retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to get user');
    }
  }

  // Reset password
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = this.getValidatedData(req);
      
      await authService.resetPassword(email);
      
      this.sendMessage(res, 'Password reset email sent');
    } catch (error: any) {
      this.handleError(error, res, 'Password reset failed');
    }
  }

  // Update password
  async updatePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { newPassword } = this.getValidatedData(req);
      
      const token = req.headers.authorization?.split(' ')[1] || '';
      await authService.updatePassword(token, newPassword);
      
      this.sendMessage(res, 'Password updated successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Password update failed');
    }
  }
}

export const authController = new AuthController(); 