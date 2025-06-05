import { Router, Request, Response } from 'express';
import { config } from '../config';
import { ApiResponse } from './types-index';

const router = Router();

// Health check endpoint
router.get('/', (_req: Request, res: Response) => {
  const healthCheck: ApiResponse = {
    success: true,
    message: 'Server is running',
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
      version: process.env.npm_package_version || '1.0.0',
      memory: {
        used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
        total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
        external: Math.round((process.memoryUsage().external / 1024 / 1024) * 100) / 100,
      },
    },
  };
  res.status(200).json(healthCheck);
});

// Detailed health check for monitoring
router.get('/detailed', (_req: Request, res: Response) => {
  const detailedHealth: ApiResponse = {
    success: true,
    message: 'Detailed health information',
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
      version: process.env.npm_package_version || '1.0.0',
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      platform: process.platform,
      nodeVersion: process.version,
      pid: process.pid,
      loadAverage: process.platform !== 'win32' ? require('os').loadavg() : null,
    },
  };
  res.status(200).json(detailedHealth);
});

export default router; 