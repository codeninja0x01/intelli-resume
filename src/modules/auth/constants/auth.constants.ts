export const AUTH_CONSTANTS = {
  // Blocked email domains for registration
  BLOCKED_EMAIL_DOMAINS: [
    'tempmail.com',
    '10minutemail.com', 
    'throwaway.email',
    'guerrillamail.com',
    'mailinator.com'
  ],

  // Default token expiry (1 hour in seconds)
  DEFAULT_TOKEN_EXPIRY: 60 * 60,

  // Account statuses
  ACCOUNT_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive', 
    SUSPENDED: 'suspended'
  } as const,

  // User roles
  USER_ROLES: {
    USER: 'user',
    ADMIN: 'admin'
  } as const,

  // Error codes
  ERROR_CODES: {
    // Authentication errors
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    INVALID_ADMIN_CREDENTIALS: 'INVALID_ADMIN_CREDENTIALS',
    EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
    ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
    ADMIN_ACCESS_REQUIRED: 'ADMIN_ACCESS_REQUIRED',
    
    // Registration errors
    USER_EXISTS: 'USER_EXISTS',
    BLOCKED_DOMAIN: 'BLOCKED_DOMAIN',
    INVALID_ROLE_ASSIGNMENT: 'INVALID_ROLE_ASSIGNMENT',
    WEAK_PASSWORD: 'WEAK_PASSWORD',
    
    // Service errors
    EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
    ADMIN_CLIENT_UNAVAILABLE: 'ADMIN_CLIENT_UNAVAILABLE',
    CONFIG_ERROR: 'CONFIG_ERROR',
    
    // Profile errors
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    PROFILE_CREATION_FAILED: 'PROFILE_CREATION_FAILED',
    EMAIL_IN_USE: 'EMAIL_IN_USE',
    
    // Token errors
    TOKEN_REFRESH_FAILED: 'TOKEN_REFRESH_FAILED',
    INVALID_SESSION: 'INVALID_SESSION',
    
    // Verification errors
    EMAIL_VERIFICATION_FAILED: 'EMAIL_VERIFICATION_FAILED',
    UNSUPPORTED_VERIFICATION_TYPE: 'UNSUPPORTED_VERIFICATION_TYPE',
    
    // Generic errors
    REGISTRATION_FAILED: 'REGISTRATION_FAILED',
    PASSWORD_UPDATE_FAILED: 'PASSWORD_UPDATE_FAILED',
    ACCOUNT_DELETION_FAILED: 'ACCOUNT_DELETION_FAILED'
  } as const,

  // Email verification types
  VERIFICATION_TYPES: {
    SIGNUP: 'signup',
    EMAIL: 'email'
  } as const,

  // Environment variables
  ENV_VARS: {
    FRONTEND_URL: 'FRONTEND_URL'
  } as const
} as const;

export type AccountStatus = typeof AUTH_CONSTANTS.ACCOUNT_STATUS[keyof typeof AUTH_CONSTANTS.ACCOUNT_STATUS];
export type UserRole = typeof AUTH_CONSTANTS.USER_ROLES[keyof typeof AUTH_CONSTANTS.USER_ROLES];
export type ErrorCode = typeof AUTH_CONSTANTS.ERROR_CODES[keyof typeof AUTH_CONSTANTS.ERROR_CODES];
export type VerificationType = typeof AUTH_CONSTANTS.VERIFICATION_TYPES[keyof typeof AUTH_CONSTANTS.VERIFICATION_TYPES]; 