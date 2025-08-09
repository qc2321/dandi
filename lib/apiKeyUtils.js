import { createClient } from '@supabase/supabase-js';

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
                error: 'API key is required',
                status: 400
            };
        }

        // Get API key data from database
        const { data, error } = await supabase
            .from("api_keys")
            .select("id, name, value, usage, limit_count")
            .eq("value", apiKey.trim())
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error("Database error:", error);
            return {
                isValid: false,
                error: 'Error validating API key',
                status: 500
            };
        }

        const isValidKey = data && data.value === apiKey.trim();

        if (!isValidKey) {
            return {
                isValid: false,
                error: 'Invalid API key',
                status: 401
            };
        }

        // Check if usage limit has been exceeded
        if (data.usage >= data.limit_count) {
            return {
                isValid: false,
                error: 'API key usage limit exceeded',
                status: 429,
                data: {
                    id: data.id,
                    name: data.name,
                    usage: data.usage,
                    limit: data.limit_count
                }
            };
        }

        return {
            isValid: true,
            data: {
                id: data.id,
                name: data.name,
                usage: data.usage,
                limit: data.limit_count
            }
        };

    } catch (error) {
        console.error("API key validation error:", error);
        return {
            isValid: false,
            error: 'Internal server error',
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
