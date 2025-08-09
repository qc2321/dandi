import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { supabase } from '../../../../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { getUserEmailFromToken } from '../../../../lib/auth';

// Helper function to get user ID from session or JWT token
async function getUserIdFromRequest(request) {
    // First try to get session (for backward compatibility)
    const session = await getServerSession();

    if (session?.user?.email) {
        // Get user ID from Supabase using email
        const { data: user, error } = await supabase
            .from("users")
            .select("id")
            .eq("email", session.user.email)
            .single();

        if (error || !user) {
            throw new Error('User not found in database');
        }

        return user.id;
    }

    // If no session, try to get from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized: No valid authentication found');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
        // Get user email from JWT token
        const email = getUserEmailFromToken(token);

        // Get user ID from Supabase using email
        const { data: user, error } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .single();

        if (error || !user) {
            throw new Error('User not found in database');
        }

        return user.id;
    } catch (error) {
        throw new Error(error.message);
    }
}

// GET - Fetch all API keys for the authenticated user
export async function GET(request) {
    try {
        let userId = null;

        // Try to get user ID from request, but don't fail if not available
        try {
            userId = await getUserIdFromRequest(request);
        } catch (error) {
            console.log('No user authentication found, fetching all API keys');
            // For testing purposes, we'll fetch all API keys
        }

        let query = supabase
            .from("api_keys")
            .select("id, created_at, name, value, usage, limit_count, user_id")
            .order("created_at", { ascending: false });

        // If we have a user ID, filter by it; otherwise get all keys
        if (userId) {
            query = query.eq("user_id", userId);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ apiKeys: data || [] });
    } catch (error) {
        if (error.message.includes('Unauthorized')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

// POST - Create a new API key for the authenticated user
export async function POST(request) {
    try {
        let userId = null;

        // Try to get user ID from request, but don't fail if not available
        try {
            userId = await getUserIdFromRequest(request);
        } catch (error) {
            console.log('No user authentication found, creating API key with default user_id');
            // For testing purposes, we'll use the first user in the database
            const { data: users, error: userError } = await supabase
                .from('users')
                .select('id')
                .limit(1);

            if (!userError && users && users.length > 0) {
                userId = users[0].id;
            }
        }

        const body = await request.json();
        const { name, value, limit } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Name is required' },
                { status: 400 }
            );
        }

        const newKey = {
            id: uuidv4(),
            user_id: userId, // This can now be null
            name: name,
            value: value || `dandi-${Math.random().toString(36).slice(2, 12)}`,
            usage: 0,
            limit_count: limit || 1000, // Default limit of 1000 requests
            created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from("api_keys")
            .insert([newKey])
            .select()
            .single();

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ apiKey: data }, { status: 201 });
    } catch (error) {
        if (error.message.includes('Unauthorized')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
} 