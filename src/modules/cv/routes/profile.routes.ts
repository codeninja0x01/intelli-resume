import { Router, Request, Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '@/middleware/auth.middleware';
import { profileController } from '../controllers/profile.controller';

const router = Router();

/**
 * @route   GET /api/profiles/me
 * @desc    Get the profile of the currently authenticated user
 * @access  Private (Requires a valid JWT)
 */
router.get(
  '/me',
  authenticateToken,
  (req: Request, res: Response) => {
    profileController.getMyProfile(req as AuthenticatedRequest, res);
  }
);

export default router;