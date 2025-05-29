import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/signup', authController.signUp.bind(authController));
router.post('/signin', authController.signIn.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));
router.post('/reset-password', authController.resetPassword.bind(authController));

// Protected routes
router.post('/signout', authenticateToken, authController.signOut.bind(authController) as any);
router.get('/me', authenticateToken, authController.getCurrentUser.bind(authController) as any);
router.put('/update-password', authenticateToken, authController.updatePassword.bind(authController) as any);

export default router; 