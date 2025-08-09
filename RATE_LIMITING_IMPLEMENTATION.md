# API Rate Limiting Implementation

## Overview

This implementation adds rate limiting functionality to API keys, allowing you to set usage limits and automatically reject requests when limits are exceeded.

## Features

### 1. Usage Limit Field
- **Field Name**: `limit_count`
- **Type**: INTEGER
- **Default Value**: 1000
- **Purpose**: Maximum number of API calls allowed for the key

### 2. Automatic Usage Tracking
- **Field Name**: `usage`
- **Type**: INTEGER
- **Default Value**: 0
- **Purpose**: Current usage count, automatically incremented on each API call

### 3. Rate Limiting Logic
- API calls are validated against the usage limit
- If `usage >= limit_count`, returns HTTP 429 (Too Many Requests)
- Usage count is incremented on each successful API call
- Limits are enforced at the individual API key level

## Database Schema

### Updated api_keys Table
```sql
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    usage INTEGER DEFAULT 0,
    limit_count INTEGER DEFAULT 1000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints

### 1. API Key Validation (`/api/validate`)
- **Method**: POST
- **Headers**: None required
- **Body**: `{ "apiKey": "your-api-key" }`
- **Response**: 
  - Success: `{ "success": true, "data": { "usage": 5, "limit": 1000 } }`
  - Rate Limited: `{ "success": false, "message": "API key usage limit exceeded", "status": 429 }`

### 2. GitHub Summarizer (`/api/github-summarizer`)
- **Method**: POST
- **Headers**: `x-api-key: your-api-key`
- **Body**: `{ "githubUrl": "https://github.com/owner/repo" }`
- **Response**: 
  - Success: `{ "success": true, "data": { "usage": 5, "limit": 1000, "summary": "..." } }`
  - Rate Limited: `{ "success": false, "message": "API key usage limit exceeded", "status": 429 }`

### 3. API Key Management (`/api/api-keys`)
- **Method**: POST (Create)
- **Body**: `{ "name": "My Key", "value": "key-value", "limit": 500 }`
- **Method**: PUT (Update)
- **Body**: `{ "name": "Updated Key", "limit": 2000 }`

## Frontend Components

### 1. ApiKeyRow Component
- Displays usage as "current / limit" format
- Example: "5 / 1000"

### 2. ApiKeyModal Component
- Includes usage limit input field
- Default value: 1000
- Optional field (can be left blank)

### 3. useApiKeys Hook
- Handles limit field in create/update operations
- Maintains backward compatibility

## Utility Functions

### 1. validateApiKey(apiKey)
- Validates API key existence and format
- Checks if usage limit has been exceeded
- Returns validation result with status codes

### 2. incrementApiKeyUsage(apiKeyId)
- Safely increments usage count
- Prevents race conditions
- Returns updated usage data

### 3. validateAndIncrementUsage(apiKey)
- Combines validation and increment in one operation
- Ensures atomicity
- Returns final usage data

## Error Responses

### HTTP 429 - Too Many Requests
```json
{
    "success": false,
    "message": "API key usage limit exceeded",
    "status": 429
}
```

### HTTP 401 - Unauthorized
```json
{
    "success": false,
    "message": "Invalid API key",
    "status": 401
}
```

### HTTP 400 - Bad Request
```json
{
    "success": false,
    "message": "API key is required",
    "status": 400
}
```

## Migration Guide

### For Existing Tables
1. Run the migration script:
```sql
-- Add the limit_count column with default value
ALTER TABLE api_keys 
ADD COLUMN IF NOT EXISTS limit_count INTEGER DEFAULT 1000;

-- Update existing records
UPDATE api_keys 
SET limit_count = 1000 
WHERE limit_count IS NULL;
```

### For New Tables
1. Use the complete `create_api_keys_table.sql` script
2. All new API keys will have the limit field by default

## Testing

### 1. Create API Key with Limit
```bash
curl -X POST /api/api-keys \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Key", "limit": 5}'
```

### 2. Test Rate Limiting
```bash
# Make 6 requests to exceed the limit
for i in {1..6}; do
  curl -X POST /api/validate \
    -H "Content-Type: application/json" \
    -d '{"apiKey": "your-test-key"}'
done
```

### 3. Expected Results
- Requests 1-5: Success (200 OK)
- Request 6: Rate Limited (429 Too Many Requests)

## Security Considerations

1. **Usage Tracking**: All API calls increment the usage counter
2. **Limit Enforcement**: Strict enforcement at the database level
3. **User Isolation**: Each user can only access their own API keys
4. **Rate Limiting**: Prevents abuse and ensures fair usage

## Monitoring

### Usage Metrics
- Track usage patterns per API key
- Monitor rate limit hits
- Analyze usage trends

### Alerts
- Set up alerts for high usage
- Monitor for unusual patterns
- Track rate limit violations

## Future Enhancements

1. **Time-based Limits**: Daily/monthly usage limits
2. **Tiered Limits**: Different limits based on user plans
3. **Usage Analytics**: Detailed usage reporting
4. **Auto-scaling**: Dynamic limit adjustments
5. **Rate Limit Headers**: Include remaining quota in responses
