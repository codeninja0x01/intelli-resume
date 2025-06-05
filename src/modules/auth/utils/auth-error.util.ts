import createError from 'http-errors';
import { AUTH_CONSTANTS, ErrorCode } from '../constants/auth.constants';

export class AuthErrorUtil {
  /**
   * Create a standardized authentication error
   */
  static createAuthError(
    statusCode: number,
    message: string,
    code: ErrorCode,
    additionalData?: Record<string, any>
  ) {
    return createError(statusCode, message, {
      code,
      ...additionalData
    });
  }

  /**
   * Handle Supabase authentication errors
   */
  static handleSupabaseAuthError(error: any): never {
    const message = error.message || 'Authentication service error';

    if (message.includes('User already registered')) {
      throw this.createAuthError(
        409,
        'User with this email already exists',
        AUTH_CONSTANTS.ERROR_CODES.USER_EXISTS
      );
    }

    if (message.includes('Invalid login credentials')) {
      throw this.createAuthError(
        401,
        'Invalid email or password',
        AUTH_CONSTANTS.ERROR_CODES.INVALID_CREDENTIALS
      );
    }

    if (message.includes('Email not confirmed')) {
      throw this.createAuthError(
        403,
        'Please verify your email address before signing in',
        AUTH_CONSTANTS.ERROR_CODES.EMAIL_NOT_VERIFIED
      );
    }

    if (message.includes('Password')) {
      throw this.createAuthError(
        400,
        'Password does not meet requirements',
        AUTH_CONSTANTS.ERROR_CODES.WEAK_PASSWORD
      );
    }

    // Generic external service error
    throw this.createAuthError(
      502,
      `Authentication service error: ${message}`,
      AUTH_CONSTANTS.ERROR_CODES.EXTERNAL_SERVICE_ERROR
    );
  }

  /**
   * Handle profile-related errors
   */
  static handleProfileError(error: any, context: string): never {
    console.error(`Profile error in ${context}:`, error);
    
    throw this.createAuthError(
      500,
      `${context} failed due to profile error. Please try again.`,
      AUTH_CONSTANTS.ERROR_CODES.PROFILE_CREATION_FAILED,
      { 
        originalError: error instanceof Error ? error.message : 'Unknown error',
        context 
      }
    );
  }

  /**
   * Validate admin client availability
   */
  static validateAdminClient(supabaseAdmin: any): void {
    if (!supabaseAdmin) {
      throw this.createAuthError(
        500,
        'Admin operations not available. Service role key not configured.',
        AUTH_CONSTANTS.ERROR_CODES.ADMIN_CLIENT_UNAVAILABLE
      );
    }
  }

  /**
   * Check account status and throw appropriate error
   */
  static validateAccountStatus(status: string): void {
    if (status === AUTH_CONSTANTS.ACCOUNT_STATUS.SUSPENDED) {
      throw this.createAuthError(
        403,
        'Account is suspended. Contact support for assistance.',
        AUTH_CONSTANTS.ERROR_CODES.ACCOUNT_SUSPENDED
      );
    }
  }

  /**
   * Validate user role for admin operations
   */
  static validateAdminRole(userRole: string): void {
    if (userRole !== AUTH_CONSTANTS.USER_ROLES.ADMIN) {
      throw this.createAuthError(
        403,
        'Admin access required',
        AUTH_CONSTANTS.ERROR_CODES.ADMIN_ACCESS_REQUIRED
      );
    }
  }

  /**
   * Handle generic operation errors with context
   */
  static handleOperationError(
    error: any,
    operation: string,
    defaultCode: ErrorCode = AUTH_CONSTANTS.ERROR_CODES.EXTERNAL_SERVICE_ERROR
  ): never {
    // If error is already a structured error, re-throw it
    if (error instanceof Error && (error as any).status) {
      throw error;
    }

    console.error(`${operation} error:`, error);
    
    throw this.createAuthError(
      500,
      `${operation} failed unexpectedly. Please try again.`,
      defaultCode,
      {
        originalError: error instanceof Error ? error.message : 'Unknown error',
        operation
      }
    );
  }
} 