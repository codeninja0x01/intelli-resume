import { Router } from 'express';
import { authenticateToken, requireRole } from '@/middleware/auth.middleware';
import { skillController } from '../controllers/skill.controller';
import { SkillValidation } from '../validation/skill.validations';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// =============================================================================
// PUBLIC USER ROUTES (Authenticated users)
// =============================================================================

// Create skill (users can create for themselves, admins for anyone)
router.post(
  '/',
  SkillValidation.create,
  (req, res) => skillController.createSkill(req as any, res)
);

// Get user's own skills
router.get(
  '/me',
  (req, res) => skillController.getMySkills(req as any, res)
);

// Get user's skill statistics
router.get(
  '/me/stats',
  (req, res) => skillController.getMySkillStats(req as any, res)
);

// Get user's skills grouped by categories
router.get(
  '/me/categories',
  (req, res) => skillController.getMySkillsByCategories(req as any, res)
);

// Get user's expert skills
router.get(
  '/me/expert',
  (req, res) => skillController.getMyExpertSkills(req as any, res)
);

// Get unique categories (public data)
router.get(
  '/categories',
  (req, res) => skillController.getUniqueCategories(req as any, res)
);

// Get skills by category (filtered to user's own or public data)
router.get(
  '/category/:category',
  SkillValidation.getByCategory,
  (req, res) => skillController.getSkillsByCategory(req as any, res)
);

// Get skills by level (filtered to user's own or public data)
router.get(
  '/level/:level',
  SkillValidation.getByLevel,
  (req, res) => skillController.getSkillsByLevel(req as any, res)
);

// Get skill by ID (user can access their own)
router.get(
  '/:id',
  SkillValidation.getById,
  (req, res) => skillController.getSkillById(req as any, res)
);

// Update skill (user can update their own)
router.put(
  '/:id',
  SkillValidation.update,
  (req, res) => skillController.updateSkill(req as any, res)
);

// Delete skill (user can delete their own)
router.delete(
  '/:id',
  SkillValidation.delete,
  (req, res) => skillController.deleteSkill(req as any, res)
);

// =============================================================================
// ADMIN-ONLY ROUTES
// =============================================================================

// Get all skills (admin only)
router.get(
  '/admin/all',
  requireRole(['admin']),
  SkillValidation.list,
  (req, res) => skillController.getAllSkills(req as any, res)
);

// Get global skill statistics (admin only)
router.get(
  '/admin/stats',
  requireRole(['admin']),
  (req, res) => skillController.getAllSkillStats(req as any, res)
);

// Get expert skills across all users (admin only)
router.get(
  '/admin/expert',
  requireRole(['admin']),
  (req, res) => skillController.getExpertSkills(req as any, res)
);

// Get skills grouped by categories (all users, admin only)
router.get(
  '/admin/categories/grouped',
  requireRole(['admin']),
  (req, res) => skillController.getSkillsByCategories(req as any, res)
);

// Get skills by profile ID (admin only)
router.get(
  '/admin/profile/:profileId',
  requireRole(['admin']),
  SkillValidation.getByProfile,
  (req, res) => skillController.getSkillsByProfile(req as any, res)
);

// Get skill statistics by profile ID (admin only)
router.get(
  '/admin/profile/:profileId/stats',
  requireRole(['admin']),
  SkillValidation.getByProfile,
  (req, res) => skillController.getSkillStatsByProfile(req as any, res)
);

export default router; 