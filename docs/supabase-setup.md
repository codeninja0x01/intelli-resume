# Supabase Integration Setup Guide

## 🚀 Quick Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be provisioned

### 2. Get API Keys
1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### 3. Configure Environment Variables
```bash
cp env.example .env
```

Update your `.env` file:
```env
SUPABASE_URL=your_project_url_here
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 4. Set Up Database
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and run the SQL from `docs/database-setup.sql`
3. This creates:
   - `profiles` table
   - Row Level Security policies
   - Automatic profile creation trigger

## 📊 Database Schema

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔐 Authentication Flow

### Sign Up
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

### Sign In
```bash
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer your_jwt_token_here
```

### Sign Out
```bash
POST /api/auth/signout
Authorization: Bearer your_jwt_token_here
```

## 🛡️ Security Features

### Row Level Security (RLS)
- Users can only access their own profiles
- Service role can access all profiles (for admin operations)
- Automatic profile creation on user registration

### JWT Token Validation
- All protected routes require valid JWT tokens
- Tokens are verified against Supabase Auth
- User information is attached to request object

### Role-Based Access Control
```typescript
// Example: Admin-only route
router.get('/admin', 
  authenticateToken, 
  requireRole(['admin']), 
  adminController.getData
);
```

## 🔧 API Endpoints

### Public Endpoints
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/reset-password` - Send password reset email

### Protected Endpoints
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/signout` - Sign out user
- `PUT /api/auth/update-password` - Update user password

## 🧪 Testing the Integration

### 1. Start the server
```bash
npm run dev
```

### 2. Test authentication
```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Sign in
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get user (replace TOKEN with actual token from sign in response)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## 🔍 Troubleshooting

### Common Issues

1. **Missing environment variables**
   ```
   Error: Missing required Supabase environment variables
   ```
   → Check your `.env` file has all required Supabase variables

2. **Database connection issues**
   → Verify your Supabase project URL and keys
   → Make sure database setup SQL was executed

3. **Authentication errors**
   → Check if JWT token is properly formatted
   → Verify token hasn't expired

### Debug Mode
Set `LOG_LEVEL=debug` in your `.env` for detailed logging.

## 🚀 Next Steps

1. **Add more user fields** to the profiles table
2. **Implement email verification** flows
3. **Add social authentication** (Google, GitHub, etc.)
4. **Create admin dashboard** for user management
5. **Add user roles** and permissions system

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security) 