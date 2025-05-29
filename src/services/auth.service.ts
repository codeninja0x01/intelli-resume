import { supabase } from '../config/supabase';
import { AuthResponse, CreateUserDto, LoginDto, UpdateUserDto } from '../types';
import { profileService } from './profile.service';

export class AuthService {
  // Sign up new user
  async signUp(userData: CreateUserDto): Promise<AuthResponse> {
    const { email, password, firstName, lastName } = userData;

    // Check if user already exists in our database
    const existingProfile = await profileService.userExists(email);
    if (existingProfile) {
      throw new Error('User already exists');
    }

    // Sign up user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
          role: userData.role || 'user',
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('User creation failed');
    }

    // Create user profile using Sequelize
    try {
      const profile = await profileService.createProfile({
        id: data.user.id,
        email,
        firstName,
        lastName,
        role: userData.role || 'user',
      });

      return {
        user: profileService.profileToUser(profile),
        token: data.session?.access_token || '',
        ...(data.session?.refresh_token && { refreshToken: data.session.refresh_token }),
      };
    } catch (profileError: any) {
      // If profile creation fails, we should clean up the auth user
      // Note: This might require admin privileges
      console.error('Profile creation failed:', profileError);
      throw new Error('Failed to create user profile');
    }
  }

  // Sign in user
  async signIn(loginData: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginData;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user || !data.session) {
      throw new Error('Authentication failed');
    }

    // Get user profile using Sequelize
    const profile = await profileService.getProfileById(data.user.id);
    if (!profile) {
      throw new Error('User profile not found');
    }

    return {
      user: profileService.profileToUser(profile),
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };
  }

  // Sign out user
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user || !data.session) {
      throw new Error('Token refresh failed');
    }

    // Get user profile using Sequelize
    const profile = await profileService.getProfileById(data.user.id);
    if (!profile) {
      throw new Error('User profile not found');
    }

    return {
      user: profileService.profileToUser(profile),
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };
  }

  // Get user by ID
  async getUserById(userId: string) {
    const profile = await profileService.getProfileById(userId);
    
    if (!profile) {
      return null;
    }

    return profileService.profileToUser(profile);
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    // Verify user exists in our database
    const profile = await profileService.getProfileByEmail(email);
    if (!profile) {
      throw new Error('User not found');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  // Update password
  async updatePassword(token: string, newPassword: string): Promise<void> {
    // Set the session with the provided token
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: '', // This might need to be provided
    });

    if (sessionError) {
      throw new Error('Invalid session');
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, updateData: UpdateUserDto) {
    const profile = await profileService.updateProfile(userId, updateData);
    if (!profile) {
      throw new Error('User profile not found');
    }

    return profileService.profileToUser(profile);
  }

  // Delete user account
  async deleteUserAccount(userId: string): Promise<void> {
    // First delete the profile
    const deleted = await profileService.deleteProfile(userId);
    if (!deleted) {
      throw new Error('User profile not found');
    }

    // Note: Deleting from Supabase Auth requires admin privileges
    // You might want to handle this differently in production
  }
}

export const authService = new AuthService(); 