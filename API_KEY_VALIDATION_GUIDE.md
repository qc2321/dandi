# API Key Validation System Guide

## Overview

This guide explains how to use the improved API key validation system that provides better reusability and maintainability.

## Architecture

### 1. Configuration-Driven Design
All database field names, error messages, and defaults are centralized in the `CONFIG` object in `lib/apiKeyUtils.js`.

### 2. Higher-Order Function Pattern
The `withApiKeyValidation` HOF automatically handles:
- API key extraction from headers, body, or query parameters
- Validation and rate limiting
- Error responses with appropriate HTTP status codes
- Usage tracking

## Usage Examples

### Basic Usage with Header Authentication

```javascript
// src/app/api/my-endpoint/route.js
import { withApiKeyValidation } from '../../../../lib/apiKeyUtils';

async function myHandler(request) {
    // Access validated API key data
    const { apiKeyData } = request;
    
    // Your business logic here
    return NextResponse.json({
        success: true,
        data: { message: 'Hello from protected endpoint' }
    });
}

// Automatically validates x-api-key header
export const POST = withApiKeyValidation(myHandler);
```

### Custom API Key Location

```javascript
// Extract API key from request body
export const POST = withApiKeyValidation(myHandler, {
    bodyField: 'apiKey'
});

// Extract API key from query parameter
export const GET = withApiKeyValidation(myHandler, {
    queryParam: 'key'
});

// Custom header name
export const POST = withApiKeyValidation(myHandler, {
    headerName: 'authorization'
});
```

### Multiple Authentication Methods

```javascript
// Try header first, then body, then query
export const POST = withApiKeyValidation(myHandler, {
    headerName: 'x-api-key',
    bodyField: 'apiKey',
    queryParam: 'key'
});
```

## Response Format

### Success Response
```json
{
    "success": true,
    "data": {
        "id": "uuid",
        "name": "API Key Name",
        "usage": 5,
        "limit": 1000
    }
}
```

### Error Responses

#### 400 - Bad Request
```json
{
    "success": false,
    "message": "API key is required"
}
```

#### 401 - Unauthorized
```json
{
    "success": false,
    "message": "Invalid API key"
}
```

#### 429 - Too Many Requests
```json
{
    "success": false,
    "message": "API key usage limit exceeded"
}
```

#### 500 - Internal Server Error
```json
{
    "success": false,
    "message": "Internal server error"
}
```

## Configuration

### Modifying Defaults
Edit the `CONFIG` object in `lib/apiKeyUtils.js`:

```javascript
const CONFIG = {
    DATABASE: {
        TABLE_NAME: 'api_keys',
        FIELDS: {
            // ... field mappings
        }
    },
    DEFAULTS: {
        USAGE_LIMIT: 1000,
        HEADER_NAME: 'x-api-key',
        // ... other defaults
    },
    ERROR_MESSAGES: {
        // ... custom error messages
    }
};
```

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

## Migration from Old Pattern

### Before (Manual Validation)
```javascript
export async function POST(request) {
    try {
        const { apiKey } = await request.json();
        const result = await validateAndIncrementUsage(apiKey);
        
        if (!result.isValid) {
            return NextResponse.json(
                { success: false, message: result.error },
                { status: result.status || 400 }
            );
        }
        
        // Business logic here
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
```

### After (HOF Pattern)
```javascript
async function myHandler(request) {
    const { apiKeyData } = request;
    // Business logic here
    return NextResponse.json({ success: true });
}

export const POST = withApiKeyValidation(myHandler, {
    bodyField: 'apiKey'
});
```

## Benefits

1. **Reduced Code Duplication**: No need to repeat validation logic
2. **Consistent Error Handling**: Standardized error responses
3. **Easy Testing**: Business logic separated from validation
4. **Flexible Configuration**: Easy to modify behavior
5. **Better Maintainability**: Centralized validation logic
6. **Type Safety**: Clear interface for API key data

## Testing

### Unit Testing
```javascript
// Test the handler function directly
const mockRequest = {
    apiKeyData: {
        id: 'test-id',
        name: 'Test Key',
        usage: 5,
        limit: 1000
    }
};

const response = await myHandler(mockRequest);
expect(response.status).toBe(200);
```

### Integration Testing
```javascript
// Test the full HOF
const response = await fetch('/api/my-endpoint', {
    method: 'POST',
    headers: {
        'x-api-key': 'valid-api-key',
        'Content-Type': 'application/json'
    }
});

expect(response.status).toBe(200);
```
