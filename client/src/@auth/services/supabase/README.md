# Supabase Authentication Service

This directory contains the Supabase authentication implementation for the Fuse React application.

## Setup

### Environment Variables

Add the following environment variables to your `.env` file in the client directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard:
1. Go to your Supabase project
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key

### Backend Integration

This auth service integrates with the Supabase backend API endpoints:

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/user-by-email/:email` - Get user by email
- `POST /api/auth/user` - Create user profile
- `PUT /api/auth/user/:id` - Update user profile

## Components

- `SupabaseAuthProvider.tsx` - Main authentication provider
- `SupabaseAuthContext.tsx` - Authentication context
- `useSupabaseAuth.tsx` - Authentication hook
- `supabaseAuthConfig.ts` - Supabase client configuration
- `components/SupabaseSignInForm.tsx` - Sign-in form
- `components/SupabaseSignUpForm.tsx` - Sign-up form

## Features

- ✅ Email/password authentication
- ✅ User registration with email confirmation
- ✅ Password reset functionality
- ✅ Automatic session management
- ✅ Token refresh handling
- ✅ Integration with Fuse auth system
- ✅ User profile management

## Usage

The Supabase auth service is automatically configured in the main `Authentication.tsx` component. The forms can be used in your sign-in/sign-up pages:

```tsx
import SupabaseSignInForm from '@auth/services/supabase/components/SupabaseSignInForm';
import SupabaseSignUpForm from '@auth/services/supabase/components/SupabaseSignUpForm';
``` 