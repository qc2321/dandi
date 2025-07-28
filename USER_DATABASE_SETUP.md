# User Database Setup for Supabase

This guide explains how to set up the users table in Supabase to store user information when they log in for the first time.

## Overview

When a user logs in for the first time using Google OAuth, the application will automatically create a user record in the Supabase `users` table. This allows you to:

- Track user registration and login activity
- Store additional user information
- Link users to their API keys and other data
- Monitor user engagement

## Database Schema

The `users` table includes the following fields:

- `id` (UUID): Primary key, auto-generated
- `email` (VARCHAR): User's email address (unique)
- `name` (VARCHAR): User's display name
- `image` (TEXT): URL to user's profile picture
- `provider` (VARCHAR): OAuth provider (e.g., "google")
- `created_at` (TIMESTAMP): When the user first registered
- `updated_at` (TIMESTAMP): When the user record was last updated
- `last_login` (TIMESTAMP): When the user last logged in

## Setup Instructions

### 1. Access Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor

### 2. Create the Users Table

Copy and paste the contents of `supabase_users_table.sql` into the SQL Editor and execute it. This will:

- Create the `users` table with proper schema
- Add indexes for performance
- Enable Row Level Security (RLS)
- Set up appropriate security policies
- Create triggers for automatic timestamp updates

### 3. Verify the Setup

After running the SQL script, you can verify the setup by:

1. Going to the "Table Editor" in your Supabase dashboard
2. Checking that the `users` table appears
3. Verifying the table structure matches the schema above

## How It Works

### First-Time Login

When a user signs in for the first time:

1. NextAuth.js processes the OAuth authentication
2. The `signIn` callback in `[...nextauth]/route.js` is triggered
3. The system checks if a user with that email already exists in Supabase
4. If no user exists, a new record is created with:
   - User's email, name, and profile image from Google
   - Provider information ("google")
   - Timestamps for creation and last login

### Subsequent Logins

When a user signs in again:

1. The system finds the existing user record
2. Updates the `last_login` timestamp
3. Updates the `updated_at` timestamp

### Error Handling

The system is designed to be resilient:

- If database operations fail, the user can still sign in
- Errors are logged to the console for debugging
- The authentication flow continues even if database operations fail

## Security Features

### Row Level Security (RLS)

The table has RLS enabled with policies that:

- Allow users to read their own data
- Allow users to update their own data
- Allow new user registration during sign-up

### Data Protection

- Email addresses are unique to prevent duplicates
- Timestamps are automatically managed
- User data is protected by Supabase's security features

## Monitoring and Analytics

You can use the `users` table to:

- Track user registration growth
- Monitor user engagement (login frequency)
- Analyze user demographics
- Link users to their API usage

### Example Queries

```sql
-- Get total user count
SELECT COUNT(*) FROM users;

-- Get users who logged in today
SELECT * FROM users WHERE last_login >= CURRENT_DATE;

-- Get users by provider
SELECT provider, COUNT(*) FROM users GROUP BY provider;

-- Get recent registrations
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;
```

## Troubleshooting

### Common Issues

1. **"Table doesn't exist" error**
   - Make sure you've run the SQL script in your Supabase project
   - Check that you're in the correct project

2. **"Permission denied" error**
   - Verify that RLS policies are set up correctly
   - Check that your Supabase credentials are correct

3. **User not being created**
   - Check the browser console for error messages
   - Verify that the Supabase environment variables are set correctly
   - Ensure the `signIn` callback is being triggered

### Debug Mode

To enable debug logging, add this to your `.env.local`:

```bash
NEXTAUTH_DEBUG=true
```

This will show detailed logs of the authentication process.

## Next Steps

After setting up the users table, you can:

1. **Link users to API keys**: Modify the `api_keys` table to include a `user_id` foreign key
2. **Add user profiles**: Create additional tables for user preferences, settings, etc.
3. **Implement user management**: Add admin interfaces for user management
4. **Add analytics**: Create dashboards to track user activity and growth

## Files Modified

- `src/app/api/auth/[...nextauth]/route.js`: Added `signIn` callback for user creation
- `supabase_users_table.sql`: SQL schema for the users table
- `USER_DATABASE_SETUP.md`: This setup guide 