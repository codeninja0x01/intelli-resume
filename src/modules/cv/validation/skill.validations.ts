import { body, param, query } from 'express-validator';
import { ValidationMiddleware } from '@/middleware/validation.middleware';

export class SkillValidation {
  // Create Skill validation
  static create = ValidationMiddleware.validate([
    body('profileId')
      .isUUID(4)
      .withMessage('Profile ID must be a valid UUID')
      .notEmpty()
      .withMessage('Profile ID is required')
      .escape(),

    body('name')
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Skill name must be between 1 and 255 characters')
      .notEmpty()
      .withMessage('Skill name is required')
      .escape(),

    body('category')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Category must be between 1 and 100 characters')
      .notEmpty()
      .withMessage('Category is required')
      .escape(),

    body('language')
      .optional()
      .trim()
      .isLength({ min: 2, max: 10 })
      .withMessage('Language code must be between 2 and 10 characters')
      .matches(/^[a-zA-Z-_]{2,10}$/)
      .withMessage('Language must be a valid language code (e.g., en, es, fr, en-US)')
      .escape(),

    body('level')
      .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
      .withMessage('Level must be one of: beginner, intermediate, advanced, expert')
      .notEmpty()
      .withMessage('Level is required')
      .escape(),

    body('yearsOfExperience')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Years of experience must be a number between 0 and 100')
      .toInt(),

    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters')
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

  // Update Skill validation
  static update = ValidationMiddleware.validate([
    param('id')
      .isUUID(4)
      .withMessage('Skill ID must be a valid UUID')
      .escape(),

    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Skill name must be between 1 and 255 characters')
      .escape(),

    body('category')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Category must be between 1 and 100 characters')
      .escape(),

    body('language')
      .optional()
      .trim()
      .isLength({ min: 2, max: 10 })
      .withMessage('Language code must be between 2 and 10 characters')
      .matches(/^[a-zA-Z-_]{2,10}$/)
      .withMessage('Language must be a valid language code (e.g., en, es, fr, en-US)')
      .escape(),

    body('level')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
      .withMessage('Level must be one of: beginner, intermediate, advanced, expert')
      .escape(),

    body('yearsOfExperience')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Years of experience must be a number between 0 and 100')
      .toInt(),

    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters')
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

  // Get Skill by ID validation
  static getById = ValidationMiddleware.validate([
    param('id')
      .isUUID(4)
      .withMessage('Skill ID must be a valid UUID')
      .escape(),
  ]);

  // Delete Skill validation
  static delete = ValidationMiddleware.validate([
    param('id')
      .isUUID(4)
      .withMessage('Skill ID must be a valid UUID')
      .escape(),
  ]);

  // Get Skills by Profile validation
  static getByProfile = ValidationMiddleware.validate([
    param('profileId')
      .isUUID(4)
      .withMessage('Profile ID must be a valid UUID')
      .escape(),
  ]);

  // Get Skills by Category validation
  static getByCategory = ValidationMiddleware.validate([
    param('category')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Category must be between 1 and 100 characters')
      .escape(),
  ]);

  // Get Skills by Level validation
  static getByLevel = ValidationMiddleware.validate([
    param('level')
      .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
      .withMessage('Level must be one of: beginner, intermediate, advanced, expert')
      .escape(),
  ]);

  // Get Skills by Language validation
  static getByLanguage = ValidationMiddleware.validate([
    param('language')
      .trim()
      .isLength({ min: 2, max: 10 })
      .withMessage('Language must be between 2 and 10 characters')
      .matches(/^[a-zA-Z-_]{2,10}$/)
      .withMessage('Language must be a valid language code')
      .escape(),
  ]);

  // List Skills validation
  static list = ValidationMiddleware.validate([
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
      .isIn(['name', 'category', 'level', 'yearsOfExperience', 'createdAt'])
      .withMessage('Sort by must be one of: name, category, level, yearsOfExperience, createdAt')
      .escape(),

    query('sortOrder')
      .optional()
      .isIn(['ASC', 'DESC'])
      .withMessage('Sort order must be ASC or DESC')
      .escape(),

    query('profileId')
      .optional()
      .isUUID(4)
      .withMessage('Profile ID must be a valid UUID')
      .escape(),

    query('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Name filter must be between 1 and 255 characters')
      .escape(),

    query('category')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Category filter must be between 1 and 100 characters')
      .escape(),

    query('language')
      .optional()
      .trim()
      .isLength({ min: 2, max: 10 })
      .withMessage('Language filter must be between 2 and 10 characters')
      .matches(/^[a-zA-Z-_]{2,10}$/)
      .withMessage('Language must be a valid language code')
      .escape(),

    query('level')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
      .withMessage('Level filter must be one of: beginner, intermediate, advanced, expert')
      .escape(),

    query('minYearsOfExperience')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Minimum years of experience must be a number between 0 and 100')
      .toInt(),

    query('maxYearsOfExperience')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Maximum years of experience must be a number between 0 and 100')
      .toInt(),

    query('hasDescription')
      .optional()
      .isBoolean()
      .withMessage('hasDescription must be a boolean')
      .toBoolean(),

    query('hasMetadata')
      .optional()
      .isBoolean()
      .withMessage('hasMetadata must be a boolean')
      .toBoolean(),

    query('search')
      .optional()
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('Search query must be between 1 and 500 characters')
      .escape(),
  ]);

  // Validation for batch operations
  static batchCreate = ValidationMiddleware.validate([
    body('skills')
      .isArray({ min: 1, max: 50 })
      .withMessage('Skills must be an array with 1-50 items'),

    body('skills.*.profileId')
      .isUUID(4)
      .withMessage('Profile ID must be a valid UUID')
      .escape(),

    body('skills.*.name')
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Skill name must be between 1 and 255 characters')
      .escape(),

    body('skills.*.category')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Category must be between 1 and 100 characters')
      .escape(),

    body('skills.*.level')
      .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
      .withMessage('Level must be one of: beginner, intermediate, advanced, expert')
      .escape(),

    body('skills.*.yearsOfExperience')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Years of experience must be a number between 0 and 100')
      .toInt(),

    body('skills.*.description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters')
      .escape(),
  ]);

  // Validation for skill comparison
  static compare = ValidationMiddleware.validate([
    query('skill1')
      .isUUID(4)
      .withMessage('First skill ID must be a valid UUID')
      .escape(),

    query('skill2')
      .isUUID(4)
      .withMessage('Second skill ID must be a valid UUID')
      .escape(),
  ]);

  // Validation for skill search with advanced filters
  static advancedSearch = ValidationMiddleware.validate([
    query('categories')
      .optional()
      .custom((value) => {
        if (typeof value === 'string') {
          const categories = value.split(',').map(c => c.trim());
          if (categories.length > 20) {
            throw new Error('Maximum 20 categories allowed in filter');
          }
          if (categories.some(c => c.length > 100)) {
            throw new Error('Each category must not exceed 100 characters');
          }
        }
        return true;
      }),

    query('levels')
      .optional()
      .custom((value) => {
        if (typeof value === 'string') {
          const levels = value.split(',').map(l => l.trim());
          const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
          if (levels.some(l => !validLevels.includes(l))) {
            throw new Error('Invalid level in filter');
          }
        }
        return true;
      }),

    query('experienceRange')
      .optional()
      .matches(/^\d+-\d+$/)
      .withMessage('Experience range must be in format "min-max" (e.g., "1-5")')
      .custom((value) => {
        const [min, max] = value.split('-').map(Number);
        if (min >= max) {
          throw new Error('Minimum experience must be less than maximum');
        }
        if (min < 0 || max > 100) {
          throw new Error('Experience range must be between 0 and 100');
        }
        return true;
      }),
  ]);
} 