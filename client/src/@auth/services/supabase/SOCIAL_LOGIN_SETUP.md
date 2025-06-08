# 🔑 Social Login Setup Guide

## Overview

Your Supabase authentication now supports social login with Facebook, Twitter, and GitHub. Here's how to configure each provider.

## 🚀 Quick Setup Checklist

- [ ] Configure OAuth providers in Supabase Dashboard
- [ ] Set up redirect URLs
- [ ] Test each provider
- [ ] Verify user profile creation

## 📋 Provider Configuration

### 1. 🔵 Facebook Login

**In Facebook Developers Console:**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing one
3. Add "Facebook Login" product
4. Set Valid OAuth Redirect URIs:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```

**In Supabase Dashboard:**
1. Go to Authentication > Providers
2. Enable Facebook provider
3. Add your Facebook App ID and App Secret
4. Set redirect URL: `http://localhost:3000/auth/callback` (for development)

### 2. 🐦 Twitter Login

**In Twitter Developer Portal:**
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app or use existing one
3. Generate API keys and tokens
4. Set Callback URLs:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```

**In Supabase Dashboard:**
1. Go to Authentication > Providers
2. Enable Twitter provider
3. Add your Twitter API Key and API Secret Key
4. Set redirect URL: `http://localhost:3000/auth/callback`

### 3. 🐙 GitHub Login

**In GitHub Settings:**
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```

**In Supabase Dashboard:**
1. Go to Authentication > Providers
2. Enable GitHub provider
3. Add your GitHub Client ID and Client Secret
4. Set redirect URL: `http://localhost:3000/auth/callback`

## 🔧 Additional Providers

You can easily add more providers by:

1. **Adding to the type definition:**
   ```typescript
   export type SupabaseSocialProvider = 'google' | 'facebook' | 'twitter' | 'github' | 'linkedin' | 'discord';
   ```

2. **Adding buttons to SocialLoginButtons.tsx:**
   ```jsx
   <Button onClick={() => handleSocialLogin('google')}>
       <FuseSvgIcon>feather:google</FuseSvgIcon>
   </Button>
   ```

## 🎯 How It Works

1. **User clicks social login button** → `SocialLoginButtons.tsx`
2. **Calls `signInWithSocial(provider)`** → `SupabaseAuthProvider.tsx`
3. **Redirects to OAuth provider** → Supabase handles OAuth flow
4. **User authenticates with provider** → Facebook/Twitter/GitHub
5. **Redirects back to callback** → `/auth/callback`
6. **Handles authentication result** → `AuthCallbackPage.tsx`
7. **Creates/updates user profile** → Your backend API
8. **Redirects to dashboard** → User is signed in

## 🚧 Development vs Production URLs

**Development:**
- Callback URL: `http://localhost:3000/auth/callback`
- OAuth Redirect: `https://your-project-ref.supabase.co/auth/v1/callback`

**Production:**
- Callback URL: `https://your-domain.com/auth/callback`
- OAuth Redirect: `https://your-project-ref.supabase.co/auth/v1/callback`

## ✅ Testing

1. **Start your development server**
2. **Go to sign-in page**
3. **Click social login button**
4. **Complete OAuth flow**
5. **Verify redirect to dashboard**
6. **Check user profile creation in database**

## 🔍 Troubleshooting

**Common Issues:**

1. **"Invalid redirect URI"**
   - Check OAuth app settings in provider console
   - Verify Supabase callback URL is correct

2. **"Provider not enabled"**
   - Enable provider in Supabase Dashboard
   - Check API keys are correct

3. **"User not created"**
   - Check backend user creation endpoint
   - Verify email permissions from provider

4. **"Callback loop"**
   - Check AuthCallbackPage navigation logic
   - Verify session handling

## 🎉 Benefits

- **Seamless user experience** - No password required
- **Higher conversion rates** - Easier sign-up process  
- **Trusted authentication** - Leverages existing accounts
- **Automatic profile data** - Name, email, avatar from provider
- **Secure implementation** - OAuth 2.0 standard 