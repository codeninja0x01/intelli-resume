import { Router } from 'express';
import { authenticateToken, requireRole } from '@/middleware/auth.middleware';
import { experienceController } from '../controllers/experience.controller';
import { ExperienceValidation } from '../validation/experience.validations';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// =============================================================================
// PUBLIC USER ROUTES (Authenticated users)
// =============================================================================

// Create experience (users can create for themselves, admins for anyone)
router.post(
  '/',
  ExperienceValidation.create,
  (req, res) => experienceController.createExperience(req as any, res)
);

// Get user's own experience
router.get(
  '/me',
  (req, res) => experienceController.getMyExperience(req as any, res)
);

// Get user's experience statistics
router.get(
  '/me/stats',
  (req, res) => experienceController.getMyExperienceStats(req as any, res)
);

// Get experience by ID (user can access their own)
router.get(
  '/:id',
  ExperienceValidation.getById,
  (req, res) => experienceController.getExperienceById(req as any, res)
);

// Update experience (user can update their own)
router.put(
  '/:id',
  ExperienceValidation.update,
  (req, res) => experienceController.updateExperience(req as any, res)
);

// Delete experience (user can delete their own)
router.delete(
  '/:id',
  ExperienceValidation.delete,
  (req, res) => experienceController.deleteExperience(req as any, res)
);

// =============================================================================
// ADMIN-ONLY ROUTES
// =============================================================================

// Get all experience (admin only)
router.get(
  '/admin/all',
  requireRole(['admin']),
  ExperienceValidation.list,
  (req, res) => experienceController.getAllExperience(req as any, res)
);

// Get global experience statistics (admin only)
router.get(
  '/admin/stats',
  requireRole(['admin']),
  (req, res) => experienceController.getAllExperienceStats(req as any, res)
);

// Get current experience (admin only)
router.get(
  '/admin/current',
  requireRole(['admin']),
  (req, res) => experienceController.getCurrentExperience(req as any, res)
);

// Get experience by company (admin only)
router.get(
  '/admin/company/:company',
  requireRole(['admin']),
  (req, res) => experienceController.getExperienceByCompany(req as any, res)
);

// Get experience by profile ID (admin only)
router.get(
  '/admin/profile/:profileId',
  requireRole(['admin']),
  ExperienceValidation.getByProfile,
  (req, res) => experienceController.getExperienceByProfile(req as any, res)
);

// Get experience statistics by profile ID (admin only)
router.get(
  '/admin/profile/:profileId/stats',
  requireRole(['admin']),
  ExperienceValidation.getByProfile,
  (req, res) => experienceController.getExperienceStatsByProfile(req as any, res)
);

export default router; 