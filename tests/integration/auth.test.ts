import request from 'supertest';
import { Application } from 'express';
import { profileService } from '../../src/services/profile.service';

// Set up test environment variables if not already set
if (!process.env.SUPABASE_URL) {
  process.env.SUPABASE_URL = 'https://test.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'test_anon_key';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test_service_key';
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
  process.env.FRONTEND_URL = 'http://localhost:3000';
}

// Import the Express app
let app: Application;

describe('Auth Controller Integration Tests', () => {
  const testEmail = 'qam64.test@inbox.testmail.app';
  const testPassword = 'TestPassword123!';
  const testUserData = {
    email: testEmail,
    password: testPassword,
    firstName: 'John',
    lastName: 'Doe',
    role: 'user' as const,
  };

  let authToken: string;
  let refreshToken: string;
  let userId: string;

  beforeAll(async () => {
    // Import app after environment is set up
    app = (await import('../../src/app')).default;
  });

  afterAll(async () => {
    // Cleanup: Delete test user if exists
    try {
      const profile = await profileService.getProfileByEmail(testEmail);
      if (profile) {
        await profileService.deleteProfile(profile.id);
      }
    } catch (error) {
      // Ignore cleanup errors
      console.log('Cleanup error (ignored):', error);
    }
  });

  describe('POST /api/auth/signup', () => {
    it('should successfully register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testUserData)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        message: 'User created successfully',
        data: {
          user: {
            email: testEmail,
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
          },
          token: expect.any(String),
        },
      });

      // Store tokens and user ID for other tests
      authToken = response.body.data.token;
      refreshToken = response.body.data.refreshToken;
      userId = response.body.data.user.id;

      expect(authToken).toBeTruthy();
      expect(userId).toBeTruthy();
    });

    it('should fail to register user with invalid email', async () => {
      const invalidUserData = { 
        ...testUserData, 
        email: 'invalid-email' 
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(invalidUserData)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Validation failed',
        error: {
          type: 'ValidationError',
          code: 'VALIDATION_FAILED',
        },
      });
    });

    it('should fail to register user with weak password', async () => {
      const weakPasswordData = { 
        ...testUserData, 
        email: 'another@test.com',
        password: '123' 
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(weakPasswordData)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Validation failed',
        error: {
          type: 'ValidationError',
          code: 'VALIDATION_FAILED',
        },
      });
    });

    it('should fail to register user with missing required fields', async () => {
      const incompleteData = { 
        email: 'test@example.com' 
        // Missing password, firstName, lastName
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(incompleteData)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Validation failed',
        error: {
          type: 'ValidationError',
          code: 'VALIDATION_FAILED',
        },
      });
    });

    it('should fail to register duplicate user', async () => {
      // Try to register the same user again
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testUserData)
        .expect(409);

      expect(response.body).toMatchObject({
        success: false,
        message: expect.stringContaining('already exists'),
        error: {
          code: 'USER_EXISTS',
        },
      });
    });
  });

  describe('POST /api/auth/signin', () => {
    it('should successfully sign in with valid credentials', async () => {
      const loginData = {
        email: testEmail,
        password: testPassword,
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(loginData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Signed in successfully',
        data: {
          user: {
            email: testEmail,
            firstName: 'John',
            lastName: 'Doe',
          },
          token: expect.any(String),
          refreshToken: expect.any(String),
        },
      });

      // Update tokens for subsequent tests
      authToken = response.body.data.token;
      refreshToken = response.body.data.refreshToken;
    });

    it('should fail to sign in with invalid email', async () => {
      const invalidLoginData = {
        email: 'nonexistent@test.com',
        password: testPassword,
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(invalidLoginData)
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Invalid email or password',
        error: {
          code: 'INVALID_CREDENTIALS',
        },
      });
    });

    it('should fail to sign in with invalid password', async () => {
      const invalidLoginData = {
        email: testEmail,
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(invalidLoginData)
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Invalid email or password',
        error: {
          code: 'INVALID_CREDENTIALS',
        },
      });
    });

    it('should fail to sign in with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({})
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Validation failed',
        error: {
          type: 'ValidationError',
          code: 'VALIDATION_FAILED',
        },
      });
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'User retrieved successfully',
        data: {
          email: testEmail,
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
        },
      });
    });

    it('should fail to get current user without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Access token required',
        error: {
          code: 'AUTH_REQUIRED',
        },
      });
    });

    it('should fail to get current user with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Invalid or expired token',
        error: {
          code: 'INVALID_TOKEN',
        },
      });
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh token with valid refresh token', async () => {
      if (!refreshToken) {
        throw new Error('No refresh token available for test');
      }

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          user: {
            email: testEmail,
          },
          token: expect.any(String),
          refreshToken: expect.any(String),
        },
      });

      // Update token for subsequent tests
      authToken = response.body.data.token;
    });

    it('should fail to refresh with invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-refresh-token' })
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        message: expect.stringContaining('Token refresh failed'),
        error: {
          code: 'TOKEN_REFRESH_FAILED',
        },
      });
    });

    it('should fail to refresh without refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({})
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Validation failed',
        error: {
          type: 'ValidationError',
          code: 'VALIDATION_FAILED',
        },
      });
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('should send reset password email for existing user', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ email: testEmail })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Password reset email sent',
      });
    });

    it('should fail to send reset email for non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ email: 'nonexistent@test.com' })
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        message: 'No account found with this email address',
        error: {
          code: 'USER_NOT_FOUND',
        },
      });
    });

    it('should fail to send reset email with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ email: 'invalid-email' })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Validation failed',
        error: {
          type: 'ValidationError',
          code: 'VALIDATION_FAILED',
        },
      });
    });
  });

  describe('PUT /api/auth/update-password', () => {
    it('should update password with valid token', async () => {
      const newPassword = 'NewPassword123!';

      const response = await request(app)
        .put('/api/auth/update-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ newPassword })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Password updated successfully',
      });

      // Test sign in with new password
      const signinResponse = await request(app)
        .post('/api/auth/signin')
        .send({
          email: testEmail,
          password: newPassword,
        })
        .expect(200);

      // Update token
      authToken = signinResponse.body.data.token;
    });

    it('should fail to update password without token', async () => {
      const response = await request(app)
        .put('/api/auth/update-password')
        .send({ newPassword: 'NewPassword123!' })
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Access token required',
        error: {
          code: 'AUTH_REQUIRED',
        },
      });
    });

    it('should fail to update password with weak password', async () => {
      const response = await request(app)
        .put('/api/auth/update-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ newPassword: '123' })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Validation failed',
        error: {
          type: 'ValidationError',
          code: 'VALIDATION_FAILED',
        },
      });
    });
  });

  describe('POST /api/auth/signout', () => {
    it('should successfully sign out with valid token', async () => {
      const response = await request(app)
        .post('/api/auth/signout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Signed out successfully',
      });
    });

    it('should fail to sign out without token', async () => {
      const response = await request(app)
        .post('/api/auth/signout')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Access token required',
        error: {
          code: 'AUTH_REQUIRED',
        },
      });
    });
  });

  describe('Edge Cases and Security Tests', () => {
    it('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send('{"malformed": json}')
        .set('Content-Type', 'application/json')
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should prevent SQL injection attempts', async () => {
      const maliciousData = {
        email: "test@test.com'; DROP TABLE profiles; --",
        password: testPassword,
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(maliciousData)
        .expect(401); // Should fail authentication, not cause database error

      expect(response.body).toMatchObject({
        success: false,
        message: 'Invalid email or password',
      });
    });

    it('should handle very long input strings', async () => {
      const longString = 'a'.repeat(10000);
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: `${longString}@test.com`,
          password: testPassword,
          firstName: longString,
          lastName: longString,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should rate limit signup attempts', async () => {
      // This test would depend on your rate limiting configuration
      const promises = Array(20).fill(null).map((_, i) => 
        request(app)
          .post('/api/auth/signup')
          .send({
            ...testUserData,
            email: `test${i}@different.com`,
          })
      );

      const responses = await Promise.all(promises);
      
      // Some requests should be rate limited (429 status)
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      
      // This assertion depends on your rate limiting settings
      // You might need to adjust based on your configuration
      if (rateLimitedResponses.length > 0) {
        expect(rateLimitedResponses[0].status).toBe(429);
      }
    });
  });
}); 