// Central exports for the validation system
export * from './common.validations';

// Re-export validation middleware
export { 
  ValidationMiddleware, 
  validate, 
  validateBody, 
  validateQuery, 
  validateParams, 
  validateAll, 
  sanitize 
} from '@/middleware/validation.middleware';

// Re-export express-validator utilities for convenience
export { 
  body, 
  param, 
  query, 
  header,
  cookie,
  ValidationChain,
  validationResult,
  matchedData,
  oneOf,
  checkSchema
} from 'express-validator';

// Type definitions for validation
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationOptions {
  abortEarly?: boolean;
  skipMissingProperties?: boolean;
  whitelist?: boolean;
  forbidNonWhitelisted?: boolean;
} 