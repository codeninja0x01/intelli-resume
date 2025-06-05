import { body, param, query } from 'express-validator';
import { ValidationMiddleware } from '@/middleware/validation.middleware';

export class CertificationValidations {
  /**
   * Validation for creating a new certification
   */
  static createCertification = ValidationMiddleware.validate([
    body('profileId')
      .isUUID(4)
      .withMessage('Profile ID must be a valid UUID'),

    body('name')
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Certification name must be between 1 and 255 characters')
      .escape(),

    body('issuer')
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Issuer must be between 1 and 255 characters')
      .escape(),

    body('issueDate')
      .isISO8601()
      .withMessage('Issue date must be a valid date in ISO 8601 format (YYYY-MM-DD)')
      .custom((value) => {
        const issueDate = new Date(value);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // Allow today's date
        
        if (issueDate > today) {
          throw new Error('Issue date cannot be in the future');
        }
        return true;
      }),

    body('expiryDate')
      .optional()
      .isISO8601()
      .withMessage('Expiry date must be a valid date in ISO 8601 format (YYYY-MM-DD)')
      .custom((value, { req }) => {
        if (value && req.body.issueDate) {
          const issueDate = new Date(req.body.issueDate);
          const expiryDate = new Date(value);
          
          if (expiryDate <= issueDate) {
            throw new Error('Expiry date must be after issue date');
          }
        }
        return true;
      }),

    body('credentialId')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('Credential ID must not exceed 255 characters')
      .escape(),

    body('credentialUrl')
      .optional()
      .trim()
      .isURL({ protocols: ['http', 'https'] })
      .withMessage('Credential URL must be a valid HTTP/HTTPS URL')
      .isLength({ max: 2048 })
      .withMessage('Credential URL must not exceed 2048 characters'),

    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters')
      .escape(),

    body('metadata')
      .optional()
      .isObject()
      .withMessage('Metadata must be a valid JSON object')
      .custom((value) => {
        // Ensure metadata is not too large (prevent DoS)
        const serialized = JSON.stringify(value);
        if (serialized.length > 10000) {
          throw new Error('Metadata object is too large (max 10KB)');
        }
        return true;
      }),
  ]);

  /**
   * Validation for updating a certification
   */
  static updateCertification = ValidationMiddleware.validate([
    param('id')
      .isUUID(4)
      .withMessage('Certification ID must be a valid UUID'),

    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Certification name must be between 1 and 255 characters')
      .escape(),

    body('issuer')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Issuer must be between 1 and 255 characters')
      .escape(),

    body('issueDate')
      .optional()
      .isISO8601()
      .withMessage('Issue date must be a valid date in ISO 8601 format (YYYY-MM-DD)')
      .custom((value) => {
        const issueDate = new Date(value);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        if (issueDate > today) {
          throw new Error('Issue date cannot be in the future');
        }
        return true;
      }),

    body('expiryDate')
      .optional()
      .isISO8601()
      .withMessage('Expiry date must be a valid date in ISO 8601 format (YYYY-MM-DD)')
      .custom((value, { req }) => {
        if (value && req.body.issueDate) {
          const issueDate = new Date(req.body.issueDate);
          const expiryDate = new Date(value);
          
          if (expiryDate <= issueDate) {
            throw new Error('Expiry date must be after issue date');
          }
        }
        return true;
      }),

    body('credentialId')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('Credential ID must not exceed 255 characters')
      .escape(),

    body('credentialUrl')
      .optional()
      .trim()
      .isURL({ protocols: ['http', 'https'] })
      .withMessage('Credential URL must be a valid HTTP/HTTPS URL')
      .isLength({ max: 2048 })
      .withMessage('Credential URL must not exceed 2048 characters'),

    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters')
      .escape(),

    body('metadata')
      .optional()
      .isObject()
      .withMessage('Metadata must be a valid JSON object')
      .custom((value) => {
        const serialized = JSON.stringify(value);
        if (serialized.length > 10000) {
          throw new Error('Metadata object is too large (max 10KB)');
        }
        return true;
      }),
  ]);

  /**
   * Validation for getting a single certification
   */
  static getCertification = ValidationMiddleware.validate([
    param('id')
      .isUUID(4)
      .withMessage('Certification ID must be a valid UUID'),
  ]);

  /**
   * Validation for deleting a certification
   */
  static deleteCertification = ValidationMiddleware.validate([
    param('id')
      .isUUID(4)
      .withMessage('Certification ID must be a valid UUID'),
  ]);

  /**
   * Validation for listing certifications with filters and pagination
   */
  static listCertifications = ValidationMiddleware.validate([
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer')
      .toInt(),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be an integer between 1 and 100')
      .toInt(),

    query('sortBy')
      .optional()
      .isIn(['name', 'issuer', 'issueDate', 'expiryDate', 'createdAt', 'updatedAt'])
      .withMessage('Sort by must be one of: name, issuer, issueDate, expiryDate, createdAt, updatedAt'),

    query('sortOrder')
      .optional()
      .isIn(['ASC', 'DESC'])
      .withMessage('Sort order must be ASC or DESC'),

    query('profileId')
      .optional()
      .isUUID(4)
      .withMessage('Profile ID must be a valid UUID'),

    query('issuer')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Issuer filter must be between 1 and 255 characters')
      .escape(),

    query('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Name filter must be between 1 and 255 characters')
      .escape(),

    query('isExpired')
      .optional()
      .isBoolean()
      .withMessage('Is expired filter must be a boolean')
      .toBoolean(),

    query('isValid')
      .optional()
      .isBoolean()
      .withMessage('Is valid filter must be a boolean')
      .toBoolean(),

    query('expiringWithinDays')
      .optional()
      .isInt({ min: 1, max: 365 })
      .withMessage('Expiring within days must be an integer between 1 and 365')
      .toInt(),

    query('search')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Search term must be between 1 and 255 characters')
      .escape(),
  ]);

  /**
   * Validation for getting certifications by profile ID
   */
  static getCertificationsByProfile = ValidationMiddleware.validate([
    param('profileId')
      .isUUID(4)
      .withMessage('Profile ID must be a valid UUID'),

    query('includeExpired')
      .optional()
      .isBoolean()
      .withMessage('Include expired filter must be a boolean')
      .toBoolean(),

    query('sortBy')
      .optional()
      .isIn(['name', 'issuer', 'issueDate', 'expiryDate', 'createdAt'])
      .withMessage('Sort by must be one of: name, issuer, issueDate, expiryDate, createdAt'),

    query('sortOrder')
      .optional()
      .isIn(['ASC', 'DESC'])
      .withMessage('Sort order must be ASC or DESC'),
  ]);
} 