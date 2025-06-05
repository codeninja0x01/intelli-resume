import { AuthResponse, CreateUserDto, LoginDto, UpdateUserDto } from '@/shared/types-index';
import { profileService } from '@/modules/cv/services/profile.service';
import { sessionService } from './session.service';
import { tokenService } from './token.service';
import { SupabaseAuthService } from './supabase-auth.service';
import { AuthBusinessValidator } from '../validators/auth-business.validator';
import { AuthErrorUtil } from '../utils/auth-error.util';
import { AuthDataUtil } from '../utils/auth-data.util';
import { AUTH_CONSTANTS } from '../constants/auth.constants';

export class AuthService {
  /**
   * Enhanced signup with transaction safety and proper error handling
   */
  async signUp(
    userData: CreateUserDto, 
    deviceInfo?: { ipAddress?: string; userAgent?: string }, 
    emailRedirectTo?: string
  ): Promise<AuthResponse> {
    let supabaseUserId: string | null = null;
    let profileCreated = false;

    try {
      // Step 1: Validate business rules
      await AuthBusinessValidator.validateSignupBusinessRules(userData, deviceInfo?.ipAddress);

      // Step 2: Create user with Supabase Auth
      const supabaseData = await SupabaseAuthService.signUpUser(userData, emailRedirectTo);
      supabaseUserId = supabaseData.user.id;

      if (!supabaseUserId) {
        throw new Error('Failed to get user ID from Supabase response');
      }

      // Step 3: Create user profile with transaction safety
      const profileData = AuthDataUtil.buildProfileData(userData, supabaseUserId);
      
      try {
        const profile = await profileService.createProfile(profileData);
        if (!profile?.id) {
          throw new Error('Profile creation returned null or invalid profile');
        }
        profileCreated = true;

        // Step 4: Set initial account status
        await sessionService.setAccountStatus(profile.id, AUTH_CONSTANTS.ACCOUNT_STATUS.INACTIVE);

        // Step 5: Return success response
        return AuthDataUtil.buildAuthResponse(
          profileService.profileToUser(profile),
          null,
          'Registration successful. Please check your email to confirm your account.',
          true
        );

      } catch (profileError) {
        // Profile creation failed - initiate compensating transaction
        console.error('Profile creation failed, initiating cleanup:', profileError);
        
        if (supabaseUserId) {
          await SupabaseAuthService.cleanupOrphanedUser(supabaseUserId);
        }

        AuthErrorUtil.handleProfileError(profileError, 'Registration');
      }

    } catch (error) {
      // Handle any other errors during the process
      if (error instanceof Error && (error as any).status) {
        throw error;
      }

      // If we created a Supabase user but something else failed, clean it up
      if (supabaseUserId && !profileCreated) {
        await SupabaseAuthService.cleanupOrphanedUser(supabaseUserId);
      }

      AuthErrorUtil.handleOperationError(
        error, 
        'Registration', 
        AUTH_CONSTANTS.ERROR_CODES.REGISTRATION_FAILED
      );
    }
  }

  /**
   * Enhanced sign in with proper validation and session management
   */
  async signIn(
    loginData: LoginDto, 
    deviceInfo?: { ipAddress?: string; userAgent?: string }
  ): Promise<AuthResponse> {
    // Validate user exists in our database first
    const existingProfile = await AuthBusinessValidator.validateUserExists(loginData.email);

    // Check account status
    const accountStatus = await sessionService.getAccountStatus(existingProfile.id);
    AuthErrorUtil.validateAccountStatus(accountStatus);

    // Authenticate with Supabase
    const supabaseData = await SupabaseAuthService.signInUser(loginData);

    // Update account status if email is confirmed
    if (supabaseData.user.email_confirmed_at && accountStatus === AUTH_CONSTANTS.ACCOUNT_STATUS.INACTIVE) {
      await sessionService.setAccountStatus(existingProfile.id, AUTH_CONSTANTS.ACCOUNT_STATUS.ACTIVE);
    }

    // Get updated user profile
    const profile = await profileService.getProfileById(supabaseData.user.id);
    if (!profile) {
      throw AuthErrorUtil.createAuthError(
        404, 
        'User profile not found', 
        AUTH_CONSTANTS.ERROR_CODES.USER_NOT_FOUND
      );
    }

    // Create enhanced session tracking
    const sessionData = AuthDataUtil.buildSessionData(profile, deviceInfo);
    await sessionService.createSession(sessionData);

    // Return auth response with tokens
    return AuthDataUtil.buildAuthResponse(
      profileService.profileToUser(profile),
      supabaseData.session
    );
  }

  /**
   * Admin sign in with enhanced security validation
   */
  async adminSignIn(
    loginData: LoginDto, 
    deviceInfo?: { ipAddress?: string; userAgent?: string }
  ): Promise<AuthResponse> {
    // Check if user exists and is admin
    await AuthBusinessValidator.validateAdminExists(loginData.email);

    // Use regular sign in flow
    const result = await this.signIn(loginData, deviceInfo);
    
    // Double-check admin role after sign in
    AuthErrorUtil.validateAdminRole(result.user.role);

    return result;
  }

