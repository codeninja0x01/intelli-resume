import { Router } from 'express';

// Import all route modules
import apiRoutes from './api.routes';
import certificationRoutes from '@/modules/cv/routes/certification.routes';
import educationRoutes from '@/modules/cv/routes/education.routes';
import experienceRoutes from '@/modules/cv/routes/experience.routes';
import skillRoutes from '@/modules/cv/routes/skill.routes';
import languageRoutes from '@/modules/cv/routes/language.routes';
import healthRoutes from './health.routes';
import profileRoutes from '@/modules/cv/routes/profile.routes';

// Create main router
const router = Router();

// Global auth redirect routes (for Supabase email verification)
router.get('/auth/confirm', (req, res) => {
  const queryString = new URLSearchParams(req.query as Record<string, string>).toString();
  res.redirect(301, `/api/auth/callback?${queryString}`);
});

router.get('/auth/callback', (req, res) => {
  const queryString = new URLSearchParams(req.query as Record<string, string>).toString();
  res.redirect(301, `/api/auth/callback?${queryString}`);
});

// Mount routes
router.use('/health', healthRoutes);
router.use('/api', apiRoutes);
router.use('/api/certifications', certificationRoutes);
router.use('/api/education', educationRoutes);
router.use('/api/experiences', experienceRoutes);
router.use('/api/skills', skillRoutes);
router.use('/api/languages', languageRoutes);
router.use('/api/profiles', profileRoutes);

export default router;