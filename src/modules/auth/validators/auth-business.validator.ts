import { CreateUserDto, UpdateUserDto } from '@/shared/types-index';
import { AUTH_CONSTANTS } from '../constants/auth.constants';
import { AuthErrorUtil } from '../utils/auth-error.util';
import { profileService } from '@/modules/cv/services/profile.service';
import { sessionService } from '../services/session.service';

export class AuthBusinessValidator {
  /**
   * Validate email domain against blocked list
   */
  static validateEmailDomain(email: string): void {
    const emailDomain = email.split('@')[1];
    const blockedDomains = AUTH_CONSTANTS.BLOCKED_EMAIL_DOMAINS as readonly string[];
    
    if (blockedDomains.includes(emailDomain)) {
      throw AuthErrorUtil.createAuthError(
        400,
        'Email domain not allowed for registration',
        AUTH_CONSTANTS.ERROR_CODES.BLOCKED_DOMAIN
      );
    }
  }

  /**
   * Validate role assignment rules
   */
  static validateRoleAssignment(role?: string): void {
    if (role === AUTH_CONSTANTS.USER_ROLES.ADMIN) {
      throw AuthErrorUtil.createAuthError(
        403,
        'Admin role cannot be assigned during registration',
        AUTH_CONSTANTS.ERROR_CODES.INVALID_ROLE_ASSIGNMENT
      );
    }
  }

  /**
   * Check if user exists by email
   */
  static async validateUserDoesNotExist(email: string): Promise<void> {
    const existingProfile = await profileService.userExists(email);
    if (existingProfile) {
      throw AuthErrorUtil.createAuthError(
        409,
        'User with this email already exists',
        AUTH_CONSTANTS.ERROR_CODES.USER_EXISTS
      );
    }
  }

  /**
   * Check registration rate limits
   */
  static async validateRegistrationRateLimit(ipAddress?: string): Promise<void> {
    if (ipAddress) {
      await sessionService.checkRegistrationLimit(ipAddress);
    }
  }

  /**
   * Validate email uniqueness for updates
   */
  static async validateEmailUniqueness(
    email: string,
    currentUserId: string
  ): Promise<void> {
    const existingUser = await profileService.getProfileByEmail(email);
    if (existingUser && existingUser.id !== currentUserId) {
      throw AuthErrorUtil.createAuthError(
        409,
        'Email is already in use by another account',
        AUTH_CONSTANTS.ERROR_CODES.EMAIL_IN_USE
      );
    }
  }

  /**
   * Validate user exists in database
   */
  static async validateUserExists(email: string): Promise<any> {
    const existingProfile = await profileService.getProfileByEmail(email);
    if (!existingProfile) {
      throw AuthErrorUtil.createAuthError(
        401,
        'Invalid email or password',
        AUTH_CONSTANTS.ERROR_CODES.INVALID_CREDENTIALS
      );
    }
    return existingProfile;
  }

  /**
   * Validate admin user exists
   */
  static async validateAdminExists(email: string): Promise<any> {
    const existingProfile = await profileService.getProfileByEmail(email);
    if (!existingProfile || existingProfile.role !== AUTH_CONSTANTS.USER_ROLES.ADMIN) {
      throw AuthErrorUtil.createAuthError(
        401,
        'Invalid admin credentials',
        AUTH_CONSTANTS.ERROR_CODES.INVALID_ADMIN_CREDENTIALS
      );
    }
    return existingProfile;
  }

  /**
   * Validate user exists for password reset
   */
  static async validateUserExistsForReset(email: string): Promise<any> {
    const profile = await profileService.getProfileByEmail(email);
    if (!profile) {
      throw AuthErrorUtil.createAuthError(
        404,
        'No account found with this email address',
        AUTH_CONSTANTS.ERROR_CODES.USER_NOT_FOUND
      );
    }
    return profile;
  }

  /**
   * Comprehensive business rules validation for signup
   */
  static async validateSignupBusinessRules(
    userData: CreateUserDto,
    ipAddress?: string
  ): Promise<void> {
    // Check rate limiting
    await this.validateRegistrationRateLimit(ipAddress);

    // Validate email domain
    this.validateEmailDomain(userData.email);

    // Validate role assignment
    this.validateRoleAssignment(userData.role);

    // Check for existing user
    await this.validateUserDoesNotExist(userData.email);
  }

  /**
   * Validate profile update business rules
   */
  static async validateProfileUpdateRules(
    userId: string,
    updateData: UpdateUserDto
  ): Promise<void> {
    // Check email uniqueness if changing email
    if (updateData.email) {
      await this.validateEmailUniqueness(updateData.email, userId);
    }
  }

  /**
   * Validate verification type
   */
  static validateVerificationType(type: string): void {
    const validTypes = Object.values(AUTH_CONSTANTS.VERIFICATION_TYPES);
    if (!validTypes.includes(type as any)) {
      throw AuthErrorUtil.createAuthError(
        400,
        `Unsupported verification type: ${type}`,
        AUTH_CONSTANTS.ERROR_CODES.UNSUPPORTED_VERIFICATION_TYPE
      );
    }
  }

  /**
   * Validate environment configuration
   */
  static validateEnvironmentConfig(): void {
    const frontendUrl = process.env[AUTH_CONSTANTS.ENV_VARS.FRONTEND_URL];
    if (!frontendUrl) {
      throw AuthErrorUtil.createAuthError(
        500,
        'Password reset configuration error',
        AUTH_CONSTANTS.ERROR_CODES.CONFIG_ERROR
      );
    }
  }
} 