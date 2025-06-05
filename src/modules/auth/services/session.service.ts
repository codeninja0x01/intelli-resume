import { sessionRedis, REDIS_KEYS, RedisHelper } from '@/config/redis';
import createError from 'http-errors';

export interface SessionData {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  deviceId?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: number;
  lastActivity: number;
}

export interface TokenData {
  tokenId: string;
  userId: string;
  type: 'access' | 'refresh';
  issuedAt: number;
  expiresAt: number;
}

export class SessionService {
  private readonly SESSION_TIMEOUT = 24 * 60 * 60; // 24 hours in seconds
  private readonly MAX_CONCURRENT_SESSIONS = 5;
  private readonly REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

  // Token blacklisting
  async blacklistToken(tokenId: string, expiresAt: number): Promise<void> {
    const key = `${REDIS_KEYS.BLACKLISTED_TOKEN}${tokenId}`;
    const ttl = Math.max(0, expiresAt - Math.floor(Date.now() / 1000));
    
    if (ttl > 0) {
      await RedisHelper.setex(key, ttl, 'blacklisted');
    }
  }

  async isTokenBlacklisted(tokenId: string): Promise<boolean> {
    const key = `${REDIS_KEYS.BLACKLISTED_TOKEN}${tokenId}`;
    return await RedisHelper.exists(key);
  }

  // Session management
  async createSession(sessionData: SessionData): Promise<string> {
    const sessionId = this.generateSessionId();
    const key = `${REDIS_KEYS.USER_SESSION}${sessionData.userId}:${sessionId}`;
    
    // Check concurrent session limit
    await this.enforceSessionLimit(sessionData.userId);
    
    // Store session
    await sessionRedis.setex(key, this.SESSION_TIMEOUT, JSON.stringify(sessionData));
    
    return sessionId;
  }

  async getSession(userId: string, sessionId: string): Promise<SessionData | null> {
    const key = `${REDIS_KEYS.USER_SESSION}${userId}:${sessionId}`;
    const data = await sessionRedis.get(key);
    
    if (!data) return null;
    
    const sessionData: SessionData = JSON.parse(data);
    
    // Update last activity
    sessionData.lastActivity = Date.now();
    await sessionRedis.setex(key, this.SESSION_TIMEOUT, JSON.stringify(sessionData));
    
    return sessionData;
  }

  async updateSession(userId: string, sessionId: string, updates: Partial<SessionData>): Promise<void> {
    const key = `${REDIS_KEYS.USER_SESSION}${userId}:${sessionId}`;
    const data = await sessionRedis.get(key);
    
    if (!data) {
      throw createError(404, 'Session not found', { code: 'SESSION_NOT_FOUND' });
    }
    
    const sessionData: SessionData = { ...JSON.parse(data), ...updates };
    await sessionRedis.setex(key, this.SESSION_TIMEOUT, JSON.stringify(sessionData));
  }

  async deleteSession(userId: string, sessionId: string): Promise<void> {
    const key = `${REDIS_KEYS.USER_SESSION}${userId}:${sessionId}`;
    await sessionRedis.del(key);
  }

  async deleteAllUserSessions(userId: string): Promise<void> {
    const pattern = `${REDIS_KEYS.USER_SESSION}${userId}:*`;
    const keys = await sessionRedis.keys(pattern);
    
    if (keys.length > 0) {
      await sessionRedis.del(...keys);
    }
  }

  // Concurrent session management
  private async enforceSessionLimit(userId: string): Promise<void> {
    const pattern = `${REDIS_KEYS.USER_SESSION}${userId}:*`;
    const keys = await sessionRedis.keys(pattern);
    
    if (keys.length >= this.MAX_CONCURRENT_SESSIONS) {
      // Remove oldest session
      let oldestKey = keys[0];
      let oldestTime = Date.now();
      
      for (const key of keys) {
        const data = await sessionRedis.get(key);
        if (data) {
          const sessionData: SessionData = JSON.parse(data);
          if (sessionData.lastActivity < oldestTime) {
            oldestTime = sessionData.lastActivity;
            oldestKey = key;
          }
        }
      }
      
      await sessionRedis.del(oldestKey);
    }
  }

  // Rate limiting for registration
  async checkRegistrationLimit(ipAddress: string): Promise<void> {
    const key = `${REDIS_KEYS.RATE_LIMIT}registration:${ipAddress}`;
    const maxAttempts = 3; // Max 3 registrations per hour per IP
    const windowSeconds = 60 * 60; // 1 hour
    
    const count = await RedisHelper.incr(key, windowSeconds);
    
    if (count > maxAttempts) {
      throw createError(429, 'Too many registration attempts. Please try again later.', {
        code: 'REGISTRATION_RATE_LIMIT'
      });
    }
  }

  // Email verification
  async createEmailVerificationToken(email: string): Promise<string> {
    const token = this.generateVerificationToken();
    const key = `${REDIS_KEYS.EMAIL_VERIFICATION}${token}`;
    const data = { email, createdAt: Date.now() };
    
    // Verification token expires in 1 hour
    await RedisHelper.setex(key, 60 * 60, JSON.stringify(data));
    
    return token;
  }

  async verifyEmailToken(token: string): Promise<string | null> {
    const key = `${REDIS_KEYS.EMAIL_VERIFICATION}${token}`;
    const data = await RedisHelper.get(key);
    
    if (!data) return null;
    
    const { email } = JSON.parse(data);
    await RedisHelper.del(key); // Token is single-use
    
    return email;
  }

  // Account status management
  async setAccountStatus(userId: string, status: 'active' | 'inactive' | 'suspended'): Promise<void> {
    const key = `${REDIS_KEYS.ACCOUNT_STATUS}${userId}`;
    await RedisHelper.setex(key, 30 * 24 * 60 * 60, status); // 30 days
  }

  async getAccountStatus(userId: string): Promise<'active' | 'inactive' | 'suspended'> {
    const key = `${REDIS_KEYS.ACCOUNT_STATUS}${userId}`;
    const status = await RedisHelper.get(key);
    return (status as 'active' | 'inactive' | 'suspended') || 'active';
  }

  // Helper methods
  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateVerificationToken(): string {
    return `verify_${Date.now()}_${Math.random().toString(36).substr(2, 12)}`;
  }

  // Cleanup expired sessions (can be called periodically)
  async cleanupExpiredSessions(): Promise<number> {
    const patterns = [
      `${REDIS_KEYS.USER_SESSION}*`,
      `${REDIS_KEYS.BLACKLISTED_TOKEN}*`,
      `${REDIS_KEYS.EMAIL_VERIFICATION}*`,
    ];
    
    let cleaned = 0;
    
    for (const pattern of patterns) {
      const keys = await sessionRedis.keys(pattern);
      for (const key of keys) {
        const ttl = await sessionRedis.ttl(key);
        if (ttl === -1) { // No expiration set
          await sessionRedis.del(key);
          cleaned++;
        }
      }
    }
    
    return cleaned;
  }
}

export const sessionService = new SessionService(); 