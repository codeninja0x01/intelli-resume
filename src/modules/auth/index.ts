// Auth Module - Authentication & Authorization

// Core Auth Service
export { AuthService, authService } from './services/auth.service';

// Supporting Services
export { sessionService } from './services/session.service';
export { tokenService } from './services/token.service';
export { SupabaseAuthService } from './services/supabase-auth.service';

// Controllers
export { AuthController } from './controllers/auth.controller';

// Validation
export { AuthValidations } from './validation/auth.validations';
export { AuthBusinessValidator } from './validators/auth-business.validator';

// Utility Classes
export { AuthErrorUtil } from './utils/auth-error.util';
export { AuthDataUtil } from './utils/auth-data.util';

// Constants and Types
export { 
  AUTH_CONSTANTS, 
  type AccountStatus, 
  type UserRole, 
  type ErrorCode, 
  type VerificationType 
} from './constants/auth.constants';

// Routes
export { default as authRoutes } from './routes/auth.routes'; 