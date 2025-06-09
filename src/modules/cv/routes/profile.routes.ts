import { Router, Request, Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '@/middleware/auth.middleware';
import { profileController } from '../controllers/profile.controller';

const router = Router();

/**
 * @route   GET /api/profiles/me
 * @desc    Get the profile of the currently authenticated user
 * @access  Private
 */
router.get(
  '/me',
  authenticateToken,
  (req: Request, res: Response) => {
    profileController.getMyProfile(req as AuthenticatedRequest, res);
  }
);

/**
 * @route   POST /api/profiles/create-from-auth
 * @desc    Creates a user profile from a JWT if one doesn't already exist.
 * This is intended to be called by the frontend immediately after a successful sign-up.
 * @access  Private (Requires a valid JWT)
 */
router.post(
    '/create-from-auth',
    authenticateToken,
    (req: Request, res: Response) => {
        profileController.createProfileFromAuth(req as AuthenticatedRequest, res);
    }
);

/**
 * @route   PUT /api/profiles/complete-onboarding
 * @desc    Mark onboarding as completed for the authenticated user
 * @access  Private (Requires a valid JWT)
 */
router.put(
    '/complete-onboarding',
    authenticateToken,
    (req: Request, res: Response) => {
        profileController.completeOnboarding(req as AuthenticatedRequest, res);
    }
);

export default router;
