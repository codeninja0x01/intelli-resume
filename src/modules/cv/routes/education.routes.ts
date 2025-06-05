import { Router } from 'express';
import { authenticateToken, requireRole } from '@/middleware/auth.middleware';
import { educationController } from '../controllers/education.controller';
import { EducationValidation } from '../validation/education.validations';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// =============================================================================
// PUBLIC USER ROUTES (Authenticated users)
// =============================================================================

// Create education (users can create for themselves, admins for anyone)
router.post(
  '/',
  EducationValidation.create,
  (req, res) => educationController.createEducation(req as any, res)
);

// Get user's own education
router.get(
  '/me',
  (req, res) => educationController.getMyEducation(req as any, res)
);

// Get user's education statistics
router.get(
  '/me/stats',
  (req, res) => educationController.getMyEducationStats(req as any, res)
);

// Get education by ID (user can access their own)
router.get(
  '/:id',
  EducationValidation.getById,
  (req, res) => educationController.getEducationById(req as any, res)
);

// Update education (user can update their own)
router.put(
  '/:id',
  EducationValidation.update,
  (req, res) => educationController.updateEducation(req as any, res)
);

// Delete education (user can delete their own)
router.delete(
  '/:id',
  EducationValidation.delete,
  (req, res) => educationController.deleteEducation(req as any, res)
);

// =============================================================================
// ADMIN-ONLY ROUTES
// =============================================================================

// Get all education (admin only)
router.get(
  '/admin/all',
  requireRole(['admin']),
  EducationValidation.list,
  (req, res) => educationController.getAllEducation(req as any, res)
);

// Get global education statistics (admin only)
router.get(
  '/admin/stats',
  requireRole(['admin']),
  (req, res) => educationController.getAllEducationStats(req as any, res)
);

// Get current education (admin only)
router.get(
  '/admin/current',
  requireRole(['admin']),
  (req, res) => educationController.getCurrentEducation(req as any, res)
);

// Get education by institution (admin only)
router.get(
  '/admin/institution/:institution',
  requireRole(['admin']),
  (req, res) => educationController.getEducationByInstitution(req as any, res)
);

// Get education by profile ID (admin only)
router.get(
  '/admin/profile/:profileId',
  requireRole(['admin']),
  EducationValidation.getByProfile,
  (req, res) => educationController.getEducationByProfile(req as any, res)
);

// Get education statistics by profile ID (admin only)
router.get(
  '/admin/profile/:profileId/stats',
  requireRole(['admin']),
  EducationValidation.getByProfile,
  (req, res) => educationController.getEducationStatsByProfile(req as any, res)
);

export default router; 