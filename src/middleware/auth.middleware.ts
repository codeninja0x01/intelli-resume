import { Request, Response, NextFunction } from 'express';
import { supabase } from '@/config/supabase';
import { profileService } from '@/modules/cv/services/profile.service';
import createError from 'http-errors';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Extract token from request headers
const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return null;
  }

  // Check for Bearer token format
  const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
  if (bearerMatch) {
    return bearerMatch[1];
  }

  return null;
};

// Helper function to attach user to request
const attachUserToRequest = async (req: Request, user: any): Promise<void> => {
  // Get role from database profile, not JWT metadata
  const profile = await profileService.getProfileById(user.id);
  const role = profile?.role || 'user';

  req.user = {
    id: user.id,
    email: user.email || '',
    role,
  };
};

// Main authentication middleware
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);

    if (!token) {
      console.warn('[Auth] Missing token in request', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        timestamp: new Date().toISOString(),
      });
      
      throw createError(401, 'Access token required', { code: 'AUTH_REQUIRED' });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      console.warn('[Auth] Token verification failed', {
        error: error.message,
        ip: req.ip,
        path: req.path,
        timestamp: new Date().toISOString(),
      });
      
      throw createError(401, 'Invalid or expired token', { code: 'INVALID_TOKEN' });
    }

    if (!user) {
      console.warn('[Auth] No user found for valid token', {
        ip: req.ip,
        path: req.path,
        timestamp: new Date().toISOString(),
      });
      
      throw createError(401, 'User not found', { code: 'USER_NOT_FOUND' });
    }

    // Attach user to request
    await attachUserToRequest(req, user);

    // Optional: Add security headers
    res.set({
      'X-User-ID': user.id,
      'X-User-Role': (req as AuthenticatedRequest).user?.role,
    });

    console.info('[Auth] User authenticated successfully', {
      userId: user.id,
      role: (req as AuthenticatedRequest).user?.role,
      path: req.path,
      timestamp: new Date().toISOString(),
    });

    next();
  } catch (error: any) {
    // If it's already an http-error, pass it through
    if (error.statusCode || error.status) {
      next(error);
      return;
    }

    console.error('[Auth] Authentication error', {
      error: error.message,
      stack: error.stack,
      ip: req.ip,
      path: req.path,
      timestamp: new Date().toISOString(),
    });

    next(createError(500, 'Authentication failed', { code: 'AUTH_ERROR' }));
  }
};

// Role-based authorization middleware
export const requireRole = (allowedRoles: string[]) => {
  // Validate input
  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    throw new Error('requireRole middleware requires a non-empty array of roles');
  }

  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    try {
      // Check if user exists (should be set by authenticateToken middleware)
      if (!req.user) {
        console.warn('[Auth] Role check failed - no user in request', {
          path: req.path,
          requiredRoles: allowedRoles,
          timestamp: new Date().toISOString(),
        });
        
        throw createError(401, 'User not authenticated', { code: 'AUTH_REQUIRED' });
      }

      // Check if user has required role
      if (!allowedRoles.includes(req.user.role)) {
        console.warn('[Auth] Role check failed - insufficient permissions', {
          userId: req.user.id,
          userRole: req.user.role,
          requiredRoles: allowedRoles,
          path: req.path,
          timestamp: new Date().toISOString(),
        });
        
        throw createError(
          403, 
          `Access denied. Required roles: ${allowedRoles.join(', ')}`, 
          { code: 'INSUFFICIENT_PERMISSIONS' }
        );
      }

      console.info('[Auth] Role check passed', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: allowedRoles,
        path: req.path,
        timestamp: new Date().toISOString(),
      });

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);

    if (token) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (!error && user) {
        await attachUserToRequest(req, user);
        
        console.info('[Auth] Optional auth succeeded', {
          userId: user.id,
          path: req.path,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.info('[Auth] Optional auth failed, continuing without auth', {
          error: error?.message,
          path: req.path,
          timestamp: new Date().toISOString(),
        });
      }
    }

    next();
  } catch (error: any) {
    console.warn('[Auth] Optional auth error, continuing without auth', {
      error: error.message,
      path: req.path,
      timestamp: new Date().toISOString(),
    });
    
    // Continue without authentication if token verification fails
    next();
  }
};

// Middleware to require specific permissions
export const requirePermissions = (permissions: string[]) => {
  if (!Array.isArray(permissions) || permissions.length === 0) {
    throw new Error('requirePermissions middleware requires a non-empty array of permissions');
  }

  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw createError(401, 'User not authenticated', { code: 'AUTH_REQUIRED' });
      }

      // This would require extending the user metadata to include permissions
      const userPermissions = req.user.role === 'admin' 
        ? ['*'] // Admin has all permissions
        : []; // Regular users have limited permissions

      const hasPermission = permissions.some(permission => 
        userPermissions.includes('*') || userPermissions.includes(permission)
      );

      if (!hasPermission) {
        console.warn('[Auth] Permission check failed', {
          userId: req.user.id,
          userRole: req.user.role,
          requiredPermissions: permissions,
          path: req.path,
          timestamp: new Date().toISOString(),
        });
        
        throw createError(
          403, 
          `Access denied. Required permissions: ${permissions.join(', ')}`, 
          { code: 'INSUFFICIENT_PERMISSIONS' }
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Middleware to check if user owns the resource
export const requireOwnership = (resourceIdParam: string = 'id') => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw createError(401, 'User not authenticated', { code: 'AUTH_REQUIRED' });
      }

      const resourceId = req.params[resourceIdParam];
      const userId = req.user.id;

      // Admin can access any resource
      if (req.user.role === 'admin') {
        next();
        return;
      }

      // Check if user owns the resource
      if (resourceId !== userId) {
        console.warn('[Auth] Ownership check failed', {
          userId,
          resourceId,
          resourceIdParam,
          path: req.path,
          timestamp: new Date().toISOString(),
        });
        
        throw createError(
          403, 
          'Access denied. You can only access your own resources.', 
          { code: 'ACCESS_DENIED' }
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}; 