export const TEST_USERS = {
  valid: {
    email: 'qam64.test@inbox.testmail.app',
    password: 'TestPassword123!',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user' as const,
  },
  admin: {
    email: 'admin.test@inbox.testmail.app',
    password: 'AdminPassword123!',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin' as const,
  },
  invalid: {
    email: 'invalid-email',
    password: '123',
    firstName: '',
    lastName: '',
  },
};

export const TEST_TOKENS = {
  valid: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItaWQiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2MzkwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.test',
  expired: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItaWQiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2MzkwMDAwMDAsImV4cCI6MTYzOTAwMDAwMX0.test',
  invalid: 'invalid.token.here',
};

export const BLOCKED_EMAIL_DOMAINS = [
  'tempmail.com',
  '10minutemail.com', 
  'throwaway.email'
];

export const VALIDATION_TEST_CASES = {
  email: {
    valid: [
      'test@example.com',
      'user+tag@domain.co.uk',
      'valid.email@subdomain.domain.com',
    ],
    invalid: [
      'invalid-email',
      '@domain.com',
      'test@',
      'test..test@domain.com',
      'test@domain',
    ],
  },
  password: {
    valid: [
      'Password123!',
      'MySecure@Pass1',
      'ValidP@ssw0rd',
    ],
    invalid: [
      '123',
      'password',
      'PASSWORD',
      'Pass123',
      'password123',
      'PASSWORD123',
    ],
  },
  names: {
    valid: [
      'John',
      'Mary-Jane',
      "O'Connor",
      'José',
    ],
    invalid: [
      '',
      '123',
      'a'.repeat(100),
      '<script>alert("xss")</script>',
    ],
  },
};

export class TestHelpers {
  /**
   * Generate a unique email for testing
   */
  static generateTestEmail(prefix: string = 'test'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `${prefix}.${timestamp}.${random}@inbox.testmail.app`;
  }

  /**
   * Generate test user data with optional overrides
   */
  static generateTestUser(overrides: Partial<typeof TEST_USERS.valid> = {}) {
    return {
      ...TEST_USERS.valid,
      email: this.generateTestEmail(),
      ...overrides,
    };
  }

  /**
   * Create test data for bulk operations
   */
  static generateTestUsers(count: number): typeof TEST_USERS.valid[] {
    return Array.from({ length: count }, (_, index) => ({
      ...TEST_USERS.valid,
      email: this.generateTestEmail(`bulk${index}`),
      firstName: `User${index}`,
      lastName: `Test${index}`,
    }));
  }

  /**
   * Wait for a specified amount of time (useful for rate limiting tests)
   */
  static wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Extract error details from response for testing
   */
  static extractErrorDetails(response: any) {
    return {
      status: response.status,
      success: response.body?.success,
      message: response.body?.message,
      errorCode: response.body?.error?.code,
      errorType: response.body?.error?.type,
    };
  }

  /**
   * Create authorization header for tests
   */
  static createAuthHeader(token: string): Record<string, string> {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Validate response structure for auth endpoints
   */
  static validateAuthResponse(response: any) {
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('message');
    
    if (response.body.success) {
      expect(response.body).toHaveProperty('data');
      if (response.body.data?.user) {
        expect(response.body.data.user).toHaveProperty('id');
        expect(response.body.data.user).toHaveProperty('email');
        expect(response.body.data.user).toHaveProperty('firstName');
        expect(response.body.data.user).toHaveProperty('lastName');
        expect(response.body.data.user).toHaveProperty('role');
      }
    } else {
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code');
      expect(response.body.error).toHaveProperty('type');
    }
  }

  /**
   * Validate error response structure
   */
  static validateErrorResponse(response: any, expectedCode?: string) {
    expect(response.body.success).toBe(false);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveProperty('code');
    expect(response.body.error).toHaveProperty('type');
    
    if (expectedCode) {
      expect(response.body.error.code).toBe(expectedCode);
    }
  }

  /**
   * Clean up test data
   */
  static async cleanupTestUsers(emails: string[]) {
    const { profileService } = await import('../../src/services/profile.service');
    
    for (const email of emails) {
      try {
        const profile = await profileService.getProfileByEmail(email);
        if (profile) {
          await profileService.deleteProfile(profile.id);
        }
      } catch (error) {
        console.log(`Cleanup failed for ${email}:`, error);
      }
    }
  }

  /**
   * Mock Supabase responses for testing
   */
  static mockSupabaseAuth() {
    return {
      signUpSuccess: (user: any, session: any) => ({
        data: { user, session },
        error: null,
      }),
      signUpError: (message: string) => ({
        data: { user: null, session: null },
        error: { message },
      }),
      signInSuccess: (user: any, session: any) => ({
        data: { user, session },
        error: null,
      }),
      signInError: (message: string) => ({
        data: { user: null, session: null },
        error: { message },
      }),
    };
  }
}

export default TestHelpers; 