  /**
   * Handle email verification with proper validation
   */
  async handleEmailVerification(
    token_hash: string, 
    type: string
  ): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      // Validate verification type
      AuthBusinessValidator.validateVerificationType(type);

      // Verify with Supabase
      const supabaseData = await SupabaseAuthService.verifyEmail(token_hash, type);

      if (supabaseData.user?.email_confirmed_at) {
        // Find user profile and activate account
        const profile = await profileService.getProfileById(supabaseData.user.id);
        if (profile) {
          await sessionService.setAccountStatus(profile.id, AUTH_CONSTANTS.ACCOUNT_STATUS.ACTIVE);
          
          return {
            success: true,
            message: 'Email verified successfully. Your account is now active.',
            user: profileService.profileToUser(profile)
          };
        }
      }

      return {
        success: false,
        message: 'Email verification failed. Please try again.'
      };
    } catch (error) {
      AuthErrorUtil.handleOperationError(
        error, 
        'Email verification', 
        AUTH_CONSTANTS.ERROR_CODES.EMAIL_VERIFICATION_FAILED
      );
    }
  }

  /**
   * Enhanced sign out with cleanup
   */
  async signOut(token?: string): Promise<void> {
    try {
      // Sign out from Supabase
      await SupabaseAuthService.signOutUser();

      // Clean up our session tracking if token provided
      if (token) {
        const payload = tokenService.decodeToken(token);
        if (payload?.userId) {
          await sessionService.deleteAllUserSessions(payload.userId);
        }
      }
    } catch (error) {
      console.error('Error during signout:', error);
      // Don't throw error for signout failures
    }
  }

  /**
   * Enhanced token refresh with validation
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    // Refresh with Supabase
    const supabaseData = await SupabaseAuthService.refreshUserSession(refreshToken);

    // Get user profile
    const profile = await profileService.getProfileById(supabaseData.user.id);
    if (!profile) {
      throw AuthErrorUtil.createAuthError(
        404, 
        'User profile not found', 
        AUTH_CONSTANTS.ERROR_CODES.USER_NOT_FOUND
      );
    }

    // Check account status
    const accountStatus = await sessionService.getAccountStatus(profile.id);
    AuthErrorUtil.validateAccountStatus(accountStatus);

    return AuthDataUtil.buildAuthResponse(
      profileService.profileToUser(profile),
      supabaseData.session
    );
  }

  /**
   * Get user by ID with null handling
   */
  async getUserById(userId: string) {
    const profile = await profileService.getProfileById(userId);
    return profile ? profileService.profileToUser(profile) : null;
  }

  /**
   * Reset password with validation
   */
  async resetPassword(email: string): Promise<void> {
    // Verify user exists
    await AuthBusinessValidator.validateUserExistsForReset(email);

    // Validate environment configuration
    AuthBusinessValidator.validateEnvironmentConfig();

    // Send reset email via Supabase
    await SupabaseAuthService.sendPasswordResetEmail(email);
  }

  /**
   * Update password with token validation
   */
  async updatePassword(token: string, newPassword: string): Promise<void> {
    try {
      // Verify token and get user
      await SupabaseAuthService.getUserFromToken(token);

      // Update password via Supabase
      await SupabaseAuthService.updateUserPassword(newPassword);
    } catch (error) {
      AuthErrorUtil.handleOperationError(
        error, 
        'Password update', 
        AUTH_CONSTANTS.ERROR_CODES.PASSWORD_UPDATE_FAILED
      );
    }
  }

  /**
   * Update user profile with validation
   */
  async updateUserProfile(userId: string, updateData: UpdateUserDto) {
    // Validate business rules for profile updates
    await AuthBusinessValidator.validateProfileUpdateRules(userId, updateData);

    const profile = await profileService.updateProfile(userId, updateData);
    if (!profile) {
      throw AuthErrorUtil.createAuthError(
        404, 
        'User profile not found', 
        AUTH_CONSTANTS.ERROR_CODES.USER_NOT_FOUND
      );
    }

    return profileService.profileToUser(profile);
  }

  /**
   * Delete user account with proper cleanup
   */
  async deleteUserAccount(userId: string): Promise<void> {
    try {
      // Delete from our database first
      const deleted = await profileService.deleteProfile(userId);
      if (!deleted) {
        throw AuthErrorUtil.createAuthError(
          404, 
          'User profile not found', 
          AUTH_CONSTANTS.ERROR_CODES.USER_NOT_FOUND
        );
      }

      // Delete from Supabase
      await SupabaseAuthService.deleteUserAdmin(userId);

      // Clean up Redis sessions
      await sessionService.deleteAllUserSessions(userId);
    } catch (error) {
      AuthErrorUtil.handleOperationError(
        error, 
        'Account deletion', 
        AUTH_CONSTANTS.ERROR_CODES.ACCOUNT_DELETION_FAILED
      );
    }
  }
}

export const authService = new AuthService(); 