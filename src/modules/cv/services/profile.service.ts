import { Profile } from '../models/Profile.model';
import { UpdateUserDto, User } from '@/shared/types-index';
import createError from 'http-errors';
import { Op } from 'sequelize';
import { CreateProfileDto } from '../types/profile.types';

export class ProfileService {
	/**
	 * Creates a new user profile using a DTO.
	 * @param profileData The data for the new profile, conforming to CreateProfileDto.
	 */
	async createProfile(profileData: CreateProfileDto): Promise<Profile> {
		const profile = await Profile.create({
			id: profileData.id,
			email: profileData.email,
			firstName: profileData.firstName || 'New', // Default value
			lastName: profileData.lastName || 'User', // Default value
			role: profileData.role || 'user',
			phone: profileData.phone,
			address: profileData.address,
			city: profileData.city,
			state: profileData.state,
			postalCode: profileData.postalCode,
			country: profileData.country,
			tokenBalance: 0, // Default to 0
			bio: profileData.bio,
			linkedinUrl: profileData.linkedinUrl,
			githubUrl: profileData.githubUrl,
			portfolioUrl: profileData.portfolioUrl,
			profilePictureUrl: profileData.profilePictureUrl,
		});

		if (!profile) {
			throw createError(500, 'Failed to create user profile', {
				code: 'PROFILE_CREATION_FAILED',
			});
		}

		return profile;
	}

	// ... other existing methods in ProfileService ...

	async getProfileById(userId: string): Promise<Profile | null> {
		const profile = await Profile.findByPk(userId);
		return profile;
	}

	async getProfileByEmail(email: string): Promise<Profile | null> {
		const profile = await Profile.findOne({
			where: { email },
		});
		return profile;
	}

	async updateProfile(userId: string, updateData: UpdateUserDto): Promise<Profile | null> {
		const profile = await Profile.findByPk(userId);
		if (!profile) {
			return null;
		}

		const updatedProfile = await profile.updateProfile(updateData);
		if (!updatedProfile) {
			throw createError(500, 'Failed to update user profile', {
				code: 'PROFILE_UPDATE_FAILED',
			});
		}

		return updatedProfile;
	}

	async deleteProfile(userId: string): Promise<boolean> {
		const profile = await Profile.findByPk(userId);
		if (!profile) {
			return false;
		}

		await profile.destroy();
		return true;
	}

	async getAllProfiles(
		page: number = 1,
		limit: number = 10,
		search?: string,
		sortBy?: string,
		sortOrder?: 'asc' | 'desc',
	): Promise<{
		profiles: Profile[];
		total: number;
		page: number;
		totalPages: number;
	}> {
		const offset = (page - 1) * limit;

		const whereClause: any = {};
		if (search) {
			whereClause[Op.or] = [
				{ firstName: { [Op.iLike]: `%${search}%` } },
				{ lastName: { [Op.iLike]: `%${search}%` } },
				{ email: { [Op.iLike]: `%${search}%` } },
			];
		}

		const validSortFields = ['firstName', 'lastName', 'email', 'created_at', 'updated_at'];
		const orderBy = validSortFields.includes(sortBy || '') ? sortBy : 'created_at';
		const order = sortOrder === 'asc' ? 'ASC' : 'DESC';

		const { count, rows } = await Profile.findAndCountAll({
			where: whereClause,
			limit,
			offset,
			order: [[orderBy as string, order]],
		});

		return {
			profiles: rows,
			total: count,
			page,
			totalPages: Math.ceil(count / limit),
		};
	}

	profileToUser(profile: Profile): User {
		return {
			id: profile.id,
			email: profile.email,
			firstName: profile.firstName,
			lastName: profile.lastName,
			name: profile.name,
			displayName: profile.getDisplayName(),
			tokenBalance: profile.tokenBalance,
			role: profile.role,
			isFirstTimeUser: profile.isFirstTimeUser,
			createdAt: profile.created_at,
			updatedAt: profile.updated_at,

			...(profile.phone && { phone: profile.phone }),
			...(profile.address && { address: profile.address }),
			...(profile.city && { city: profile.city }),
			...(profile.state && { state: profile.state }),
			...(profile.postalCode && { postalCode: profile.postalCode }),
			...(profile.country && { country: profile.country }),
			...(profile.bio && { bio: profile.bio }),
			...(profile.linkedinUrl && { linkedinUrl: profile.linkedinUrl }),
			...(profile.githubUrl && { githubUrl: profile.githubUrl }),
			...(profile.portfolioUrl && { portfolioUrl: profile.portfolioUrl }),
			...(profile.profilePictureUrl && { profilePictureUrl: profile.profilePictureUrl }),
			...(profile.avatar_url && { avatar_url: profile.avatar_url }),
		};
	}

	async userExists(email: string): Promise<boolean> {
		const profile = await Profile.findOne({
			where: { email },
			attributes: ['id'],
		});
		return !!profile;
	}

	async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<Profile> {
		const profile = await Profile.findByPk(userId);
		if (!profile) {
			throw createError(404, 'User profile not found', {
				code: 'USER_NOT_FOUND',
			});
		}

		await profile.update({ role });
		return profile;
	}

	async getUserStats(): Promise<{
		totalUsers: number;
		activeUsers: number;
		adminUsers: number;
		recentUsers: number;
	}> {
		const [totalUsers, adminUsers, recentUsers] = await Promise.all([
			Profile.count(),
			Profile.count({ where: { role: 'admin' } }),
			Profile.count({
				where: {
					created_at: {
						[Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
					},
				},
			}),
		]);

		return {
			totalUsers,
			activeUsers: totalUsers,
			adminUsers,
			recentUsers,
		};
	}

	async getProfilesByRole(role: 'user' | 'admin'): Promise<Profile[]> {
		return await Profile.findAll({
			where: { role },
			order: [['created_at', 'DESC']],
		});
	}

	async updateTokenBalance(userId: string, amount: number): Promise<Profile> {
		const profile = await Profile.findByPk(userId);
		if (!profile) {
			throw createError(404, 'User profile not found', {
				code: 'USER_NOT_FOUND',
			});
		}

		const newBalance = profile.tokenBalance + amount;
		if (newBalance < 0) {
			throw createError(400, 'Insufficient token balance', {
				code: 'INSUFFICIENT_BALANCE',
			});
		}

		await profile.update({ tokenBalance: newBalance });
		return profile;
	}

	async bulkUpdateProfiles(updates: { id: string; data: Partial<UpdateUserDto> }[]): Promise<number> {
		let updatedCount = 0;

		for (const update of updates) {
			const profile = await this.updateProfile(update.id, update.data as UpdateUserDto);
			if (profile) updatedCount++;
		}

		return updatedCount;
	}
}

export const profileService = new ProfileService();
