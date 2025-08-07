# JWT Authentication Implementation for API Keys CRUD

## Overview
This implementation provides secure JWT-based authentication for the API keys CRUD operations. The system uses NextAuth for session management and generates custom JWT tokens for API authentication.

## Architecture

### 1. Authentication Flow
1. **User Login**: User signs in via NextAuth with Google OAuth
2. **Token Generation**: NextAuth generates a custom JWT token containing user information
3. **Client Requests**: Frontend includes JWT token in Authorization header
4. **Server Verification**: API routes verify JWT token and extract user information
5. **Database Operations**: User-specific operations performed with proper authorization

### 2. Components

#### Frontend (`useApiKeys` Hook)
- **Location**: `src/hooks/useApiKeys.js`
- **Purpose**: Client-side hook for API key management
- **Features**:
  - Automatic JWT token inclusion in requests
  - Session-based authentication checks
  - Error handling for authentication failures
  - Automatic data refresh after operations

#### Backend API Routes
- **Main Route**: `src/app/api/api-keys/route.js`
- **Dynamic Route**: `src/app/api/api-keys/[id]/route.js`
- **Features**:
  - JWT token verification
  - User-specific data access
  - Proper error handling
  - Backward compatibility with session-based auth

#### Authentication Utilities
- **Location**: `src/lib/auth.js`
- **Functions**:
  - `generateApiToken(user)`: Creates JWT tokens
  - `verifyApiToken(token)`: Verifies and decodes tokens
  - `getUserEmailFromToken(token)`: Extracts user email

#### NextAuth Configuration
- **Location**: `src/app/api/auth/[...nextauth]/route.js`
- **Features**:
  - Custom JWT token generation
  - Session management
  - User database synchronization

## Implementation Details

### JWT Token Structure
```javascript
{
  email: "user@example.com",
  name: "User Name",
  sub: "user-id",
  iat: 1234567890,  // Issued at
  exp: 1234654290   // Expires at (24 hours)
}
```

### API Request Headers
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <jwt-token>'
}
```

### Authentication Flow
1. **Token Generation**: When user signs in, NextAuth generates a JWT token
2. **Token Storage**: Token is stored in the session and accessible via `session.apiToken`
3. **Request Authentication**: Frontend includes token in Authorization header
4. **Token Verification**: Backend verifies token and extracts user email
5. **User Lookup**: User ID is retrieved from database using email
6. **Authorization**: Operations are performed with user-specific scope

## Security Features

### 1. Token Security
- **Expiration**: Tokens expire after 24 hours
- **Secret**: Uses NextAuth secret for signing
- **Verification**: Proper JWT verification with error handling

### 2. User Isolation
- **User-Specific Data**: All operations are scoped to authenticated user
- **Authorization Checks**: API keys can only be accessed by their owner
- **Database Constraints**: Foreign key relationships ensure data integrity

### 3. Error Handling
- **Authentication Errors**: Proper 401 responses for invalid tokens
- **Authorization Errors**: 404 responses for unauthorized access
- **Validation Errors**: 400 responses for invalid data

## API Endpoints

### GET `/api/api-keys`
- **Purpose**: Fetch all API keys for authenticated user
- **Authentication**: Required (JWT token)
- **Response**: `{ apiKeys: [...] }`

### POST `/api/api-keys`
- **Purpose**: Create new API key
- **Authentication**: Required (JWT token)
- **Body**: `{ name: string, value?: string }`
- **Response**: `{ apiKey: {...} }`

### PUT `/api/api-keys/[id]`
- **Purpose**: Update existing API key
- **Authentication**: Required (JWT token)
- **Body**: `{ name: string, value?: string }`
- **Response**: `{ apiKey: {...} }`

### DELETE `/api/api-keys/[id]`
- **Purpose**: Delete API key
- **Authentication**: Required (JWT token)
- **Response**: `{ message: string }`

## Usage Examples

### Frontend Usage
```javascript
import { useApiKeys } from '../hooks/useApiKeys';

function MyComponent() {
  const { apiKeys, loading, createApiKey, updateApiKey, deleteApiKey } = useApiKeys();
  
  // All operations automatically include JWT authentication
  const handleCreate = async () => {
    const success = await createApiKey({ name: 'My Key', value: 'key-value' });
    if (success) {
      console.log('API key created successfully');
    }
  };
}
```

### Backend Verification
```javascript
// In API route
const userId = await getUserIdFromRequest(request);
// userId is guaranteed to be the authenticated user's ID
```

## Error Codes

- **401 Unauthorized**: Invalid or missing JWT token
- **400 Bad Request**: Invalid request data
- **404 Not Found**: API key not found or access denied
- **500 Internal Server Error**: Server-side error

## Database Schema

### Required Updates
Run the `api_keys_table_update.sql` script to:
1. Add `user_id` column to `api_keys` table
2. Create foreign key constraint to `users` table
3. Add necessary indexes
4. Add `updated_at` column with triggers

### Schema
```sql
CREATE TABLE api_keys (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    value VARCHAR NOT NULL,
    usage INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## Dependencies

### Required Packages
- `jsonwebtoken`: JWT token generation and verification
- `next-auth`: Authentication framework
- `@supabase/supabase-js`: Database client
- `uuid`: UUID generation

### Installation
```bash
npm install jsonwebtoken --legacy-peer-deps
```

## Environment Variables

### Required
- `NEXTAUTH_SECRET`: Secret for JWT signing
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

## Testing

### Manual Testing
1. Sign in with Google OAuth
2. Navigate to API keys management page
3. Test all CRUD operations
4. Verify user isolation (try accessing other users' keys)

### API Testing
```bash
# Get API keys
curl -H "Authorization: Bearer <jwt-token>" \
     http://localhost:3000/api/api-keys

# Create API key
curl -X POST -H "Authorization: Bearer <jwt-token>" \
     -H "Content-Type: application/json" \
     -d '{"name":"Test Key"}' \
     http://localhost:3000/api/api-keys
```

## Security Considerations

### Production Recommendations
1. **HTTPS Only**: Ensure all communications use HTTPS
2. **Token Expiration**: Consider shorter token expiration times
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **Audit Logging**: Log all API key operations
5. **Token Rotation**: Implement token rotation mechanisms

### Monitoring
- Monitor for failed authentication attempts
- Track API key usage patterns
- Alert on suspicious activity

## Troubleshooting

### Common Issues
1. **Token Expired**: Refresh the page to get a new token
2. **Invalid Token**: Clear browser storage and re-authenticate
3. **Database Errors**: Check Supabase connection and schema
4. **CORS Issues**: Ensure proper CORS configuration

### Debug Mode
Enable debug logging in NextAuth configuration:
```javascript
debug: process.env.NODE_ENV === 'development',
``` 