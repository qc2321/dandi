import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Configuration constants for better maintainability
const CONFIG = {
    DATABASE: {
        TABLE_NAME: 'api_keys',
        FIELDS: {
            ID: 'id',
            USER_ID: 'user_id',
            NAME: 'name',
            VALUE: 'value',
            USAGE: 'usage',
            LIMIT_COUNT: 'limit_count',
            CREATED_AT: 'created_at',
            UPDATED_AT: 'updated_at'
        }
    },
    DEFAULTS: {
        USAGE_LIMIT: 1000,
        HEADER_NAME: 'x-api-key',
        BODY_FIELD: 'apiKey',
        QUERY_PARAM: 'apiKey'
    },
    ERROR_MESSAGES: {
        API_KEY_REQUIRED: 'API key is required',
        INVALID_API_KEY: 'Invalid API key',
        USAGE_LIMIT_EXCEEDED: 'API key usage limit exceeded',
        INTERNAL_ERROR: 'Internal server error',
        VALIDATION_ERROR: 'Error validating API key'
    }
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Validates an API key and checks if it has exceeded its usage limit
 * @param {string} apiKey - The API key to validate
 * @returns {Promise<Object>} - Object containing validation result and key data
 */
export async function validateApiKey(apiKey) {
    try {
        if (!apiKey) {
            return {
                isValid: false,
                error: CONFIG.ERROR_MESSAGES.API_KEY_REQUIRED,
                status: 400
            };
        }

        // Get API key data from database
        const { data, error } = await supabase
            .from(CONFIG.DATABASE.TABLE_NAME)
            .select(`${CONFIG.DATABASE.FIELDS.ID}, ${CONFIG.DATABASE.FIELDS.NAME}, ${CONFIG.DATABASE.FIELDS.VALUE}, ${CONFIG.DATABASE.FIELDS.USAGE}, ${CONFIG.DATABASE.FIELDS.LIMIT_COUNT}`)
            .eq(CONFIG.DATABASE.FIELDS.VALUE, apiKey.trim())
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error("Database error:", error);
            return {
                isValid: false,
                error: CONFIG.ERROR_MESSAGES.VALIDATION_ERROR,
                status: 500
            };
        }

        const isValidKey = data && data[CONFIG.DATABASE.FIELDS.VALUE] === apiKey.trim();

        if (!isValidKey) {
            return {
                isValid: false,
                error: CONFIG.ERROR_MESSAGES.INVALID_API_KEY,
                status: 401
            };
        }

        // Check if usage limit has been exceeded
        if (data[CONFIG.DATABASE.FIELDS.USAGE] >= data[CONFIG.DATABASE.FIELDS.LIMIT_COUNT]) {
            return {
                isValid: false,
                error: CONFIG.ERROR_MESSAGES.USAGE_LIMIT_EXCEEDED,
                status: 429,
                data: {
                    id: data[CONFIG.DATABASE.FIELDS.ID],
                    name: data[CONFIG.DATABASE.FIELDS.NAME],
                    usage: data[CONFIG.DATABASE.FIELDS.USAGE],
                    limit: data[CONFIG.DATABASE.FIELDS.LIMIT_COUNT]
                }
            };
        }

        return {
            isValid: true,
            data: {
                id: data[CONFIG.DATABASE.FIELDS.ID],
                name: data[CONFIG.DATABASE.FIELDS.NAME],
                usage: data[CONFIG.DATABASE.FIELDS.USAGE],
                limit: data[CONFIG.DATABASE.FIELDS.LIMIT_COUNT]
            }
        };

    } catch (error) {
        console.error("API key validation error:", error);
        return {
            isValid: false,
            error: CONFIG.ERROR_MESSAGES.INTERNAL_ERROR,
            status: 500
        };
    }
}

/**
 * Increments the usage count for an API key
 * @param {string} apiKeyId - The ID of the API key to update
 * @returns {Promise<Object>} - Object containing success status and updated data
 */
