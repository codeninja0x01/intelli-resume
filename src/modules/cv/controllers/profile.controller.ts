import { Response } from 'express';
import { profileService } from '../services/profile.service';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import { BaseController } from '@/modules/base.controller';
import { CreateProfileDto } from '../types/profile.types';
import createError from 'http-errors';

export class ProfileController extends BaseController {
	/**
	 * Gets the profile for the currently authenticated user.
	 */
	async getMyProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
		try {
			const userId = req.user!.id;
			const profile = await profileService.getProfileById(userId);

			if (!profile) {
				throw createError(404, 'User profile not found.', { code: 'PROFILE_NOT_FOUND' });
			}
			const userResponse = profileService.profileToUser(profile);
			this.sendSuccess(res, userResponse, 'Profile retrieved successfully', 200);
		} catch (error: any) {
			this.handleError(error, res, 'Failed to retrieve profile');
		}
	}

	/**
	 * Creates a user profile from a Supabase Auth user object.
	 * This is designed to be called securely after a new user signs up.
	 */
	async createProfileFromAuth(req: AuthenticatedRequest, res: Response): Promise<void> {
		const authUser = req.user;

		try {
			if (!authUser || !authUser.id || !authUser.email) {
				throw createError(400, 'Auth user ID and email are required.', { code: 'INVALID_AUTH_USER' });
			}

			const existingProfile = await profileService.getProfileByEmail(authUser.email);

			if (existingProfile) {
				const userResponse = profileService.profileToUser(existingProfile);
				this.sendSuccess(res, userResponse, 'User already exists.', 200);
				return;
			}

			// Map the authenticated user data to our DTO
			const profileData: CreateProfileDto = {
				id: authUser.id,
				email: authUser.email,
				firstName: authUser.user_metadata?.firstName || authUser.user_metadata?.name?.split(' ')[0],
				lastName: authUser.user_metadata?.lastName || authUser.user_metadata?.name?.split(' ').slice(1).join(' '),
				profilePictureUrl: authUser.user_metadata?.avatar_url,
			};

			const newProfile = await profileService.createProfile(profileData);

			const userResponse = profileService.profileToUser(newProfile);
			this.sendSuccess(res, userResponse, 'Profile created successfully.', 201);
		} catch (error: any) {
			this.handleError(error, res, 'Failed to create profile from auth user');
		}
	}

	/**
	 * Mark onboarding as completed for the authenticated user.
	 */
	async completeOnboarding(req: AuthenticatedRequest, res: Response): Promise<void> {
		try {
			const userId = req.user!.id;
			const profile = await profileService.getProfileById(userId);

			if (!profile) {
				throw createError(404, 'User profile not found.', { code: 'PROFILE_NOT_FOUND' });
			}

			const updatedProfile = await profile.completeOnboarding();
			const userResponse = profileService.profileToUser(updatedProfile);
			
			this.sendSuccess(res, userResponse, 'Onboarding completed successfully');
		} catch (error: any) {
			this.handleError(error, res, 'Failed to complete onboarding');
		}
	}
}

export const profileController = new ProfileController();
