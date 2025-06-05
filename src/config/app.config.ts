import { CorsOptions } from 'cors';
import { config } from './index';

// ===== CORS CONFIGURATION =====
export const corsOptions: CorsOptions = {
  origin: config.corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// ===== HELMET CONFIGURATION =====
export const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
};

// ===== RATE LIMITING CONFIGURATION =====
export const rateLimitOptions = {
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil(config.rateLimitWindowMs / 1000),
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
};

// ===== JSON PARSING CONFIGURATION =====
export const jsonParserOptions = {
  limit: '10mb',
  strict: true,
};

// ===== URL ENCODED CONFIGURATION =====
export const urlencodedOptions = {
  extended: true,
  limit: '10mb',
};

// ===== STATIC FILES CONFIGURATION =====
export const staticOptions = {
  maxAge: '1y',
  etag: true,
}; 