import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { sessionService } from './session.service';
import createError from 'http-errors';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  sessionId: string;
  tokenId: string;
  type: 'access' | 'refresh';
  iat?: number; // issued at
  exp?: number; // expires at
  iss?: string; // issuer
  aud?: string; // audience
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: number;
  refreshTokenExpiry: number;
}

export class TokenService {
  private readonly JWT_SECRET = process.env.JWT_SECRET!;
  private readonly ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
  private readonly REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

  constructor() {
    if (!this.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required');
    }
  }

  // Generate token pair with rotation
  async generateTokenPair(
    userId: string, 
    email: string, 
    role: 'user' | 'admin',
    sessionId?: string,
    deviceInfo?: { ipAddress?: string; userAgent?: string }
  ): Promise<TokenPair> {
    const newSessionId = sessionId || await sessionService.createSession({
      userId,
      email,
      role,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      ...deviceInfo,
    });

    // Generate unique token IDs for tracking
    const accessTokenId = uuidv4();
    const refreshTokenId = uuidv4();

    // Access token payload
    const accessPayload: TokenPayload = {
      userId,
      email,
      role,
      sessionId: newSessionId,
      tokenId: accessTokenId,
      type: 'access',
    };

    // Refresh token payload
    const refreshPayload: TokenPayload = {
      userId,
      email,
      role,
      sessionId: newSessionId,
      tokenId: refreshTokenId,
      type: 'refresh',
    };

    // Generate tokens
    const accessToken = jwt.sign(accessPayload, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
      issuer: 'intelli-resume',
      audience: 'intelli-resume-users',
    });

    const refreshToken = jwt.sign(refreshPayload, this.JWT_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
      issuer: 'intelli-resume',
      audience: 'intelli-resume-users',
    });

    const accessTokenExpiry = Math.floor(Date.now() / 1000) + (15 * 60); // 15 minutes
    const refreshTokenExpiry = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7 days

    return {
      accessToken,
      refreshToken,
      accessTokenExpiry,
      refreshTokenExpiry,
    };
  }

  // Verify and decode token
  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET, {
        issuer: 'intelli-resume',
        audience: 'intelli-resume-users',
      }) as TokenPayload;

      // Check if token is blacklisted
      const isBlacklisted = await sessionService.isTokenBlacklisted(decoded.tokenId);
      if (isBlacklisted) {
        throw createError(401, 'Token has been revoked', { code: 'TOKEN_REVOKED' });
      }

      // Check account status
      const accountStatus = await sessionService.getAccountStatus(decoded.userId);
      if (accountStatus === 'suspended') {
        throw createError(403, 'Account is suspended', { code: 'ACCOUNT_SUSPENDED' });
      }
      if (accountStatus === 'inactive') {
        throw createError(403, 'Account is inactive', { code: 'ACCOUNT_INACTIVE' });
      }

      // Update session activity if it's an access token
      if (decoded.type === 'access') {
        const session = await sessionService.getSession(decoded.userId, decoded.sessionId);
        if (!session) {
          throw createError(401, 'Session not found', { code: 'SESSION_NOT_FOUND' });
        }
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw createError(401, 'Invalid token', { code: 'INVALID_TOKEN' });
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw createError(401, 'Token expired', { code: 'TOKEN_EXPIRED' });
      }
      throw error;
    }
  }

  // Refresh token with rotation
  async refreshTokenPair(refreshToken: string): Promise<TokenPair> {
    const payload = await this.verifyToken(refreshToken);
    
    if (payload.type !== 'refresh') {
      throw createError(401, 'Invalid refresh token', { code: 'INVALID_REFRESH_TOKEN' });
    }

    // Blacklist old refresh token
    const expiry = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);
    await sessionService.blacklistToken(payload.tokenId, expiry);

    // Generate new token pair
    return this.generateTokenPair(
      payload.userId,
      payload.email,
      payload.role,
      payload.sessionId
    );
  }

  // Revoke token
  async revokeToken(token: string): Promise<void> {
    try {
      const decoded = jwt.decode(token) as TokenPayload;
      if (decoded?.tokenId) {
        // Calculate remaining TTL
        const expiry = decoded.exp || Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);
        await sessionService.blacklistToken(decoded.tokenId, expiry);
      }
    } catch (error) {
      // Ignore decode errors for revocation
    }
  }

  // Revoke all user tokens
  async revokeAllUserTokens(userId: string): Promise<void> {
    await sessionService.deleteAllUserSessions(userId);
  }

  // Extract token from Authorization header
  extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  // Decode token without verification (for expired tokens)
  decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch {
      return null;
    }
  }
}

export const tokenService = new TokenService(); 