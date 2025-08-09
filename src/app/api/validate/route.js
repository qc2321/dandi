import { NextResponse } from 'next/server';
import { withApiKeyValidation } from '@/lib/apiKeyUtils.js';

// Original handler function - now focused only on business logic
async function validateHandler(request) {
    // The API key validation is now handled by the HOF
    // We can access the validated API key data from request.apiKeyData
    const { apiKeyData } = request;

    return NextResponse.json({
        success: true,
        message: 'API key is valid',
        data: {
            id: apiKeyData.id,
            name: apiKeyData.name,
            usage: apiKeyData.usage,
            limit: apiKeyData.limit
        }
    });
}

// Export the wrapped handler with automatic API key validation
export const POST = withApiKeyValidation(validateHandler, {
    bodyField: 'apiKey' // Extract API key from request body
});

export async function GET(request) {
    return NextResponse.json(
        {
            message: 'Use POST method with JSON body containing "apiKey" field'
        },
        { status: 405 }
    );
} 