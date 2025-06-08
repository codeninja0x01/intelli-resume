import { Request, Response, NextFunction } from 'express';
import { ValidationChain, validationResult, matchedData, ValidationError, Result } from 'express-validator';
import createError from 'http-errors';

export class ValidationMiddleware {
  // Main validation middleware factory
  static validate(validations: ValidationChain[]) {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
      try {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
          // Use the refactored error formatter
          const formattedErrors = ValidationMiddleware.formatErrors(errors.array());
          
          throw createError(400, 'Validation failed', {
            code: 'VALIDATION_FAILED',
            // Attach the simplified error object to the details property
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

  /**
   * Formats validation errors into a simple key-value pair object.
   * From: { "fieldErrors": { "email": ["Invalid email"] } }
   * To:   { "email": "Invalid email" }
   * This is often easier for frontend forms to consume.
   * @param errors The array of validation errors from express-validator.
   * @returns A simplified error object.
   */
  private static formatErrors(errors: ValidationError[]): Record<string, string> {
    const formattedErrors: Record<string, string> = {};
    errors.forEach(error => {
      // Only add the first error message for a given field
      if (error.type === 'field' && !formattedErrors[error.path]) {
        formattedErrors[error.path] = error.msg;
      }
    });
    return formattedErrors;
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