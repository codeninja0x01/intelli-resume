import { ValidationChain } from 'express-validator';
import { CommonValidations } from '@/shared/common.validations';

export class AuthValidations {
  // Sign up validation
  static signUp(): ValidationChain[] {
    return [
      CommonValidations.email('email'),
      CommonValidations.password('password', true), // Require strong password
      CommonValidations.nameField('firstName', 'First name'),
      CommonValidations.nameField('lastName', 'Last name'),
      CommonValidations.optionalPhone('phone'),
      CommonValidations.optionalText('address', 255, 'Address'),
      CommonValidations.optionalText('city', 100, 'City'),
      CommonValidations.optionalText('state', 100, 'State'),
      CommonValidations.optionalText('postalCode', 20, 'Postal code'),
      CommonValidations.optionalText('country', 100, 'Country'),
      CommonValidations.optionalText('bio', 1000, 'Bio'),
      CommonValidations.optionalURL('linkedinUrl', 'LinkedIn'),
      CommonValidations.optionalURL('githubUrl', 'GitHub'),
      CommonValidations.optionalURL('portfolioUrl', 'Portfolio'),
      CommonValidations.optionalURL('profilePictureUrl', 'Profile picture'),
      CommonValidations.optionalEnum('role', ['user', 'admin'], 'Role'),
    ];
  }

  // Sign in validation
  static signIn(): ValidationChain[] {
    return [
      CommonValidations.email('email'),
      CommonValidations.required('password', 'Password')
        .isLength({ min: 1, max: 128 })
        .withMessage('Password is required'),
    ];
  }

  // Refresh token validation
  static refreshToken(): ValidationChain[] {
    return [
      CommonValidations.required('refreshToken', 'Refresh token')
        .isString()
        .withMessage('Refresh token must be a string')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Refresh token cannot be empty'),
    ];
  }

  // Reset password validation
  static resetPassword(): ValidationChain[] {
    return [
      CommonValidations.email('email'),
    ];
  }

  // Update password validation
  static updatePassword(): ValidationChain[] {
    return [
      CommonValidations.password('newPassword', true), // Require strong password
      CommonValidations.optionalText('currentPassword', 128, 'Current password'),
    ];
  }

  // Update user profile validation
  static updateProfile(): ValidationChain[] {
    return [
      CommonValidations.email('email').optional(),
      CommonValidations.nameField('firstName', 'First name').optional(),
      CommonValidations.nameField('lastName', 'Last name').optional(),
      CommonValidations.optionalPhone('phone'),
      CommonValidations.optionalText('address', 255, 'Address'),
      CommonValidations.optionalText('city', 100, 'City'),
      CommonValidations.optionalText('state', 100, 'State'),
      CommonValidations.optionalText('postalCode', 20, 'Postal code'),
      CommonValidations.optionalText('country', 100, 'Country'),
      CommonValidations.optionalText('bio', 1000, 'Bio'),
      CommonValidations.optionalURL('linkedinUrl', 'LinkedIn'),
      CommonValidations.optionalURL('githubUrl', 'GitHub'),
      CommonValidations.optionalURL('portfolioUrl', 'Portfolio'),
      CommonValidations.optionalURL('profilePictureUrl', 'Profile picture'),
      CommonValidations.optionalEnum('role', ['user', 'admin'], 'Role'),
    ];
  }

  // User query validation (for listing/searching users)
  static userQuery(): ValidationChain[] {
    return [
      ...CommonValidations.paginationQuery(),
      CommonValidations.searchQuery(),
      ...CommonValidations.sortQuery(['createdAt', 'updatedAt', 'email', 'firstName', 'lastName']),
      CommonValidations.optionalEnum('role', ['user', 'admin'], 'Role').optional(),
    ];
  }

  // ID parameter validation
  static idParam(): ValidationChain[] {
    return [
      CommonValidations.uuid('id', 'param'),
    ];
  }

  // Auth callback validation (for email verification)
  static authCallback(): ValidationChain[] {
    return [
      // Supabase email verification parameters
      CommonValidations.optionalText('token_hash', 512, 'Verification token hash'),
      CommonValidations.optionalText('type', 50, 'Verification type'),
      CommonValidations.optionalText('next', 512, 'Next URL'),
      CommonValidations.optionalText('redirect_to', 512, 'Redirect URL'),
    ];
  }

  // Admin signin validation (same as regular signin)
  static adminSignIn(): ValidationChain[] {
    return this.signIn();
  }
} 