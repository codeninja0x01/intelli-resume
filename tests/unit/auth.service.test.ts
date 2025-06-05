import { authService } from '../../src/services/auth.service';
import { profileService } from '../../src/services/profile.service';

// Mock the dependencies
jest.mock('../../src/services/profile.service');
jest.mock('../../src/config/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      refreshSession: jest.fn(),
      getUser: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
      setSession: jest.fn(),
    },
  },
}));

const mockProfileService = profileService as jest.Mocked<typeof profileService>;

describe('AuthService Unit Tests', () => {
  const testEmail = 'qam64.test@inbox.testmail.app';
  const testUserData = {
    email: testEmail,
    password: 'TestPassword123!',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Business Rule Validation', () => {
    it('should block registration with blocked email domain', async () => {
      const blockedEmailData = {
        ...testUserData,
        email: 'test@tempmail.com', // Blocked domain
      };

      await expect(authService.signUp(blockedEmailData)).rejects.toThrow(
        expect.objectContaining({
          status: 400,
          message: 'Email domain not allowed for registration',
        })
      );
    });

    it('should block registration for existing user', async () => {
      // Mock existing user
      mockProfileService.userExists.mockResolvedValue(true);

      await expect(authService.signUp(testUserData)).rejects.toThrow(
        expect.objectContaining({
          status: 409,
          message: 'User with this email already exists',
        })
      );

      expect(mockProfileService.userExists).toHaveBeenCalledWith(testEmail);
    });

    it('should allow registration with valid email domain', async () => {
      // Mock no existing user
      mockProfileService.userExists.mockResolvedValue(false);
      
      // Mock successful Supabase response
      const mockSupabaseUser = {
        id: 'test-user-id',
        email: testEmail,
        user_metadata: { firstName: 'John', lastName: 'Doe' },
      };

      const mockSession = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
      };

      const { supabase } = require('../../src/config/supabase');
      supabase.auth.signUp.mockResolvedValue({
        data: { user: mockSupabaseUser, session: mockSession },
        error: null,
      });

      // Mock profile creation
      const mockProfile = {
        id: 'test-user-id',
        email: testEmail,
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
      };

      mockProfileService.createProfile.mockResolvedValue(mockProfile as any);
      mockProfileService.profileToUser.mockReturnValue({
        id: 'test-user-id',
        email: testEmail,
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
      } as any);

      const result = await authService.signUp(testUserData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token', 'test-access-token');
      expect(mockProfileService.createProfile).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle Supabase authentication errors gracefully', async () => {
      mockProfileService.userExists.mockResolvedValue(false);

      const { supabase } = require('../../src/config/supabase');
      supabase.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid email format' },
      });

      await expect(authService.signUp(testUserData)).rejects.toThrow(
        expect.objectContaining({
          status: 502,
          message: expect.stringContaining('Authentication service error'),
        })
      );
    });

    it('should validate external service responses', async () => {
      mockProfileService.userExists.mockResolvedValue(false);

      const { supabase } = require('../../src/config/supabase');
      // Mock response with missing required fields
      supabase.auth.signUp.mockResolvedValue({
        data: { user: { id: null }, session: null }, // Invalid response
        error: null,
      });

      await expect(authService.signUp(testUserData)).rejects.toThrow(
        expect.objectContaining({
          status: 502,
          message: expect.stringContaining('invalid response from authentication service'),
        })
      );
    });

    it('should handle profile creation failures', async () => {
      mockProfileService.userExists.mockResolvedValue(false);

      const mockSupabaseUser = {
        id: 'test-user-id',
        email: testEmail,
        user_metadata: { firstName: 'John', lastName: 'Doe' },
      };

      const mockSession = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
      };

      const { supabase } = require('../../src/config/supabase');
      supabase.auth.signUp.mockResolvedValue({
        data: { user: mockSupabaseUser, session: mockSession },
        error: null,
      });

      // Mock profile creation failure
      mockProfileService.createProfile.mockResolvedValue(null as any);

      await expect(authService.signUp(testUserData)).rejects.toThrow(
        expect.objectContaining({
          status: 500,
          message: 'Failed to create user profile',
        })
      );
    });
  });

  describe('SignIn Validation', () => {
    it('should fail signin for non-existent user', async () => {
      mockProfileService.getProfileByEmail.mockResolvedValue(null);

      const loginData = {
        email: 'nonexistent@test.com',
        password: 'password123',
      };

      await expect(authService.signIn(loginData)).rejects.toThrow(
        expect.objectContaining({
          status: 401,
          message: 'Invalid email or password',
        })
      );

      expect(mockProfileService.getProfileByEmail).toHaveBeenCalledWith(
        'nonexistent@test.com'
      );
    });

    it('should handle Supabase signin errors', async () => {
      const mockProfile = { id: 'test-id', email: testEmail };
      mockProfileService.getProfileByEmail.mockResolvedValue(mockProfile as any);

      const { supabase } = require('../../src/config/supabase');
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' },
      });

      const loginData = {
        email: testEmail,
        password: 'wrongpassword',
      };

      await expect(authService.signIn(loginData)).rejects.toThrow(
        expect.objectContaining({
          status: 401,
          message: 'Invalid email or password',
        })
      );
    });
  });

  describe('Password Reset', () => {
    it('should fail password reset for non-existent user', async () => {
      mockProfileService.getProfileByEmail.mockResolvedValue(null);

      await expect(authService.resetPassword('nonexistent@test.com')).rejects.toThrow(
        expect.objectContaining({
          status: 404,
          message: 'No account found with this email address',
        })
      );
    });

    it('should fail password reset without FRONTEND_URL configured', async () => {
      const mockProfile = { id: 'test-id', email: testEmail };
      mockProfileService.getProfileByEmail.mockResolvedValue(mockProfile as any);

      // Temporarily remove FRONTEND_URL
      const originalUrl = process.env.FRONTEND_URL;
      delete process.env.FRONTEND_URL;

      await expect(authService.resetPassword(testEmail)).rejects.toThrow(
        expect.objectContaining({
          status: 500,
          message: 'Password reset configuration error',
        })
      );

      // Restore FRONTEND_URL
      process.env.FRONTEND_URL = originalUrl;
    });
  });

  describe('User Profile Updates', () => {
    it('should prevent email conflicts during profile update', async () => {
      const existingUser = { id: 'other-user-id', email: 'existing@test.com' };
      mockProfileService.getProfileByEmail.mockResolvedValue(existingUser as any);

      const updateData = {
        email: 'existing@test.com', // Email already in use
      };

      await expect(
        authService.updateUserProfile('current-user-id', updateData)
      ).rejects.toThrow(
        expect.objectContaining({
          status: 409,
          message: 'Email is already in use by another account',
        })
      );
    });

    it('should allow email update to same user', async () => {
      const currentUser = { id: 'current-user-id', email: testEmail };
      mockProfileService.getProfileByEmail.mockResolvedValue(currentUser as any);
      
      const updatedProfile = { ...currentUser, email: testEmail };
      mockProfileService.updateProfile.mockResolvedValue(updatedProfile as any);
      mockProfileService.profileToUser.mockReturnValue(updatedProfile as any);

      const updateData = {
        email: testEmail, // Same email, should be allowed
      };

      const result = await authService.updateUserProfile('current-user-id', updateData);

      expect(result).toBeDefined();
      expect(mockProfileService.updateProfile).toHaveBeenCalledWith(
        'current-user-id',
        updateData
      );
    });
  });
}); 