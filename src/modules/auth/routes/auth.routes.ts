import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '@/middleware/validation.middleware';
import { AuthValidations } from '../validation/auth.validations';
import { authenticateToken, AuthenticatedRequest } from '@/middleware/auth.middleware';
import { Request, Response } from 'express';

const router = Router();

// Authentication endpoints
// POST /auth/signup - Create a new user
router.post('/signup', validate(AuthValidations.signUp()), authController.signUp.bind(authController));

// POST /auth/signin - Sign in user
router.post('/signin', validate(AuthValidations.signIn()), authController.signIn.bind(authController));

// POST /auth/admin/signin - Admin sign in
router.post('/admin/signin', validate(AuthValidations.adminSignIn()), authController.adminSignIn.bind(authController));

// POST /auth/callback - Handle Supabase auth callback (email verification)
router.post('/callback', validate(AuthValidations.authCallback()), authController.authCallback.bind(authController));

// GET /auth/callback - Handle Supabase email verification links (redirects from email)
router.get('/callback', validate(AuthValidations.authCallback()), authController.authCallback.bind(authController));

// POST /auth/signout - Sign out user (protected)
router.post('/signout', authenticateToken, (req: Request, res: Response) => {
  authController.signOut(req as AuthenticatedRequest, res);
});

// POST /auth/refresh - Refresh access token
router.post('/refresh', validate(AuthValidations.refreshToken()), authController.refreshToken.bind(authController));

// GET /auth/me - Get current user (protected)
router.get('/me', authenticateToken, (req: Request, res: Response) => {
  authController.getCurrentUser(req as AuthenticatedRequest, res);
});

// POST /auth/reset-password - Request password reset
router.post('/reset-password', validate(AuthValidations.resetPassword()), authController.resetPassword.bind(authController));

// PUT /auth/update-password - Update password (protected)
router.put('/update-password', authenticateToken, validate(AuthValidations.updatePassword()), (req: Request, res: Response) => {
  authController.updatePassword(req as AuthenticatedRequest, res);
});

export default router; 