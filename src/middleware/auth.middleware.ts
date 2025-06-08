import { Request, Response, NextFunction } from 'express';
import { supabase } from '@/config/supabase';
import { profileService } from '@/modules/cv/services/profile.service';
import { sessionRedis, REDIS_KEYS } from '@/config/redis';
import createError from 'http-errors';
import { Profile } from '@/modules/cv/models/Profile.model';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
}

/**
 * Extracts the JWT from the Authorization header.
 * @param req The Express request object.
 * @returns The token string or null if not found.
 */
const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

/**
 * Fetches a user's profile, using a cache to improve performance.
 * @param userId The ID of the user to fetch.
 * @returns The user's profile object or null if not found.
 */
const getCachedProfile = async (userId: string): Promise<Profile | null> => {
  const cacheKey = `${REDIS_KEYS.USER_SESSION}${userId}:profile`;
  
  // 1. Try to get from cache
  const cachedProfile = await sessionRedis.get(cacheKey);
  if (cachedProfile) {
    // Re-hydrate the model instance to include methods like .isAdmin()
    const plainProfile = JSON.parse(cachedProfile);
    return Profile.build(plainProfile, { isNewRecord: false });
  }

  // 2. If not in cache, get from database
  const dbProfile = await profileService.getProfileById(userId);
  if (dbProfile) {
    // 3. Store in cache for 5 minutes
    await sessionRedis.setex(cacheKey, 300, JSON.stringify(dbProfile.toJSON()));
  }

  return dbProfile;
};


/**
 * Attaches the user object to the request after successful authentication.
 * It uses a caching layer to fetch the user's profile from the database.
 * @param req The Express request object.
 * @param supabaseUser The user object from Supabase.
 */
const attachUserToRequest = async (req: Request, supabaseUser: any): Promise<void> => {
  const profile = await getCachedProfile(supabaseUser.id);
  
  (req as AuthenticatedRequest).user = {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    role: profile?.role || 'user', // Default to 'user' if profile not found
  };
};

/**
 * Main authentication middleware.
 * Verifies the Supabase JWT and attaches the user's profile to the request.
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);
    if (!token) {
      throw createError(401, 'Access token required', { code: 'AUTH_REQUIRED' });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw createError(401, 'Invalid or expired token', { code: 'INVALID_TOKEN' });
    }

    // Attach user to the request using the cached profile fetcher
    await attachUserToRequest(req, user);
    
    next();
  } catch (error) {
    next(error); // Pass error to the global error handler
  }
};

/**
 * Middleware factory to require a specific role for a route.
 * @param allowedRoles Array of roles that are allowed to access the route.
 * @returns An Express middleware function.
 */
export const requireRole = (allowedRoles: Array<'user' | 'admin'>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;

    if (!user || !allowedRoles.includes(user.role as 'user' | 'admin')) {
      return next(createError(403, 'Access denied. Insufficient permissions.', { 
        code: 'INSUFFICIENT_PERMISSIONS' 
      }));
    }

    next();
  };
};  