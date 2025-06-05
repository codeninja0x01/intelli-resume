import { body, param, query, ValidationChain } from 'express-validator';

// Common validation rules that can be reused across the application
export class CommonValidations {
  // Email validation
  static email(fieldName: string = 'email'): ValidationChain {
    return body(fieldName)
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail({ gmail_remove_dots: false })
      .isLength({ max: 255 })
      .withMessage('Email must not exceed 255 characters')
      .trim();
  }

  // Password validation
  static password(fieldName: string = 'password', requireStrong: boolean = true): ValidationChain {
    const validation = body(fieldName)
      .isLength({ min: 8, max: 128 })
      .withMessage('Password must be between 8 and 128 characters');

    if (requireStrong) {
      return validation
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)');
    }

    return validation;
  }

  // Name validation (first name, last name, etc.)
  static nameField(fieldName: string, displayName?: string): ValidationChain {
    const display = displayName || fieldName;
    return body(fieldName)
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage(`${display} must be between 1 and 50 characters`)
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage(`${display} can only contain letters, spaces, hyphens, and apostrophes`);
  }

  // UUID validation
  static uuid(fieldName: string = 'id', location: 'body' | 'param' | 'query' = 'param'): ValidationChain {
    const validator = location === 'body' ? body(fieldName) : 
                    location === 'param' ? param(fieldName) : 
                    query(fieldName);
    
    return validator
      .isUUID()
      .withMessage('Invalid ID format');
  }

  // Phone validation (optional)
  static optionalPhone(fieldName: string = 'phone'): ValidationChain {
    return body(fieldName)
      .optional()
      .trim()
      .matches(/^[+]?[1-9][\d]{0,15}$/)
      .withMessage('Please provide a valid phone number')
      .isLength({ min: 10, max: 20 })
      .withMessage('Phone number must be between 10 and 20 digits');
  }

  // URL validation (optional)
  static optionalURL(fieldName: string, displayName?: string): ValidationChain {
    const display = displayName || fieldName;
    return body(fieldName)
      .optional()
      .trim()
      .isURL()
      .withMessage(`Please provide a valid ${display} URL`)
      .isLength({ max: 500 })
      .withMessage(`${display} URL must not exceed 500 characters`);
  }

  // Text field validation
  static text(fieldName: string, minLength: number = 1, maxLength: number = 255, displayName?: string): ValidationChain {
    const display = displayName || fieldName;
    return body(fieldName)
      .trim()
      .isLength({ min: minLength, max: maxLength })
      .withMessage(`${display} must be between ${minLength} and ${maxLength} characters`);
  }

  // Optional text field validation
  static optionalText(fieldName: string, maxLength: number = 255, displayName?: string): ValidationChain {
    const display = displayName || fieldName;
    return body(fieldName)
      .optional()
      .trim()
      .isLength({ max: maxLength })
      .withMessage(`${display} must not exceed ${maxLength} characters`);
  }

  // Enum validation
  static enum(fieldName: string, allowedValues: string[], displayName?: string): ValidationChain {
    const display = displayName || fieldName;
    return body(fieldName)
      .isIn(allowedValues)
      .withMessage(`${display} must be one of: ${allowedValues.join(', ')}`);
  }

  // Optional enum validation
  static optionalEnum(fieldName: string, allowedValues: string[], displayName?: string): ValidationChain {
    const display = displayName || fieldName;
    return body(fieldName)
      .optional()
      .isIn(allowedValues)
      .withMessage(`${display} must be one of: ${allowedValues.join(', ')}`);
  }

  // Pagination query validation
  static paginationQuery(): ValidationChain[] {
    return [
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
    ];
  }

  // Search query validation
  static searchQuery(): ValidationChain {
    return query('search')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('Search query must not exceed 255 characters');
  }

  // Sort validation
  static sortQuery(allowedFields: string[]): ValidationChain[] {
    return [
      query('sortBy')
        .optional()
        .isIn(allowedFields)
        .withMessage(`Sort field must be one of: ${allowedFields.join(', ')}`),
      query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be either "asc" or "desc"'),
    ];
  }

  // Required field validation
  static required(fieldName: string, displayName?: string): ValidationChain {
    const display = displayName || fieldName;
    return body(fieldName)
      .notEmpty()
      .withMessage(`${display} is required`);
  }

  // Integer validation
  static integer(fieldName: string, min?: number, max?: number, displayName?: string): ValidationChain {
    const display = displayName || fieldName;
    const options: any = {};
    if (min !== undefined) options.min = min;
    if (max !== undefined) options.max = max;
    
    return body(fieldName)
      .isInt(options)
      .withMessage(`${display} must be an integer${min !== undefined ? ` between ${min}` : ''}${max !== undefined ? ` and ${max}` : ''}`)
      .toInt();
  }

  // Optional integer validation
  static optionalInteger(fieldName: string, min?: number, max?: number, displayName?: string): ValidationChain {
    const display = displayName || fieldName;
    const options: any = {};
    if (min !== undefined) options.min = min;
    if (max !== undefined) options.max = max;
    
    return body(fieldName)
      .optional()
      .isInt(options)
      .withMessage(`${display} must be an integer${min !== undefined ? ` between ${min}` : ''}${max !== undefined ? ` and ${max}` : ''}`)
      .toInt();
  }

  // Boolean validation
  static boolean(fieldName: string, displayName?: string): ValidationChain {
    const display = displayName || fieldName;
    return body(fieldName)
      .isBoolean()
      .withMessage(`${display} must be a boolean`)
      .toBoolean();
  }

  // Optional boolean validation
  static optionalBoolean(fieldName: string, displayName?: string): ValidationChain {
    const display = displayName || fieldName;
    return body(fieldName)
      .optional()
      .isBoolean()
      .withMessage(`${display} must be a boolean`)
      .toBoolean();
  }

  // Date validation
  static date(fieldName: string, displayName?: string): ValidationChain {
    const display = displayName || fieldName;
    return body(fieldName)
      .isISO8601()
      .withMessage(`${display} must be a valid date`)
      .toDate();
  }

  // Optional date validation
  static optionalDate(fieldName: string, displayName?: string): ValidationChain {
    const display = displayName || fieldName;
    return body(fieldName)
      .optional()
      .isISO8601()
      .withMessage(`${display} must be a valid date`)
      .toDate();
  }
} 