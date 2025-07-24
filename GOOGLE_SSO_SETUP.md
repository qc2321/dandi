# Google SSO Setup Guide

This guide will walk you through setting up Google OAuth Single Sign-On (SSO) for your Next.js application.

## Prerequisites

- A Google account
- A Next.js application (already set up)
- NextAuth.js installed (already done)

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project or select an existing one

### 1.2 Enable Google+ API

1. In the left sidebar, click on "APIs & Services" > "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click on "Google Identity" and enable it

### 1.3 Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in the required information:
     - App name: Your app name
     - User support email: Your email
     - Developer contact information: Your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users if needed

### 1.4 Configure OAuth 2.0 Client

1. Application type: "Web application"
2. Name: "Your App Name - Web Client"
3. Authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
4. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
5. Click "Create"

### 1.5 Copy Credentials

After creation, you'll get:
- **Client ID**: A long string ending with `.apps.googleusercontent.com`
- **Client Secret**: A secret string

## Step 2: Configure Environment Variables

### 2.1 Update .env.local

Edit your `.env.local` file and replace the placeholder values:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-actual-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret

# Supabase Configuration (if using)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 2.2 Generate NEXTAUTH_SECRET

Generate a secure secret for NextAuth:

```bash
# Option 1: Using openssl
openssl rand -base64 32

# Option 2: Using node
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 3: Test the Implementation

### 3.1 Start the Development Server

```bash
npm run dev
```

### 3.2 Test the Flow

1. Visit `http://localhost:3000`
2. Click the "Sign in with Google" button
3. You should be redirected to Google's OAuth consent screen
4. After authorization, you'll be redirected back to your app
5. You should see your Google profile information

## Step 4: Production Deployment

### 4.1 Update Google OAuth Settings

1. Go back to Google Cloud Console
2. Add your production domain to authorized origins and redirect URIs
3. Remove `localhost` URLs if not needed for production

### 4.2 Environment Variables for Production

Set these environment variables in your production environment:

```bash
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Step 5: Customization Options

### 5.1 Custom Sign-in Page

The app includes a custom sign-in page at `/auth/signin`. You can customize it by editing:
- `src/app/auth/signin/page.js`

### 5.2 Protected Routes

To protect any route, wrap it with the `ProtectedRoute` component:

```jsx
import ProtectedRoute from "../components/ProtectedRoute";

export default function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

### 5.3 Session Management

Access session data in any component:

```jsx
import { useSession } from "next-auth/react";

export default function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Not signed in</div>;
  
  return <div>Signed in as {session.user.email}</div>;
}
```

## Step 6: Troubleshooting

### Common Issues

1. **"Invalid redirect_uri" error**
   - Check that your redirect URI in Google Console matches exactly
   - Ensure the protocol (http/https) is correct

2. **"Client ID not found" error**
   - Verify your `GOOGLE_CLIENT_ID` environment variable
   - Check that the client ID is copied correctly

3. **"Invalid client secret" error**
   - Verify your `GOOGLE_CLIENT_SECRET` environment variable
   - Regenerate the client secret if needed

4. **Session not persisting**
   - Check your `NEXTAUTH_SECRET` is set
   - Ensure `NEXTAUTH_URL` matches your domain

### Debug Mode

Enable debug mode by adding to your `.env.local`:

```bash
NEXTAUTH_DEBUG=true
```

## Step 7: Security Best Practices

1. **Never commit secrets to version control**
   - Keep `.env.local` in your `.gitignore`
   - Use environment variables in production

2. **Use HTTPS in production**
   - Google OAuth requires HTTPS for production
   - Set up SSL certificates

3. **Regularly rotate secrets**
   - Update `NEXTAUTH_SECRET` periodically
   - Rotate Google client secrets

4. **Monitor OAuth usage**
   - Check Google Cloud Console for usage metrics
   - Monitor for suspicious activity

## Files Created/Modified

- `src/app/api/auth/[...nextauth]/route.js` - NextAuth configuration
- `src/components/SessionProvider.js` - Session provider wrapper
- `src/components/LoginButton.js` - Login/logout button component
- `src/components/ProtectedRoute.js` - Route protection component
- `src/app/auth/signin/page.js` - Custom sign-in page
- `src/app/dashboard/page.js` - Protected dashboard example
- `src/app/layout.js` - Updated to include SessionProvider
- `src/app/page.js` - Updated to include login button
- `.env.local` - Environment variables template

## Next Steps

1. Test the authentication flow thoroughly
2. Customize the UI to match your brand
3. Add additional OAuth providers if needed
4. Implement user profile management
5. Add role-based access control
6. Set up user data persistence in your database 