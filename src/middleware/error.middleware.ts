import { Request, Response, NextFunction } from 'express';
import { config } from '@/config';
import { ApiResponse } from '../types-index';
import createError from 'http-errors';

// 404 handler for undefined routes
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  const error = createError(404, `Route ${req.originalUrl} not found`, { 
    code: 'ROUTE_NOT_FOUND',
    path: req.originalUrl,
    method: req.method,
  });
  
  next(error);
};

// Global error handling middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Handle http-errors objects and other errors
  const statusCode = err.statusCode || err.status || 500;
  const isServerError = statusCode >= 500;

  // Log error details (don't log client errors in production)
  if (isServerError || config.nodeEnv === 'development') {
    console.error('Error occurred:', {
      message: err.message,
      statusCode,
      ...(err.code && { code: err.code }),
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString(),
      ...(isServerError && { stack: err.stack }),
    });
  }

  // Prepare error response based on http-errors structure
  const errorResponse: ApiResponse = {
    success: false,
    message: err.message || (isServerError ? 'Internal Server Error' : 'Bad Request'),
    error: {
      type: err.name || (isServerError ? 'InternalServerError' : 'ClientError'),
      code: err.code || (isServerError ? 'INTERNAL_ERROR' : 'CLIENT_ERROR'),
      timestamp: new Date().toISOString(),
      ...(err.expose !== false && err.details && { details: err.details }),
      ...(config.nodeEnv === 'development' && isServerError && { 
        stack: err.stack,
        originalError: err 
      }),
    },
  };

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// Async error wrapper for route handlers
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Helper to create and throw common errors
export const throwError = {
  badRequest: (message: string = 'Bad Request', code?: string) => {
    throw createError(400, message, { code: code || 'BAD_REQUEST' });
  },
  
  unauthorized: (message: string = 'Unauthorized', code?: string) => {
    throw createError(401, message, { code: code || 'UNAUTHORIZED' });
  },
  
  forbidden: (message: string = 'Forbidden', code?: string) => {
    throw createError(403, message, { code: code || 'FORBIDDEN' });
  },
  
  notFound: (message: string = 'Not Found', code?: string) => {
    throw createError(404, message, { code: code || 'NOT_FOUND' });
  },
  
  conflict: (message: string = 'Conflict', code?: string) => {
    throw createError(409, message, { code: code || 'CONFLICT' });
  },
  
  unprocessable: (message: string = 'Unprocessable Entity', code?: string) => {
    throw createError(422, message, { code: code || 'UNPROCESSABLE_ENTITY' });
  },
  
  internal: (message: string = 'Internal Server Error', code?: string) => {
    throw createError(500, message, { code: code || 'INTERNAL_ERROR' });
  },
  
  badGateway: (message: string = 'Bad Gateway', code?: string) => {
    throw createError(502, message, { code: code || 'BAD_GATEWAY' });
  },
}; 