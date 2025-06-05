import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// Import configuration
import { config } from './config';
import {
  corsOptions,
  helmetOptions,
  rateLimitOptions,
  jsonParserOptions,
  urlencodedOptions,
  staticOptions,
} from './config/app.config';

// Import routes and middleware
import routes from './routes';
import { notFoundHandler, errorHandler } from '@/middleware/error.middleware';

// Create Express application
const app: Application = express();

// ===== SECURITY MIDDLEWARE =====
// Trust proxy (important for rate limiting and getting real IP addresses)
app.set('trust proxy', 1);

// Security headers
app.use(helmet(helmetOptions));

// CORS configuration
app.use(cors(corsOptions));

// ===== PERFORMANCE MIDDLEWARE =====
// Compression
app.use(compression());

// Rate limiting - apply to API routes only
const limiter = rateLimit(rateLimitOptions);
app.use('/api', limiter);

// ===== LOGGING MIDDLEWARE =====
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ===== PARSING MIDDLEWARE =====
// Body parsing
app.use(express.json(jsonParserOptions));
app.use(express.urlencoded(urlencodedOptions));

// ===== STATIC FILES =====
app.use('/public', express.static('public', staticOptions));

// ===== API ROUTES =====
// Mount all routes
app.use('/', routes);

// ===== ERROR HANDLING =====
// 404 handler for undefined routes
app.use('*', notFoundHandler);

// Global error handling middleware
app.use(errorHandler);

export default app; 