import { Router, Request, Response } from 'express';
import { ApiResponse } from '../shared/types-index';
const router = Router();


// API base route - provides API information and available endpoints
router.get('/', (_req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    message: 'Welcome to Intelli Resume API',
    data: {
      name: 'Intelli Resume API',
      version: process.env.npm_package_version || '1.0.0',
      description: 'Express.js TypeScript API with Supabase Auth + Sequelize ORM',
      endpoints: {
        auth: {
          base: '/api/auth',
          endpoints: {
            signup: 'POST /api/auth/signup',
            signin: 'POST /api/auth/signin',
            signout: 'POST /api/auth/signout',
            refresh: 'POST /api/auth/refresh',
            user: 'GET /api/auth/user',
            resetPassword: 'POST /api/auth/reset-password',
            updatePassword: 'PUT /api/auth/update-password',
          },
        },
        certifications: {
          base: '/api/certifications',
          endpoints: {
            create: 'POST /api/certifications',
            list: 'GET /api/certifications',
            get: 'GET /api/certifications/:id',
            update: 'PUT /api/certifications/:id',
            delete: 'DELETE /api/certifications/:id',
            my: 'GET /api/certifications/me',
            myStats: 'GET /api/certifications/me/stats',
            valid: 'GET /api/certifications/valid',
            expiring: 'GET /api/certifications/expiring',
            byProfile: 'GET /api/certifications/profile/:profileId',
            profileStats: 'GET /api/certifications/profile/:profileId/stats',
            adminAll: 'GET /api/certifications/admin/all',
          },
        },
        skills: {
          base: '/api/skills',
          endpoints: {
            create: 'POST /api/skills',
            list: 'GET /api/skills/admin/all',
            get: 'GET /api/skills/:id',
            update: 'PUT /api/skills/:id',
            delete: 'DELETE /api/skills/:id',
            my: 'GET /api/skills/me',
            myStats: 'GET /api/skills/me/stats',
            myCategories: 'GET /api/skills/me/categories',
            myExpert: 'GET /api/skills/me/expert',
            expert: 'GET /api/skills/expert',
            categories: 'GET /api/skills/categories',
            categoriesGrouped: 'GET /api/skills/categories/grouped',
            byCategory: 'GET /api/skills/category/:category',
            byLevel: 'GET /api/skills/level/:level',
            byProfile: 'GET /api/skills/profile/:profileId',
            profileStats: 'GET /api/skills/profile/:profileId/stats',
            globalStats: 'GET /api/skills/stats',
          },
        },
        health: {
          basic: 'GET /health',
          detailed: 'GET /health/detailed',
        },
      },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    },
  };
  res.status(200).json(response);
});

export default router;