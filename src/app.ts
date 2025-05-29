import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { ApiResponse } from './types';
import authRoutes from './routes/auth.routes';

// Create Express application
const app: Application = express();

// Trust proxy (important for rate limiting and getting real IP addresses)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
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
}));

// CORS configuration
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    error: 'Rate limit exceeded',
  } as ApiResponse,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Compression middleware
app.use(compression());

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  strict: true,
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb',
}));

// Static files
app.use('/public', express.static('public', {
  maxAge: '1y',
  etag: true,
}));

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  const healthCheck: ApiResponse = {
    success: true,
    message: 'Server is running',
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
      version: process.env.npm_package_version || '1.0.0',
    },
  };
  res.status(200).json(healthCheck);
});

// API routes
app.use('/api/auth', authRoutes);

// API base route
app.get('/api', (_req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    message: 'Welcome to Intelli Resume API',
    data: {
      endpoints: {
        auth: '/api/auth',
        health: '/health',
      },
      timestamp: new Date().toISOString(),
    },
  };
  res.status(200).json(response);
});

// 404 handler for undefined routes
app.use('*', (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: false,
    message: `Route ${req.originalUrl} not found`,
    error: 'Not Found',
  };
  res.status(404).json(response);
});

// Global error handling middleware
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  // Log error
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;
  
  // Prepare error response
  const errorResponse: ApiResponse = {
    success: false,
    message: err.message || 'Internal Server Error',
    error: config.nodeEnv === 'development' 
      ? { stack: err.stack, details: err }
      : 'Something went wrong',
  };

  // Send error response
  res.status(statusCode).json(errorResponse);
});

export default app; 