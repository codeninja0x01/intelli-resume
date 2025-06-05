# Auth Module - Supabase Best Practices with Redis Enhancements

## Overview
This auth module follows Supabase best practices while adding Redis-based enhancements for session management, rate limiting, and account status tracking.

## Key Features

### 🔒 **Supabase Authentication**
- Built-in email verification flow
- Secure session management
- JWT token handling with proper rotation
- Password reset functionality
- User metadata management

### 🚀 **Redis Enhancements**
- Token blacklisting for security
- Session tracking and concurrent session limits
- Rate limiting for registration
- Account status management (active/inactive/suspended)
- Email verification token management

### 🛡️ **Security Features**
- Transaction safety with compensating actions
- Role-based access (user/admin separation)
- Device tracking and session management
- Registration rate limiting
- Email domain validation

## Environment Variables

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password (optional)
REDIS_DB=0
REDIS_SESSION_DB=1

# Application Configuration
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### **Public Endpoints**

#### User Registration
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### User Sign In
```http
POST /auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Admin Sign In
```http
POST /auth/admin/signin
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "adminPassword123"
}
```

#### Email Verification Callback
```http
POST /auth/callback
Content-Type: application/json

{
  "code": "verification_code_from_supabase"
}
```

#### Password Reset
```http
POST /auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Token Refresh
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}
```

### **Protected Endpoints**

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <access_token>
```

#### Sign Out
```http
POST /auth/signout
Authorization: Bearer <access_token>
```

#### Update Password
```http
PUT /auth/update-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "newPassword": "newSecurePassword123"
}
```

## Business Logic Features

### **Email Verification Flow**
1. User registers → Account created as 'inactive'
2. Supabase sends verification email
3. User clicks email link → Redirected to `/auth/callback`
4. Frontend calls `/auth/callback` with code
5. Account status updated to 'active'

### **Role-Based Registration**
- Only 'user' role allowed during registration
- Admin accounts must be created manually
- Separate admin login endpoint for enhanced security

### **Rate Limiting**
- Max 3 registration attempts per hour per IP
- Configurable via Redis
- Automatic cleanup of expired rate limits

### **Session Management**
- Max 5 concurrent sessions per user
- Automatic cleanup of oldest sessions
- Device tracking (IP address, user agent)
- Session timeout and activity tracking

### **Account Status Management**
- **Active**: Normal account, can sign in
- **Inactive**: Email not verified, cannot sign in
- **Suspended**: Account suspended, cannot sign in

## Error Codes

### Registration Errors
- `BLOCKED_DOMAIN`: Email domain not allowed
- `USER_EXISTS`: User already exists
- `WEAK_PASSWORD`: Password doesn't meet requirements
- `REGISTRATION_RATE_LIMIT`: Too many attempts
- `PROFILE_CREATION_FAILED`: Database error

### Authentication Errors
- `INVALID_CREDENTIALS`: Wrong email/password
- `EMAIL_NOT_VERIFIED`: Email not confirmed
- `ACCOUNT_SUSPENDED`: Account suspended
- `ACCOUNT_INACTIVE`: Account not activated
- `INVALID_ADMIN_CREDENTIALS`: Admin login failed

### Token Errors
- `TOKEN_EXPIRED`: Token has expired
- `TOKEN_REVOKED`: Token was blacklisted
- `INVALID_TOKEN`: Malformed token
- `TOKEN_REFRESH_FAILED`: Refresh failed

## Usage Examples

### Frontend Integration

```typescript
// Registration
const registerUser = async (userData) => {
  const response = await fetch('/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  const result = await response.json();
  
  if (result.success && result.data.emailConfirmationRequired) {
    // Show email verification message
    showMessage('Please check your email to verify your account');
  }
};

// Sign In
const signIn = async (email, password) => {
  const response = await fetch('/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const result = await response.json();
  
  if (result.success) {
    // Store tokens
    localStorage.setItem('accessToken', result.data.token);
    localStorage.setItem('refreshToken', result.data.refreshToken);
  }
};

// Handle Email Verification
const handleEmailVerification = async (code) => {
  const response = await fetch('/auth/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });
  
  const result = await response.json();
  
  if (result.success) {
    // Account verified, redirect to sign in
    window.location.href = '/signin';
  }
};
```

## Security Best Practices

1. **Environment Security**
   - Keep service role key secure
   - Use HTTPS in production
   - Set proper CORS origins

2. **Token Management**
   - Short-lived access tokens (15 minutes)
   - Automatic token rotation
   - Secure refresh token storage

3. **Session Security**
   - Concurrent session limits
   - Device tracking
   - Automatic cleanup

4. **Rate Limiting**
   - Registration limits
   - Failed login attempt tracking
   - IP-based restrictions

## Monitoring and Maintenance

- Monitor Redis for session cleanup
- Watch for failed authentication attempts
- Track registration patterns
- Monitor account status changes
- Regular cleanup of expired sessions 