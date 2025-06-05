import { Request, Response, NextFunction } from 'express';
import { ValidationChain, validationResult, matchedData } from 'express-validator';
import createError from 'http-errors';

export class ValidationMiddleware {
  // Main validation middleware factory
  static validate(validations: ValidationChain[]) {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
      try {
        // Run all validations in parallel
        await Promise.all(validations.map(validation => validation.run(req)));

        // Check for validation errors
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
          const formattedErrors = ValidationMiddleware.formatErrors(errors.array());
          
          throw createError(400, 'Validation failed', {
            code: 'VALIDATION_FAILED',
            details: formattedErrors,
          });
        }

        // Extract only validated and sanitized data
        req.validatedData = matchedData(req);
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Format validation errors for better readability
  private static formatErrors(errors: any[]): any {
    const formattedErrors: Record<string, string[]> = {};
    
    errors.forEach(error => {
      const field = error.path || error.param || 'unknown';
      if (!formattedErrors[field]) {
        formattedErrors[field] = [];
      }
      formattedErrors[field].push(error.msg);
    });

    return {
      fieldErrors: formattedErrors,
      errorCount: errors.length,
      summary: errors.map(error => error.msg).join(', '),
    };
  }

  // Conditional validation middleware
  static conditionalValidate(
    condition: (req: Request) => boolean,
    validations: ValidationChain[]
  ) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      if (!condition(req)) {
        next();
        return;
      }

      return ValidationMiddleware.validate(validations)(req, res, next);
    };
  }

  // Validation middleware for body only
  static validateBody(validations: ValidationChain[]) {
    return ValidationMiddleware.validate(validations);
  }

  // Validation middleware for query parameters only
  static validateQuery(validations: ValidationChain[]) {
    return ValidationMiddleware.validate(validations);
  }

  // Validation middleware for URL parameters only
  static validateParams(validations: ValidationChain[]) {
    return ValidationMiddleware.validate(validations);
  }

  // Combined validation for multiple sources
  static validateAll(options: {
    body?: ValidationChain[];
    query?: ValidationChain[];
    params?: ValidationChain[];
  }) {
    const allValidations: ValidationChain[] = [
      ...(options.body || []),
      ...(options.query || []),
      ...(options.params || []),
    ];

    return ValidationMiddleware.validate(allValidations);
  }

  // Helper to extract validated data from request
  static getValidatedData(req: Request): any {
    return req.validatedData || {};
  }

  // Sanitization-only middleware (no validation errors, just clean the data)
  static sanitize(validations: ValidationChain[]) {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
      try {
        // Run all validations/sanitizations
        await Promise.all(validations.map(validation => validation.run(req)));
        
        // Extract sanitized data (ignore validation errors)
        req.validatedData = matchedData(req);
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Custom error handler for specific validation needs
  static customValidate(
    validations: ValidationChain[],
    errorHandler?: (errors: any[], req: Request) => Error
  ) {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
      try {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
          if (errorHandler) {
            const customError = errorHandler(errors.array(), req);
            throw customError;
          }
          
          // Default error handling
          const formattedErrors = ValidationMiddleware.formatErrors(errors.array());
          
          throw createError(400, 'Validation failed', {
            code: 'VALIDATION_FAILED',
            details: formattedErrors,
          });
        }

        req.validatedData = matchedData(req);
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Specific validation error types
  static createValidationError(field: string, message: string, value?: any) {
    return createError(400, `Validation failed for field: ${field}`, {
      code: 'FIELD_VALIDATION_FAILED',
      details: {
        field,
        message,
        value,
      },
    });
  }

  // Required field validation error
  static createRequiredFieldError(field: string) {
    return createError(400, `Required field missing: ${field}`, {
      code: 'REQUIRED_FIELD_MISSING',
      details: {
        field,
        message: `${field} is required`,
      },
    });
  }

  // Type validation error
  static createTypeError(field: string, expectedType: string, actualValue: any) {
    return createError(400, `Invalid type for field: ${field}`, {
      code: 'INVALID_TYPE',
      details: {
        field,
        expectedType,
        actualValue,
        actualType: typeof actualValue,
        message: `Expected ${expectedType} but received ${typeof actualValue}`,
      },
    });
  }
}

// Extend Express Request interface to include validated data
declare global {
  namespace Express {
    interface Request {
      validatedData?: any;
    }
  }
}

// Convenience exports for common validation patterns
export const validate = ValidationMiddleware.validate;
export const validateBody = ValidationMiddleware.validateBody;
export const validateQuery = ValidationMiddleware.validateQuery;
export const validateParams = ValidationMiddleware.validateParams;
export const validateAll = ValidationMiddleware.validateAll;
export const sanitize = ValidationMiddleware.sanitize; 