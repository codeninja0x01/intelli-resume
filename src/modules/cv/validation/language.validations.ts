import { body, query, param } from 'express-validator';
import { ValidationMiddleware } from '@/middleware/validation.middleware';

export class LanguageValidation {
  // Create Language validation
  static create = ValidationMiddleware.validate([
    body('profileId')
      .isUUID(4)
      .withMessage('Profile ID must be a valid UUID')
      .notEmpty()
      .withMessage('Profile ID is required')
      .escape(),

    body('name')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Language name must be between 1 and 100 characters')
      .notEmpty()
      .withMessage('Language name is required')
      .escape(),

    body('languageCode')
      .trim()
      .isLength({ min: 2, max: 10 })
      .withMessage('Language code must be between 2 and 10 characters')
      .matches(/^[a-zA-Z-_]{2,10}$/)
      .withMessage('Language code must contain only letters, hyphens, and underscores (e.g., en, es, en-US)')
      .notEmpty()
      .withMessage('Language code is required')
      .escape(),

    body('proficiencyLevel')
      .isIn(['basic', 'conversational', 'intermediate', 'advanced', 'fluent', 'native'])
      .withMessage('Proficiency level must be one of: basic, conversational, intermediate, advanced, fluent, native')
      .notEmpty()
      .withMessage('Proficiency level is required')
      .escape(),

    body('isNative')
      .optional()
      .isBoolean()
      .withMessage('isNative must be a boolean')
      .toBoolean(),

    body('speakingLevel')
      .optional()
      .isIn(['basic', 'conversational', 'intermediate', 'advanced', 'fluent', 'native'])
      .withMessage('Speaking level must be one of: basic, conversational, intermediate, advanced, fluent, native')
      .escape(),

    body('writingLevel')
      .optional()
      .isIn(['basic', 'conversational', 'intermediate', 'advanced', 'fluent', 'native'])
      .withMessage('Writing level must be one of: basic, conversational, intermediate, advanced, fluent, native')
      .escape(),

    body('readingLevel')
      .optional()
      .isIn(['basic', 'conversational', 'intermediate', 'advanced', 'fluent', 'native'])
      .withMessage('Reading level must be one of: basic, conversational, intermediate, advanced, fluent, native')
      .escape(),

    body('listeningLevel')
      .optional()
      .isIn(['basic', 'conversational', 'intermediate', 'advanced', 'fluent', 'native'])
      .withMessage('Listening level must be one of: basic, conversational, intermediate, advanced, fluent, native')
      .escape(),

    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters')
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

  // Update Language validation
  static update = ValidationMiddleware.validate([
    param('id')
      .isUUID(4)
      .withMessage('Language ID must be a valid UUID')
      .escape(),

    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Language name must be between 1 and 100 characters')
      .escape(),

    body('languageCode')
      .optional()
      .trim()
      .isLength({ min: 2, max: 10 })
      .withMessage('Language code must be between 2 and 10 characters')
      .matches(/^[a-zA-Z-_]{2,10}$/)
      .withMessage('Language code must contain only letters, hyphens, and underscores')
      .escape(),

    body('proficiencyLevel')
      .optional()
      .isIn(['basic', 'conversational', 'intermediate', 'advanced', 'fluent', 'native'])
      .withMessage('Proficiency level must be one of: basic, conversational, intermediate, advanced, fluent, native')
      .escape(),

    body('isNative')
      .optional()
      .isBoolean()
      .withMessage('isNative must be a boolean')
      .toBoolean(),

    body('speakingLevel')
      .optional()
      .isIn(['basic', 'conversational', 'intermediate', 'advanced', 'fluent', 'native'])
      .withMessage('Speaking level must be one of: basic, conversational, intermediate, advanced, fluent, native')
      .escape(),

    body('writingLevel')
      .optional()
      .isIn(['basic', 'conversational', 'intermediate', 'advanced', 'fluent', 'native'])
      .withMessage('Writing level must be one of: basic, conversational, intermediate, advanced, fluent, native')
      .escape(),

    body('readingLevel')
      .optional()
      .isIn(['basic', 'conversational', 'intermediate', 'advanced', 'fluent', 'native'])
      .withMessage('Reading level must be one of: basic, conversational, intermediate, advanced, fluent, native')
      .escape(),

    body('listeningLevel')
      .optional()
      .isIn(['basic', 'conversational', 'intermediate', 'advanced', 'fluent', 'native'])
      .withMessage('Listening level must be one of: basic, conversational, intermediate, advanced, fluent, native')
      .escape(),

    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters')
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

  // Get Language by ID validation
  static getById = ValidationMiddleware.validate([
    param('id')
      .isUUID(4)
      .withMessage('Language ID must be a valid UUID')
      .escape(),
  ]);

  // Delete Language validation
  static delete = ValidationMiddleware.validate([
    param('id')
      .isUUID(4)
      .withMessage('Language ID must be a valid UUID')
      .escape(),
  ]);

  // Get Languages by Profile validation
  static getByProfile = ValidationMiddleware.validate([
    param('profileId')
      .isUUID(4)
      .withMessage('Profile ID must be a valid UUID')
      .escape(),
  ]);

  // Get Languages by Proficiency validation
  static getByProficiency = ValidationMiddleware.validate([
    param('level')
      .isIn(['basic', 'conversational', 'intermediate', 'advanced', 'fluent', 'native'])
      .withMessage('Proficiency level must be one of: basic, conversational, intermediate, advanced, fluent, native')
      .escape(),
  ]);

  // Get Languages by Code validation
  static getByCode = ValidationMiddleware.validate([
    param('code')
      .trim()
      .isLength({ min: 2, max: 10 })
      .withMessage('Language code must be between 2 and 10 characters')
      .matches(/^[a-zA-Z-_]{2,10}$/)
      .withMessage('Language code must contain only letters, hyphens, and underscores')
      .escape(),
  ]);

  // List Languages validation
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
      .isIn(['name', 'languageCode', 'proficiencyLevel', 'isNative', 'createdAt'])
      .withMessage('Sort by must be one of: name, languageCode, proficiencyLevel, isNative, createdAt')
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
      .isLength({ min: 1, max: 100 })
      .withMessage('Name filter must be between 1 and 100 characters')
      .escape(),

    query('languageCode')
      .optional()
      .trim()
      .isLength({ min: 2, max: 10 })
      .withMessage('Language code filter must be between 2 and 10 characters')
      .matches(/^[a-zA-Z-_]{2,10}$/)
      .withMessage('Language code must contain only letters, hyphens, and underscores')
      .escape(),

    query('proficiencyLevel')
      .optional()
      .isIn(['basic', 'conversational', 'intermediate', 'advanced', 'fluent', 'native'])
      .withMessage('Proficiency level filter must be one of: basic, conversational, intermediate, advanced, fluent, native')
      .escape(),

    query('isNative')
      .optional()
      .isBoolean()
      .withMessage('isNative must be a boolean')
      .toBoolean(),

    query('hasDetailedProficiency')
      .optional()
      .isBoolean()
      .withMessage('hasDetailedProficiency must be a boolean')
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
    body('languages')
      .isArray({ min: 1, max: 20 })
      .withMessage('Languages must be an array with 1-20 items'),

    body('languages.*.profileId')
      .isUUID(4)
      .withMessage('Profile ID must be a valid UUID')
      .escape(),

    body('languages.*.name')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Language name must be between 1 and 100 characters')
      .escape(),

    body('languages.*.languageCode')
      .trim()
      .isLength({ min: 2, max: 10 })
      .withMessage('Language code must be between 2 and 10 characters')
      .matches(/^[a-zA-Z-_]{2,10}$/)
      .withMessage('Language code must contain only letters, hyphens, and underscores')
      .escape(),

    body('languages.*.proficiencyLevel')
      .isIn(['basic', 'conversational', 'intermediate', 'advanced', 'fluent', 'native'])
      .withMessage('Proficiency level must be one of: basic, conversational, intermediate, advanced, fluent, native')
      .escape(),

    body('languages.*.isNative')
      .optional()
      .isBoolean()
      .withMessage('isNative must be a boolean')
      .toBoolean(),

    body('languages.*.description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters')
      .escape(),
  ]);

  // Validation for language code verification
  static verifyLanguageCode = ValidationMiddleware.validate([
    body('languageCode')
      .trim()
      .isLength({ min: 2, max: 10 })
      .withMessage('Language code must be between 2 and 10 characters')
      .matches(/^[a-zA-Z-_]{2,10}$/)
      .withMessage('Language code must be a valid ISO 639-1 or extended code')
      .escape()
      .custom((value) => {
        // Common language codes validation
        const commonCodes = ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'ru', 'ar', 'hi', 'nl', 'sv', 'no', 'da', 'fi', 'pl', 'tr', 'he'];
        const extendedCodes = ['en-US', 'en-GB', 'es-ES', 'es-MX', 'fr-FR', 'fr-CA', 'de-DE', 'pt-BR', 'pt-PT', 'zh-CN', 'zh-TW'];
        
        if (!commonCodes.includes(value) && !extendedCodes.includes(value)) {
          // Allow it but warn - don't throw error for flexibility
          return true;
        }
        return true;
      }),
  ]);

  // Validation for proficiency assessment
  static assessProficiency = ValidationMiddleware.validate([
    body('languageId')
      .isUUID(4)
      .withMessage('Language ID must be a valid UUID')
      .escape(),

    body('speakingScore')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Speaking score must be between 0 and 100')
      .toInt(),

    body('writingScore')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Writing score must be between 0 and 100')
      .toInt(),

    body('readingScore')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Reading score must be between 0 and 100')
      .toInt(),

    body('listeningScore')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Listening score must be between 0 and 100')
      .toInt(),

    body('certificationName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Certification name must be between 1 and 100 characters')
      .escape(),

    body('certificationScore')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Certification score must be between 1 and 50 characters')
      .escape(),
  ]);
} 