# API Keys Migration Guide

## Overview
The API keys functionality has been migrated from client-side Supabase calls to a secure REST API that requires authentication. This ensures that:

1. **Security**: All operations require authentication via NextAuth
2. **User Isolation**: Each user can only access their own API keys
3. **Server-side Validation**: All operations are validated on the server
4. **Better Error Handling**: Consistent error responses across all operations

## Database Changes

### Required Database Updates
Run the SQL script `api_keys_table_update.sql` in your Supabase SQL editor to:

1. Add `user_id` column to the `api_keys` table
2. Create foreign key constraint to the `users` table
3. Add necessary indexes for performance
4. Add `updated_at` column with automatic updates

### Database Schema
The `api_keys` table now includes:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to users.id)
- `name` (VARCHAR)
- `value` (VARCHAR)
- `usage` (INTEGER)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## API Endpoints

### Base URL: `/api/api-keys`

#### GET `/api/api-keys`
- **Purpose**: Fetch all API keys for the authenticated user
- **Authentication**: Required (NextAuth session)
- **Response**: `{ apiKeys: [...] }`

#### POST `/api/api-keys`
- **Purpose**: Create a new API key
- **Authentication**: Required (NextAuth session)
- **Body**: `{ name: string, value?: string }`
- **Response**: `{ apiKey: {...} }`

#### PUT `/api/api-keys/[id]`
- **Purpose**: Update an existing API key
- **Authentication**: Required (NextAuth session)
- **Body**: `{ name: string, value?: string }`
- **Response**: `{ apiKey: {...} }`

#### DELETE `/api/api-keys/[id]`
- **Purpose**: Delete an API key
- **Authentication**: Required (NextAuth session)
- **Response**: `{ message: string }`

## Security Features

### Authentication
- All endpoints require a valid NextAuth session
- User ID is extracted from the session email and looked up in the database

### Authorization
- Users can only access their own API keys
- Each operation verifies ownership before proceeding
- 401 Unauthorized for invalid sessions
- 404 Not Found for non-existent or unauthorized access

### Data Validation
- Required fields are validated on the server
- Proper error messages for validation failures
- Consistent error response format

## Client-Side Changes

### Updated Hook
The `useApiKeys` hook has been updated to:
- Use fetch API instead of direct Supabase calls
- Handle HTTP status codes properly
- Maintain the same interface for backward compatibility

### Error Handling
- Network errors are properly caught and displayed
- Server error messages are preserved and shown to users
- Loading states are maintained during operations

## Migration Steps

1. **Database Setup**:
   ```sql
   -- Run the api_keys_table_update.sql script in Supabase
   ```

2. **Deploy API Routes**:
   - Deploy the new API routes to your Next.js application
   - Ensure NextAuth is properly configured

3. **Update Client Code**:
   - The `useApiKeys` hook will automatically use the new API
   - No changes needed in components using the hook

4. **Test**:
   - Verify authentication works correctly
   - Test all CRUD operations
   - Ensure user isolation works as expected

## Error Codes

- `401 Unauthorized`: Invalid or missing authentication
- `400 Bad Request`: Invalid request data (missing required fields)
- `404 Not Found`: API key not found or access denied
- `500 Internal Server Error`: Server-side error

## Backward Compatibility

The `useApiKeys` hook maintains the same interface, so existing components will continue to work without modification. The only change is that operations now go through the secure REST API instead of direct database calls. 