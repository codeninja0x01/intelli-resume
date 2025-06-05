import { Router } from 'express';
import { certificationController } from '../controllers/certification.controller';
import { CertificationValidations } from '../validation/certification.validations';
import { authenticateToken, requireRole, AuthenticatedRequest } from '@/middleware/auth.middleware';
import { Request, Response } from 'express';

const router = Router();

// Routes that require authentication
router.use(authenticateToken);

/**
 * @route   POST /api/certifications
 * @desc    Create a new certification
 * @access  Private (authenticated users)
 */
router.post(
  '/',
  CertificationValidations.createCertification,
  (req: Request, res: Response) => {
    certificationController.createCertification(req as AuthenticatedRequest, res);
  }
);

/**
 * @route   GET /api/certifications
 * @desc    List certifications with filtering and pagination
 * @access  Private (authenticated users)
 */
router.get(
  '/',
  CertificationValidations.listCertifications,
  certificationController.listCertifications.bind(certificationController)
);

/**
 * @route   GET /api/certifications/me
 * @desc    Get current user's certifications
 * @access  Private (authenticated users)
 */
router.get(
  '/me',
  (req: Request, res: Response) => {
    certificationController.getMyCertifications(req as AuthenticatedRequest, res);
  }
);

/**
 * @route   GET /api/certifications/me/stats
 * @desc    Get current user's certification statistics
 * @access  Private (authenticated users)
 */
router.get(
  '/me/stats',
  (req: Request, res: Response) => {
    certificationController.getMyCertificationStats(req as AuthenticatedRequest, res);
  }
);

/**
 * @route   GET /api/certifications/valid
 * @desc    Get valid (non-expired) certifications
 * @access  Private (authenticated users)
 */
router.get(
  '/valid',
  certificationController.getValidCertifications.bind(certificationController)
);

/**
 * @route   GET /api/certifications/expiring
 * @desc    Get certifications expiring soon
 * @access  Private (authenticated users)
 */
router.get(
  '/expiring',
  certificationController.getExpiringCertifications.bind(certificationController)
);

/**
 * @route   GET /api/certifications/profile/:profileId
 * @desc    Get certifications by profile ID
 * @access  Private (authenticated users)
 */
router.get(
  '/profile/:profileId',
  CertificationValidations.getCertificationsByProfile,
  certificationController.getCertificationsByProfile.bind(certificationController)
);

/**
 * @route   GET /api/certifications/profile/:profileId/stats
 * @desc    Get certification statistics for a profile
 * @access  Private (authenticated users - admins can view any profile)
 */
router.get(
  '/profile/:profileId/stats',
  CertificationValidations.getCertification, // Reuse validation for profileId param
  certificationController.getCertificationStats.bind(certificationController)
);

/**
 * @route   GET /api/certifications/:id
 * @desc    Get certification by ID
 * @access  Private (authenticated users)
 */
router.get(
  '/:id',
  CertificationValidations.getCertification,
  certificationController.getCertification.bind(certificationController)
);

/**
 * @route   PUT /api/certifications/:id
 * @desc    Update certification
 * @access  Private (authenticated users - own certifications only, admins can update any)
 */
router.put(
  '/:id',
  CertificationValidations.updateCertification,
  (req: Request, res: Response) => {
    certificationController.updateCertification(req as AuthenticatedRequest, res);
  }
);

/**
 * @route   DELETE /api/certifications/:id
 * @desc    Delete certification
 * @access  Private (authenticated users - own certifications only, admins can delete any)
 */
router.delete(
  '/:id',
  CertificationValidations.deleteCertification,
  (req: Request, res: Response) => {
    certificationController.deleteCertification(req as AuthenticatedRequest, res);
  }
);

// Admin-only routes
/**
 * @route   GET /api/certifications/admin/all
 * @desc    Get all certifications (admin only)
 * @access  Private (admin only)
 */
router.get(
  '/admin/all',
  (req: Request, res: Response, next) => {
    requireRole(['admin'])(req as AuthenticatedRequest, res, next);
  },
  CertificationValidations.listCertifications,
  certificationController.listCertifications.bind(certificationController)
);

export default router; 