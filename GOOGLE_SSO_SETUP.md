# Google SSO Setup Guide

This guide will walk you through setting up Google Single Sign-On (SSO) for your Next.js application.

## Prerequisites

- A Google Cloud Console account
- A Supabase project
- Node.js and npm installed

## Step 1: Google Cloud Console Setup

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API

### 1.2 Create OAuth 2.0 Credentials
1. Navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Add the following authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
5. Copy the Client ID and Client Secret

## Step 2: Supabase Setup

### 2.1 Get Supabase Credentials
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the following values:
   - Project URL
   - Anon (public) key
   - Service role key (for the adapter)

### 2.2 Configure Supabase Database
The NextAuth adapter will automatically create the necessary tables in your Supabase database.

## Step 3: Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
```

### Generate NEXTAUTH_SECRET
You can generate a secure secret using:
```bash
openssl rand -base64 32
```

## Step 4: Install Dependencies

The required dependencies have already been installed:
- `next-auth`
- `@auth/supabase-adapter`

## Step 5: Test the Implementation

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`

3. Click the "Sign in with Google" button

4. Complete the Google OAuth flow

5. You should be redirected back to your application and see your user information

## Step 6: Production Deployment

### 6.1 Update Environment Variables
For production, update your environment variables:
- Change `NEXTAUTH_URL` to your production domain
- Update Google OAuth redirect URIs in Google Cloud Console
- Use production Supabase credentials

### 6.2 Deploy
Deploy your application to your preferred hosting platform (Vercel, Netlify, etc.)

## Features Implemented

- ✅ Google OAuth authentication
- ✅ Session management with NextAuth
- ✅ Supabase integration for user storage
- ✅ Protected routes
- ✅ Login/logout functionality
- ✅ User profile display
- ✅ Loading states

## File Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.js  # NextAuth API route
│   ├── layout.js                         # Root layout with SessionProvider
│   └── page.js                          # Home page with login button
├── components/
│   ├── LoginButton.js                   # Login/logout component
│   ├── ProtectedRoute.js                # Route protection component
│   └── SessionProvider.js               # NextAuth session provider
```

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Ensure the redirect URI in Google Cloud Console matches exactly
   - Check that `NEXTAUTH_URL` is set correctly

2. **"Invalid client" error**
   - Verify your Google Client ID and Secret are correct
   - Ensure the Google+ API is enabled

3. **Database connection issues**
   - Check your Supabase credentials
   - Ensure your Supabase project is active

4. **Session not persisting**
   - Verify `NEXTAUTH_SECRET` is set
   - Check that cookies are enabled in your browser

### Debug Mode

To enable debug mode, add this to your `.env.local`:
```env
NEXTAUTH_DEBUG=true
```

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **HTTPS**: Always use HTTPS in production
3. **Secrets**: Use strong, unique secrets for `NEXTAUTH_SECRET`
4. **CORS**: Configure CORS properly for your domain
5. **Rate Limiting**: Consider implementing rate limiting for auth endpoints

## Next Steps

- Add additional OAuth providers (GitHub, Discord, etc.)
- Implement role-based access control
- Add user profile management
- Set up email verification
- Implement password reset functionality 