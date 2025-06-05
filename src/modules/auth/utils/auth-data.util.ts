import { CreateUserDto } from '@/shared/types-index';
import { AUTH_CONSTANTS } from '../constants/auth.constants';

export class AuthDataUtil {
  /**
   * Build Supabase signup options from user data
   */
  static buildSignUpOptions(userData: CreateUserDto, emailRedirectTo?: string): any {
    const signUpOptions: any = {
      data: {
        first_name: userData.firstName,
        last_name: userData.lastName,
        full_name: `${userData.firstName} ${userData.lastName}`,
        role: AUTH_CONSTANTS.USER_ROLES.USER,
        phone: userData.phone,
        city: userData.city,
        state: userData.state,
        country: userData.country,
      },
    };

    // Add emailRedirectTo if provided, otherwise use default
    if (emailRedirectTo) {
      signUpOptions.emailRedirectTo = emailRedirectTo;
    } else if (process.env[AUTH_CONSTANTS.ENV_VARS.FRONTEND_URL]) {
      signUpOptions.emailRedirectTo = `${process.env[AUTH_CONSTANTS.ENV_VARS.FRONTEND_URL]}/auth/confirm`;
    }

    return signUpOptions;
  }

  /**
   * Build profile data from user data and Supabase user
   */
  static buildProfileData(userData: CreateUserDto, supabaseUserId: string): any {
    return {
      id: supabaseUserId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: 'user',
      ...userData.phone && { phone: userData.phone },
      ...userData.address && { address: userData.address },
      ...userData.city && { city: userData.city },
      ...userData.state && { state: userData.state },
      ...userData.postalCode && { postalCode: userData.postalCode },
      ...userData.country && { country: userData.country },
      ...userData.bio && { bio: userData.bio },
      ...userData.linkedinUrl && { linkedinUrl: userData.linkedinUrl },
      ...userData.githubUrl && { githubUrl: userData.githubUrl },
      ...userData.portfolioUrl && { portfolioUrl: userData.portfolioUrl },
      ...userData.profilePictureUrl && { profilePictureUrl: userData.profilePictureUrl },
    };
  }

  /**
   * Build session data for tracking
   */
  static buildSessionData(
    profile: any,
    deviceInfo?: { ipAddress?: string; userAgent?: string }
  ): any {
    return {
      userId: profile.id,
      email: profile.email,
      role: profile.role,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      ...deviceInfo,
    };
  }

  /**
   * Build auth response object
   */
  static buildAuthResponse(
    user: any,
    session?: any,
    message?: string,
    emailConfirmationRequired = false
  ): any {
    const response: any = {
      user,
      message,
      emailConfirmationRequired,
    };

    if (session) {
      response.token = session.access_token;
      response.refreshToken = session.refresh_token;
      response.expiresAt = session.expires_at || 
        Math.floor(Date.now() / 1000) + AUTH_CONSTANTS.DEFAULT_TOKEN_EXPIRY;
    }

    return response;
  }

  /**
   * Get password reset redirect URL
   */
  static getPasswordResetRedirectUrl(): string {
    const frontendUrl = process.env[AUTH_CONSTANTS.ENV_VARS.FRONTEND_URL];
    return `${frontendUrl}/auth/reset-password`;
  }

  /**
   * Validate required Supabase response data
   */
  static validateSupabaseResponse(data: any, context: string): void {
    if (!data.user?.id) {
      throw new Error(`${context} failed - invalid response from Supabase`);
    }
  }

  /**
   * Validate required session data
   */
  static validateSessionData(data: any, context: string): void {
    if (!data.session || !data.user) {
      throw new Error(`${context} failed - invalid session response`);
    }
  }

  /**
   * Extract device information from request-like object
   */
  static extractDeviceInfo(req: any): { ipAddress?: string; userAgent?: string } {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    const userAgent = req.get?.('User-Agent') || req.headers?.['user-agent'];
    
    return {
      ...(ipAddress && { ipAddress }),
      ...(userAgent && { userAgent }),
    };
  }

  /**
   * Clean up optional undefined values from an object
   */
  static cleanupObject<T extends Record<string, any>>(obj: T): T {
    const cleaned = {} as T;
    
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        (cleaned as any)[key] = value;
      }
    }
    
    return cleaned;
  }
} 