export async function incrementApiKeyUsage(apiKeyId) {
    try {
        // First get the current usage count
        const { data: currentData, error: fetchError } = await supabase
            .from("api_keys")
            .select("usage, limit_count")
            .eq("id", apiKeyId)
            .single();

        if (fetchError) {
            console.error("Error fetching current usage:", fetchError);
            return {
                success: false,
                error: fetchError.message
            };
        }

        // Check if incrementing would exceed the limit
        if (currentData.usage >= currentData.limit_count) {
            return {
                success: false,
                error: 'API key usage limit exceeded',
                status: 429
            };
        }

        // Increment the usage count
        const { data, error } = await supabase
            .from("api_keys")
            .update({
                usage: currentData.usage + 1,
                updated_at: new Date().toISOString()
            })
            .eq("id", apiKeyId)
            .select("id, name, usage, limit_count")
            .single();

        if (error) {
            console.error("Error incrementing API key usage:", error);
            return {
                success: false,
                error: error.message
            };
        }

        return {
            success: true,
            data: {
                id: data.id,
                name: data.name,
                usage: data.usage,
                limit: data.limit_count
            }
        };

    } catch (error) {
        console.error("Error incrementing API key usage:", error);
        return {
            success: false,
            error: 'Internal server error'
        };
    }
}

/**
 * Validates API key and increments usage in a single transaction
 * @param {string} apiKey - The API key to validate and increment
 * @returns {Promise<Object>} - Object containing validation result and updated data
 */
export async function validateAndIncrementUsage(apiKey) {
    try {
        // First validate the API key
        const validation = await validateApiKey(apiKey);

        if (!validation.isValid) {
            return validation;
        }

        // If valid, increment usage
        const incrementResult = await incrementApiKeyUsage(validation.data.id);

        if (!incrementResult.success) {
            return {
                isValid: false,
                error: incrementResult.error,
                status: 500
            };
        }

        return {
            isValid: true,
            data: incrementResult.data
        };

    } catch (error) {
        console.error("Error in validateAndIncrementUsage:", error);
        return {
            isValid: false,
            error: 'Internal server error',
            status: 500
        };
    }
}

/**
 * Higher-order function that wraps API route handlers with API key validation
 * @param {Function} handler - The original API route handler
 * @param {Object} options - Configuration options
 * @returns {Function} - Wrapped handler with automatic validation
 */
export function withApiKeyValidation(handler, options = {}) {
    return async (request, context) => {
        try {
            // Extract API key from different possible sources
            const apiKey = extractApiKey(request, options);

            if (!apiKey) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'API key is required'
                    },
                    { status: 400 }
                );
            }

            // Validate API key and increment usage
            const result = await validateAndIncrementUsage(apiKey);

            if (!result.isValid) {
                return NextResponse.json(
                    {
                        success: false,
                        message: result.error
                    },
                    { status: result.status || 400 }
                );
            }

            // Add validated API key data to request context
            const enhancedRequest = {
                ...request,
                apiKeyData: result.data
            };

            // Call the original handler with enhanced request
            return await handler(enhancedRequest, context);

        } catch (error) {
            console.error("API key validation wrapper error:", error);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Internal server error'
                },
                { status: 500 }
            );
        }
    };
}

/**
 * Extract API key from request based on configuration
 * @param {Request} request - The incoming request
 * @param {Object} options - Configuration options
 * @returns {string|null} - The API key or null if not found
 */
function extractApiKey(request, options = {}) {
    const {
        headerName = 'x-api-key',
        bodyField = 'apiKey',
        queryParam = 'apiKey'
    } = options;

    // Try header first
    const headerKey = request.headers.get(headerName);
    if (headerKey) return headerKey;

    // Try query parameter
    const url = new URL(request.url);
    const queryKey = url.searchParams.get(queryParam);
    if (queryKey) return queryKey;

    // Try body (only for POST/PUT requests)
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
        // Note: This would need to be handled differently since we can't read body twice
        // In practice, you'd need to clone the request or handle this at the route level
        return null;
    }

    return null;
}
