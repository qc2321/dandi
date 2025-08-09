import { NextResponse } from 'next/server';
import { validateAndIncrementUsage } from '../../../../lib/apiKeyUtils';

export async function POST(request) {
    try {
        const { apiKey } = await request.json();

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

        return NextResponse.json({
            success: true,
            message: 'API key is valid',
            data: {
                id: result.data.id,
                name: result.data.name,
                usage: result.data.usage,
                limit: result.data.limit
            }
        });

    } catch (error) {
        console.error("Validation error:", error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error'
            },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    return NextResponse.json(
        {
            message: 'Use POST method with JSON body containing "apiKey" field'
        },
        { status: 405 }
    );
} 