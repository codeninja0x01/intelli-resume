import { body, param, query } from 'express-validator';
import { ValidationMiddleware } from '@/middleware/validation.middleware';

export class ExperienceValidation {
  // Create Experience validation
  static create = ValidationMiddleware.validate([
    body('profileId')
      .isUUID(4)
      .withMessage('Profile ID must be a valid UUID')
      .notEmpty()
      .withMessage('Profile ID is required')
      .escape(),

    body('title')
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Title must be between 1 and 255 characters')
      .notEmpty()
      .withMessage('Title is required')
      .escape(),

    body('company')
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Company must be between 1 and 255 characters')
      .notEmpty()
      .withMessage('Company is required')
      .escape(),

    body('location')
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Location must be between 1 and 255 characters')
      .notEmpty()
      .withMessage('Location is required')
      .escape(),

    body('startDate')
      .isISO8601({ strict: true })
      .withMessage('Start date must be a valid date (YYYY-MM-DD)')
      .notEmpty()
      .withMessage('Start date is required')
      .custom((value) => {
        const startDate = new Date(value);
        const now = new Date();
        const hundredYearsAgo = new Date();
        hundredYearsAgo.setFullYear(now.getFullYear() - 100);
        
        if (startDate > now) {
          throw new Error('Start date cannot be in the future');
        }
        if (startDate < hundredYearsAgo) {
          throw new Error('Start date cannot be more than 100 years ago');
        }
        return true;
      }),

    body('endDate')
      .optional()
      .isISO8601({ strict: true })
      .withMessage('End date must be a valid date (YYYY-MM-DD)')
      .custom((value) => {
        if (!value) return true;
        
        const endDate = new Date(value);
        const now = new Date();
        
        if (endDate > now) {
          throw new Error('End date cannot be in the future');
        }
        return true;
      }),

    body('isCurrent')
      .isBoolean()
      .withMessage('isCurrent must be a boolean')
      .notEmpty()
      .withMessage('isCurrent is required')
      .custom((value, { req }) => {
        if (value === true && req.body.endDate) {
          throw new Error('Cannot have end date when position is current');
        }
        if (value === false && !req.body.endDate) {
          throw new Error('End date is required when position is not current');
        }
        return true;
      }),

    body('description')
      .trim()
      .isLength({ min: 1, max: 2000 })
      .withMessage('Description must be between 1 and 2000 characters')
      .notEmpty()
      .withMessage('Description is required')
      .escape(),

    body('responsibilities')
      .isArray({ min: 1 })
      .withMessage('Responsibilities must be a non-empty array')
      .custom((value) => {
        if (value && value.length > 20) {
          throw new Error('Maximum 20 responsibilities allowed');
        }
        if (value && value.some((item: any) => typeof item !== 'string' || item.length > 300)) {
          throw new Error('Each responsibility must be a string with maximum 300 characters');
        }
        return true;
      }),

    body('responsibilities.*')
      .trim()
      .notEmpty()
      .withMessage('Each responsibility cannot be empty')
      .escape(),

    body('achievements')
      .isArray({ min: 1 })
      .withMessage('Achievements must be a non-empty array')
      .custom((value) => {
        if (value && value.length > 20) {
          throw new Error('Maximum 20 achievements allowed');
        }
        if (value && value.some((item: any) => typeof item !== 'string' || item.length > 300)) {
          throw new Error('Each achievement must be a string with maximum 300 characters');
        }
        return true;
      }),

    body('achievements.*')
      .trim()
      .notEmpty()
      .withMessage('Each achievement cannot be empty')
      .escape(),

    body('skills')
      .isArray({ min: 1 })
      .withMessage('Skills must be a non-empty array')
      .custom((value) => {
        if (value && value.length > 50) {
          throw new Error('Maximum 50 skills allowed');
        }
        if (value && value.some((item: any) => typeof item !== 'string' || item.length > 100)) {
          throw new Error('Each skill must be a string with maximum 100 characters');
        }
        return true;
      }),

    body('skills.*')
      .trim()
      .notEmpty()
      .withMessage('Each skill cannot be empty')
      .escape(),

    body('metadata')
      .optional()
      .isObject()
      .withMessage('Metadata must be an object')
      .custom((value) => {
        if (value && JSON.stringify(value).length > 5000) {
          throw new Error('Metadata size exceeds limit (5000 characters)');
        }
        return true;
      }),
  ]);

