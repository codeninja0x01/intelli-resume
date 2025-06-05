import { Request, Response } from 'express';
import { ApiResponse } from './types-index';

export abstract class BaseController {
  // Centralized error handler that works with http-errors
  protected handleError(
    error: any, 
    res: Response, 
    defaultMessage: string, 
    defaultStatusCode: number = 400
  ): void {
    console.error('Controller Error:', error);
    
    // http-errors library adds statusCode and expose properties
    const statusCode = error.statusCode || error.status || defaultStatusCode;
    const message = error.message || defaultMessage;
    
    const response: ApiResponse = {
      success: false,
      message,
      error: {
        type: error.name || 'Error',
        code: error.code || 'UNKNOWN_ERROR',
        ...(error.expose !== false && { details: error.details }),
      },
    };
    
    res.status(statusCode).json(response);
  }

  // Success response helper
  protected sendSuccess(
    res: Response, 
    data: any, 
    message: string, 
    statusCode: number = 200
  ): void {
    const response: ApiResponse = {
      success: true,
      message,
      data,
    };
    res.status(statusCode).json(response);
  }

  // Success response without data
  protected sendMessage(
    res: Response, 
    message: string, 
    statusCode: number = 200
  ): void {
    const response: ApiResponse = {
      success: true,
      message,
    };
    res.status(statusCode).json(response);
  }

  // Not found response helper
  protected sendNotFound(
    res: Response, 
    resource: string = 'Resource'
  ): void {
    const response: ApiResponse = {
      success: false,
      message: `${resource} not found`,
      error: {
        type: 'NotFoundError',
        code: 'NOT_FOUND',
      },
    };
    res.status(404).json(response);
  }

  // Extract validated data from request
  protected getValidatedData(req: Request): any {
    return req.validatedData || req.body;
  }

  // Extract pagination parameters from query
  protected getPaginationParams(req: Request): { page: number; limit: number; offset: number } {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const offset = (page - 1) * limit;
    
    return { page, limit, offset };
  }

  // Extract search parameters from query
  protected getSearchParams(req: Request): { search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' } {
    return {
      search: req.query.search as string,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as string) === 'asc' ? 'asc' : 'desc',
    };
  }
} 