import { Router } from 'express';
import { authenticateToken, requireRole } from '@/middleware/auth.middleware';
import { languageController } from '../controllers/language.controller';
import { LanguageValidation } from '../validation/language.validations';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// =============================================================================
// PUBLIC USER ROUTES (Authenticated users)
// =============================================================================

// Create language (users can create for themselves, admins for anyone)
router.post(
  '/',
  LanguageValidation.create,
  (req, res) => languageController.createLanguage(req as any, res)
);

// Get user's own languages
router.get(
  '/me',
  (req, res) => languageController.getMyLanguages(req as any, res)
);

// Get user's language statistics
router.get(
  '/me/stats',
  (req, res) => languageController.getMyLanguageStats(req as any, res)
);

// Get user's native languages
router.get(
  '/me/native',
  (req, res) => languageController.getMyNativeLanguages(req as any, res)
);

// Get user's fluent languages
router.get(
  '/me/fluent',
  (req, res) => languageController.getMyFluentLanguages(req as any, res)
);

// Get user's languages grouped by proficiency levels
router.get(
  '/me/proficiency-levels',
  (req, res) => languageController.getMyLanguagesByProficiencyLevels(req as any, res)
);

// Get unique language codes (filtered to user's own)
router.get(
  '/codes',
  (req, res) => languageController.getUniqueLanguageCodes(req as any, res)
);

// Get unique language names (filtered to user's own)
router.get(
  '/names',
  (req, res) => languageController.getUniqueLanguageNames(req as any, res)
);

// Get native languages (filtered to user's own)
router.get(
  '/native',
  (req, res) => languageController.getNativeLanguages(req as any, res)
);

// Get fluent languages (filtered to user's own)
router.get(
  '/fluent',
  (req, res) => languageController.getFluentLanguages(req as any, res)
);

// Get languages grouped by proficiency levels (filtered to user's own)
router.get(
  '/proficiency-levels',
  (req, res) => languageController.getLanguagesByProficiencyLevels(req as any, res)
);

// Get languages by proficiency level (filtered to user's own)
router.get(
  '/proficiency/:level',
  LanguageValidation.getByProficiency,
  (req, res) => languageController.getLanguagesByProficiency(req as any, res)
);

// Get languages by language code (filtered to user's own)
router.get(
  '/code/:code',
  LanguageValidation.getByCode,
  (req, res) => languageController.getLanguagesByCode(req as any, res)
);

// Get language by ID (user can access their own)
router.get(
  '/:id',
  LanguageValidation.getById,
  (req, res) => languageController.getLanguageById(req as any, res)
);

// Update language (user can update their own)
router.put(
  '/:id',
  LanguageValidation.update,
  (req, res) => languageController.updateLanguage(req as any, res)
);

// Delete language (user can delete their own)
router.delete(
  '/:id',
  LanguageValidation.delete,
  (req, res) => languageController.deleteLanguage(req as any, res)
);

// =============================================================================
// ADMIN-ONLY ROUTES
// =============================================================================

// Get all languages (admin only)
router.get(
  '/admin/all',
  requireRole(['admin']),
  LanguageValidation.list,
  (req, res) => languageController.getAllLanguages(req as any, res)
);

// Get global language statistics (admin only)
router.get(
  '/admin/stats',
  requireRole(['admin']),
  (req, res) => languageController.getAllLanguageStats(req as any, res)
);

// Get languages by profile ID (admin only)
router.get(
  '/admin/profile/:profileId',
  requireRole(['admin']),
  LanguageValidation.getByProfile,
  (req, res) => languageController.getLanguagesByProfile(req as any, res)
);

// Get language statistics by profile ID (admin only)
router.get(
  '/admin/profile/:profileId/stats',
  requireRole(['admin']),
  LanguageValidation.getByProfile,
  (req, res) => languageController.getLanguageStatsByProfile(req as any, res)
);

export default router; 