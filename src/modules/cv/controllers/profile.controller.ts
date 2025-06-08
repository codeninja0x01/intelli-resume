import { Response } from 'express';
import { profileService } from '../services/profile.service';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import { BaseController } from '@/modules/base.controller';
import createError from 'http-errors';

export class ProfileController extends BaseController {
  /**
   * Gets the profile for the currently authenticated user.
   * The user ID is securely attached to the request by the `authenticateToken` middleware.
   */
  async getMyProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const profile = await profileService.getProfileById(userId);

      if (!profile) {
        // This case should be rare if the JWT is valid, but it's good practice to handle it.
        throw createError(404, 'User profile not found for the provided token.', { code: 'PROFILE_NOT_FOUND' });
      }

      // Use the existing service method to format the response
      const userResponse = profileService.profileToUser(profile);
      this.sendSuccess(res, userResponse, 'Profile retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve profile');
    }
  }
}

export const profileController = new ProfileController();