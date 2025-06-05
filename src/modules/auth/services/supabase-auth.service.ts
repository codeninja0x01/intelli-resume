import { supabase, supabaseAdmin } from '@/config/supabase';
import { CreateUserDto, LoginDto } from '@/shared/types-index';
import { AuthErrorUtil } from '../utils/auth-error.util';
import { AuthDataUtil } from '../utils/auth-data.util';
import { AUTH_CONSTANTS } from '../constants/auth.constants';

export class SupabaseAuthService {
  /**
   * Create user with Supabase Auth
   */
  static async signUpUser(userData: CreateUserDto, emailRedirectTo?: string): Promise<any> {
    const signUpOptions = AuthDataUtil.buildSignUpOptions(userData, emailRedirectTo);

    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: signUpOptions,
    });

    if (error) {
      AuthErrorUtil.handleSupabaseAuthError(error);
    }

    AuthDataUtil.validateSupabaseResponse(data, 'User registration');
    return data;
  }

  /**
   * Sign in user with Supabase Auth
   */
  static async signInUser(loginData: LoginDto): Promise<any> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });

    if (error) {
      AuthErrorUtil.handleSupabaseAuthError(error);
    }

    AuthDataUtil.validateSessionData(data, 'Sign in');
    return data;
  }

  /**
   * Sign out user from Supabase
   */
  static async signOutUser(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn('Supabase signout warning:', error.message);
    }
  }

  /**
   * Refresh Supabase session
   */
  static async refreshUserSession(refreshToken: string): Promise<any> {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      throw AuthErrorUtil.createAuthError(
        401,
        `Token refresh failed: ${error.message}`,
        AUTH_CONSTANTS.ERROR_CODES.TOKEN_REFRESH_FAILED
      );
    }

    AuthDataUtil.validateSessionData(data, 'Token refresh');
    return data;
  }

  /**
   * Verify email with token hash
   */
  static async verifyEmail(token_hash: string, type: string): Promise<any> {
    const { data, error } = await supabase.auth.verifyOtp({
      type: type as 'signup' | 'email',
      token_hash,
    });

    if (error) {
      console.error('Supabase email verification error:', error);
      throw AuthErrorUtil.createAuthError(
        400,
        `Email verification failed: ${error.message}`,
        AUTH_CONSTANTS.ERROR_CODES.EMAIL_VERIFICATION_FAILED
      );
    }

    return data;
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(email: string): Promise<void> {
    const redirectTo = AuthDataUtil.getPasswordResetRedirectUrl();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      throw AuthErrorUtil.createAuthError(
        502,
        `Password reset failed: ${error.message}`,
        AUTH_CONSTANTS.ERROR_CODES.EXTERNAL_SERVICE_ERROR
      );
    }
  }

  /**
   * Get user from token
   */
  static async getUserFromToken(token: string): Promise<any> {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      throw AuthErrorUtil.createAuthError(
        401,
        'Invalid or expired session',
        AUTH_CONSTANTS.ERROR_CODES.INVALID_SESSION
      );
    }

    return user;
  }

  /**
   * Update user password
   */
  static async updateUserPassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      if (error.message.includes('Password')) {
        throw AuthErrorUtil.createAuthError(
          400,
          'Password does not meet requirements',
          AUTH_CONSTANTS.ERROR_CODES.WEAK_PASSWORD
        );
      }
      throw AuthErrorUtil.createAuthError(
        502,
        `Password update failed: ${error.message}`,
        AUTH_CONSTANTS.ERROR_CODES.EXTERNAL_SERVICE_ERROR
      );
    }
  }

  /**
   * Delete user with admin client
   */
  static async deleteUserAdmin(userId: string): Promise<void> {
    AuthErrorUtil.validateAdminClient(supabaseAdmin);
    
    const { error } = await supabaseAdmin!.auth.admin.deleteUser(userId);
    if (error) {
      console.error(`Failed to delete Supabase user ${userId}:`, error);
      // Don't throw here as this is often a cleanup operation
    } else {
      console.log(`Successfully deleted Supabase user: ${userId}`);
    }
  }

  /**
   * Cleanup orphaned Supabase user (compensating transaction)
   */
  static async cleanupOrphanedUser(userId: string): Promise<void> {
    try {
      await this.deleteUserAdmin(userId);
      console.log(`Successfully cleaned up orphaned Supabase user: ${userId}`);
    } catch (error) {
      console.error(`Error during Supabase user cleanup for ${userId}:`, error);
    }
  }
} 