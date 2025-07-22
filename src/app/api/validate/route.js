import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request) {
    try {
        const { apiKey } = await request.json();

        if (!apiKey) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'API key is required'
                },
                { status: 400 }
            );
        }

        // Validate API key against Supabase database
        const { data, error } = await supabase
            .from("api_keys")
            .select("id, name, value, usage")
            .eq("value", apiKey.trim())
            .single();

        if (error && error.code !== 'PGRST116') {
            // PGRST116 is "not found" error, which is expected for invalid keys
            console.error("Database error:", error);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Error validating API key'
                },
                { status: 500 }
            );
        }

        const isValidKey = data && data.value === apiKey.trim();

        if (isValidKey) {
            return NextResponse.json({
                success: true,
                message: 'API key is valid',
                data: {
                    id: data.id,
                    name: data.name,
                    usage: data.usage
                }
            });
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid API key'
                },
                { status: 401 }
            );
        }

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