  // Update Experience validation
  static update = ValidationMiddleware.validate([
    param('id')
      .isUUID(4)
      .withMessage('Experience ID must be a valid UUID')
      .escape(),

    body('title')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Title must be between 1 and 255 characters')
      .escape(),

    body('company')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Company must be between 1 and 255 characters')
      .escape(),

    body('location')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Location must be between 1 and 255 characters')
      .escape(),

    body('startDate')
      .optional()
      .isISO8601({ strict: true })
      .withMessage('Start date must be a valid date (YYYY-MM-DD)')
      .custom((value) => {
        if (!value) return true;
        
        const startDate = new Date(value);
        const now = new Date();
        const hundredYearsAgo = new Date();
        hundredYearsAgo.setFullYear(now.getFullYear() - 100);
        
        if (startDate > now) {
          throw new Error('Start date cannot be in the future');
        }
        if (startDate < hundredYearsAgo) {
          throw new Error('Start date cannot be more than 100 years ago');
        }
        return true;
      }),

    body('endDate')
      .optional()
      .isISO8601({ strict: true })
      .withMessage('End date must be a valid date (YYYY-MM-DD)')
      .custom((value) => {
        if (!value) return true;
        
        // We can't validate against startDate here since it might not be in the update
        const endDate = new Date(value);
        const now = new Date();
        
        if (endDate > now) {
          throw new Error('End date cannot be in the future');
        }
        return true;
      }),

    body('isCurrent')
      .optional()
      .isBoolean()
      .withMessage('isCurrent must be a boolean'),

    body('description')
      .optional()
      .trim()
      .isLength({ min: 1, max: 2000 })
      .withMessage('Description must be between 1 and 2000 characters')
      .escape(),

    body('responsibilities')
      .optional()
      .isArray()
      .withMessage('Responsibilities must be an array')
      .custom((value) => {
        if (value && value.length > 20) {
          throw new Error('Maximum 20 responsibilities allowed');
        }
        if (value && value.some((item: any) => typeof item !== 'string' || item.length > 300)) {
          throw new Error('Each responsibility must be a string with maximum 300 characters');
        }
        return true;
      }),

    body('responsibilities.*')
      .optional()
      .trim()
      .escape(),

    body('achievements')
      .optional()
      .isArray()
      .withMessage('Achievements must be an array')
      .custom((value) => {
        if (value && value.length > 20) {
          throw new Error('Maximum 20 achievements allowed');
        }
        if (value && value.some((item: any) => typeof item !== 'string' || item.length > 300)) {
          throw new Error('Each achievement must be a string with maximum 300 characters');
        }
        return true;
      }),

    body('achievements.*')
      .optional()
      .trim()
      .escape(),

    body('skills')
      .optional()
      .isArray()
      .withMessage('Skills must be an array')
      .custom((value) => {
        if (value && value.length > 50) {
          throw new Error('Maximum 50 skills allowed');
        }
        if (value && value.some((item: any) => typeof item !== 'string' || item.length > 100)) {
          throw new Error('Each skill must be a string with maximum 100 characters');
        }
        return true;
      }),

    body('skills.*')
      .optional()
      .trim()
      .escape(),

    body('metadata')
      .optional()
      .isObject()
      .withMessage('Metadata must be an object')
      .custom((value) => {
        if (value && JSON.stringify(value).length > 5000) {
          throw new Error('Metadata size exceeds limit (5000 characters)');
        }
        return true;
      }),
  ]);

  // Get Experience validation
  static getById = ValidationMiddleware.validate([
    param('id')
      .isUUID(4)
      .withMessage('Experience ID must be a valid UUID')
      .escape(),
  ]);

  // Delete Experience validation
  static delete = ValidationMiddleware.validate([
    param('id')
      .isUUID(4)
      .withMessage('Experience ID must be a valid UUID')
      .escape(),
  ]);

  // Get by profile validation
  static getByProfile = ValidationMiddleware.validate([
    param('profileId')
      .isUUID(4)
      .withMessage('Profile ID must be a valid UUID')
      .escape(),
  ]);

  // List Experience validation
  static list = ValidationMiddleware.validate([
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer')
      .toInt(),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
      .toInt(),

    query('sortBy')
      .optional()
      .isIn(['startDate', 'endDate', 'company', 'title', 'createdAt'])
      .withMessage('Invalid sort field'),

    query('sortOrder')
      .optional()
      .isIn(['ASC', 'DESC'])
      .withMessage('Sort order must be ASC or DESC'),

    query('title')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('Title filter too long')
      .escape(),

    query('company')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('Company filter too long')
      .escape(),

    query('location')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('Location filter too long')
      .escape(),

    query('isCurrent')
      .optional()
      .isBoolean()
      .withMessage('isCurrent must be a boolean')
      .toBoolean(),

    query('isPast')
      .optional()
      .isBoolean()
      .withMessage('isPast must be a boolean')
      .toBoolean(),

    query('search')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Search query too long')
      .escape(),
  ]);
} 