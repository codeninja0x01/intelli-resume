import { Profile } from '../models/Profile.model';
import { CreateUserDto, UpdateUserDto, User } from '../types';

export class ProfileService {
  // Create user profile
  async createProfile(profileData: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role?: 'user' | 'admin';
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    bio?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    profilePictureUrl?: string;
  }): Promise<Profile> {
    try {
      const profile = await Profile.create({
        id: profileData.id,
        email: profileData.email,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
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
      return profile;
    } catch (error: any) {
      console.error('Error creating profile:', error);
      throw new Error('Failed to create user profile');
    }
  }

  // Get profile by ID
  async getProfileById(userId: string): Promise<Profile | null> {
    try {
      const profile = await Profile.findByPk(userId);
      return profile;
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  // Get profile by email
  async getProfileByEmail(email: string): Promise<Profile | null> {
    try {
      const profile = await Profile.findOne({
        where: { email },
      });
      return profile;
    } catch (error: any) {
      console.error('Error fetching profile by email:', error);
      return null;
    }
  }

  // Update profile
  async updateProfile(
    userId: string,
    updateData: UpdateUserDto
  ): Promise<Profile | null> {
    try {
      const profile = await Profile.findByPk(userId);
      if (!profile) {
        return null;
      }

      const updatedProfile = await profile.updateProfile(updateData);
      return updatedProfile;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  // Delete profile
  async deleteProfile(userId: string): Promise<boolean> {
    try {
      const profile = await Profile.findByPk(userId);
      if (!profile) {
        return false;
      }

      await profile.destroy();
      return true;
    } catch (error: any) {
      console.error('Error deleting profile:', error);
      throw new Error('Failed to delete user profile');
    }
  }

  // Get all profiles (admin only)
  async getAllProfiles(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{
    profiles: Profile[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const offset = (page - 1) * limit;
      
      const whereClause: any = {};
      if (search) {
        whereClause[Symbol.for('or')] = [
          { firstName: { [Symbol.for('iLike')]: `%${search}%` } },
          { lastName: { [Symbol.for('iLike')]: `%${search}%` } },
          { email: { [Symbol.for('iLike')]: `%${search}%` } },
        ];
      }

      const { count, rows } = await Profile.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['created_at', 'DESC']],
      });

      return {
        profiles: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
      };
    } catch (error: any) {
      console.error('Error fetching profiles:', error);
      throw new Error('Failed to fetch user profiles');
    }
  }

  // Convert Profile model to User type
  profileToUser(profile: Profile): User {
    const user: User = {
      id: profile.id,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      name: profile.name, // computed field
      displayName: profile.getDisplayName(), // user-friendly display name
      tokenBalance: profile.tokenBalance,
      role: profile.role,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };

    // Add optional fields only if they exist
    if (profile.phone !== null && profile.phone !== undefined) user.phone = profile.phone;
    if (profile.address !== null && profile.address !== undefined) user.address = profile.address;
    if (profile.city !== null && profile.city !== undefined) user.city = profile.city;
    if (profile.state !== null && profile.state !== undefined) user.state = profile.state;
    if (profile.postalCode !== null && profile.postalCode !== undefined) user.postalCode = profile.postalCode;
    if (profile.country !== null && profile.country !== undefined) user.country = profile.country;
    if (profile.bio !== null && profile.bio !== undefined) user.bio = profile.bio;
    if (profile.linkedinUrl !== null && profile.linkedinUrl !== undefined) user.linkedinUrl = profile.linkedinUrl;
    if (profile.githubUrl !== null && profile.githubUrl !== undefined) user.githubUrl = profile.githubUrl;
    if (profile.portfolioUrl !== null && profile.portfolioUrl !== undefined) user.portfolioUrl = profile.portfolioUrl;
    if (profile.profilePictureUrl !== null && profile.profilePictureUrl !== undefined) user.profilePictureUrl = profile.profilePictureUrl;
    if (profile.avatar_url !== null && profile.avatar_url !== undefined) user.avatar_url = profile.avatar_url;

    return user;
  }

  // Check if user exists by email
  async userExists(email: string): Promise<boolean> {
    try {
      const profile = await Profile.findOne({
        where: { email },
        attributes: ['id'],
      });
      return !!profile;
    } catch (error: any) {
      console.error('Error checking user existence:', error);
      return false;
    }
  }

  // Update user role (admin only)
  async updateUserRole(
    userId: string,
    role: 'user' | 'admin'
  ): Promise<Profile | null> {
    try {
      const profile = await Profile.findByPk(userId);
      if (!profile) {
        return null;
      }

      await profile.update({ role });
      return profile;
    } catch (error: any) {
      console.error('Error updating user role:', error);
      throw new Error('Failed to update user role');
    }
  }

  // Get user stats (admin only)
  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    adminUsers: number;
    recentUsers: number;
  }> {
    try {
      const totalUsers = await Profile.count();
      const adminUsers = await Profile.count({
        where: { role: 'admin' },
      });

      // Users created in the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentUsers = await Profile.count({
        where: {
          created_at: {
            [Symbol.for('gte')]: sevenDaysAgo,
          },
        },
      });

      return {
        totalUsers,
        activeUsers: totalUsers, // You might want to track last_active_at
        adminUsers,
        recentUsers,
      };
    } catch (error: any) {
      console.error('Error fetching user stats:', error);
      throw new Error('Failed to fetch user statistics');
    }
  }
}

export const profileService = new ProfileService(); 