import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['NODE_ENV', 'PORT'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Parse comma-separated origins
const parseOrigins = (origins: string | undefined): string[] => {
  if (!origins) return ['http://localhost:3000'];
  return origins.split(',').map(origin => origin.trim());
};

// Configuration object
export const config = {
  // Server configuration
  nodeEnv: process.env.NODE_ENV as 'development' | 'production' | 'test',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || 'localhost',

  // Database configuration
  databaseUrl: process.env.DATABASE_URL || '',
  
  // CORS configuration
  corsOrigins: parseOrigins(process.env.CORS_ORIGIN),

  // Rate limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),

  // File upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  uploadPath: process.env.UPLOAD_PATH || './public/uploads',

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
} as const;

export default config; 