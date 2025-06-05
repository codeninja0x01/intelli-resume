import { body, param, query } from 'express-validator';
import { ValidationMiddleware } from '@/middleware/validation.middleware';

export class EducationValidation {
  // Create Education validation
  static create = ValidationMiddleware.validate([
    body('profileId')
      .isUUID(4)
      .withMessage('Profile ID must be a valid UUID')
      .notEmpty()
      .withMessage('Profile ID is required')
      .escape(),

    body('institution')
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Institution must be between 1 and 255 characters')
      .notEmpty()
      .withMessage('Institution is required')
      .escape(),

    body('degree')
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Degree must be between 1 and 255 characters')
      .notEmpty()
      .withMessage('Degree is required')
      .escape(),

    body('fieldOfStudy')
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Field of study must be between 1 and 255 characters')
      .notEmpty()
      .withMessage('Field of study is required')
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
          throw new Error('Cannot have end date when education is current');
        }
        if (value === false && !req.body.endDate) {
          throw new Error('End date is required when education is not current');
        }
        return true;
      }),

    body('grade')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Grade must not exceed 50 characters')
      .escape(),

    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters')
      .escape(),

    body('achievements')
      .optional()
      .isArray()
      .withMessage('Achievements must be an array')
      .custom((value) => {
        if (value && value.length > 20) {
          throw new Error('Maximum 20 achievements allowed');
        }
        if (value && value.some((item: any) => typeof item !== 'string' || item.length > 200)) {
          throw new Error('Each achievement must be a string with maximum 200 characters');
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

  // Update Education validation
  static update = ValidationMiddleware.validate([
    param('id')
      .isUUID(4)
      .withMessage('Education ID must be a valid UUID')
      .escape(),

    body('institution')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Institution must be between 1 and 255 characters')
      .escape(),

    body('degree')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Degree must be between 1 and 255 characters')
      .escape(),

    body('fieldOfStudy')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Field of study must be between 1 and 255 characters')
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

    body('grade')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Grade must not exceed 50 characters')
      .escape(),

    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters')
      .escape(),

    body('achievements')
      .optional()
      .isArray()
      .withMessage('Achievements must be an array')
      .custom((value) => {
        if (value && value.length > 20) {
          throw new Error('Maximum 20 achievements allowed');
        }
        if (value && value.some((item: any) => typeof item !== 'string' || item.length > 200)) {
          throw new Error('Each achievement must be a string with maximum 200 characters');
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

  // Get Education validation
  static getById = ValidationMiddleware.validate([
    param('id')
      .isUUID(4)
      .withMessage('Education ID must be a valid UUID')
      .escape(),
  ]);

  // Delete Education validation
  static delete = ValidationMiddleware.validate([
    param('id')
      .isUUID(4)
      .withMessage('Education ID must be a valid UUID')
      .escape(),
  ]);

  // Get by profile validation
  static getByProfile = ValidationMiddleware.validate([
    param('profileId')
      .isUUID(4)
      .withMessage('Profile ID must be a valid UUID')
      .escape(),
  ]);

  // List Education validation
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
      .isIn(['startDate', 'endDate', 'institution', 'degree', 'createdAt'])
      .withMessage('Invalid sort field'),

    query('sortOrder')
      .optional()
      .isIn(['ASC', 'DESC'])
      .withMessage('Sort order must be ASC or DESC'),

    query('institution')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('Institution filter too long')
      .escape(),

    query('degree')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('Degree filter too long')
      .escape(),

    query('fieldOfStudy')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('Field of study filter too long')
      .escape(),

    query('isCurrent')
      .optional()
      .isBoolean()
      .withMessage('isCurrent must be a boolean')
      .toBoolean(),

    query('isCompleted')
      .optional()
      .isBoolean()
      .withMessage('isCompleted must be a boolean')
      .toBoolean(),

    query('search')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Search query too long')
      .escape(),
  ]);
} 