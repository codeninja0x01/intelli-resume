import { authService } from '../../src/services/auth.service';

describe('AuthService', () => {
  describe('getUserById', () => {
    it('should return null for non-existent user', async () => {
      const result = await authService.getUserById('non-existent-id');
      expect(result).toBeNull();
    });
  });
}); 