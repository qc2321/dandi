import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { supabase } from '@/lib/supabaseClient.js';
import { getUserEmailFromToken } from '@/lib/auth.js';

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

// PUT - Update an existing API key for the authenticated user
export async function PUT(request, { params }) {
    try {
        const userId = await getUserIdFromRequest(request);
        const { id } = params;
        const body = await request.json();
        const { name, value, limit } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Name is required' },
                { status: 400 }
            );
        }

        // First verify the API key belongs to the user
        const { data: existingKey, error: fetchError } = await supabase
            .from("api_keys")
            .select("id")
            .eq("id", id)
            .eq("user_id", userId)
            .single();

        if (fetchError || !existingKey) {
            return NextResponse.json(
                { error: 'API key not found or access denied' },
                { status: 404 }
            );
        }

        // Update the API key
        const updateData = {
            name: name,
            updated_at: new Date().toISOString()
        };

        // Only update value and limit if provided
        if (value !== undefined) {
            updateData.value = value;
        }
        if (limit !== undefined) {
            updateData.limit_count = limit;
        }

        const { data, error } = await supabase
            .from("api_keys")
            .update(updateData)
            .eq("id", id)
            .eq("user_id", userId)
            .select()
            .single();

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ apiKey: data });
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

// DELETE - Delete an API key for the authenticated user
export async function DELETE(request, { params }) {
    try {
        const userId = await getUserIdFromRequest(request);
        const { id } = params;

        // First verify the API key belongs to the user
        const { data: existingKey, error: fetchError } = await supabase
            .from("api_keys")
            .select("id")
            .eq("id", id)
            .eq("user_id", userId)
            .single();

        if (fetchError || !existingKey) {
            return NextResponse.json(
                { error: 'API key not found or access denied' },
                { status: 404 }
            );
        }

        // Delete the API key
        const { error } = await supabase
            .from("api_keys")
            .delete()
            .eq("id", id)
            .eq("user_id", userId);

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ message: 'API key deleted successfully' });
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