import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { summarizeReadme } from './chain';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request) {
    try {
        const { githubUrl } = await request.json();

        const apiKey = request.headers.get('x-api-key');
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
            // If GitHub URL is provided, fetch and summarize README content
            if (githubUrl) {
                try {
                    const readmeContent = await getReadmeContent(githubUrl);

                    // Summarize the README content using LangChain
                    const summary = await summarizeReadme(readmeContent);
                    console.log('Summary:', summary);

                    return NextResponse.json({
                        success: true,
                        message: 'API key is valid and repository summarized',
                        data: {
                            id: data.id,
                            name: data.name,
                            usage: data.usage,
                            summary: summary.summary,
                            cool_facts: summary.cool_facts
                        }
                    });
                } catch (readmeError) {
                    console.error('Error fetching README:', readmeError);
                    return NextResponse.json({
                        success: true,
                        message: 'API key is valid but failed to fetch README content',
                        data: {
                            id: data.id,
                            name: data.name,
                            usage: data.usage,
                            error: readmeError.message
                        }
                    });
                }
            } else {
                return NextResponse.json({
                    success: true,
                    message: 'API key is valid',
                    data: {
                        id: data.id,
                        name: data.name,
                        usage: data.usage
                    }
                });
            }
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
            message: 'Use POST method with JSON body containing "githubUrl" field and "x-api-key" header',
            example: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'your-api-key-here'
                },
                body: {
                    githubUrl: 'https://github.com/owner/repo'
                }
            }
        },
        { status: 405 }
    );
}

async function getReadmeContent(githubUrl) {
    try {
        // Parse GitHub URL to get owner and repo
        const urlParts = githubUrl.replace('https://github.com/', '').split('/');
        const owner = urlParts[0];
        const repo = urlParts[1];

        // Construct API URL for README
        const readmeUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;

        // Fetch README content
        const response = await fetch(readmeUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3.raw',
                'User-Agent': 'Dandi-App'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}`);
        }

        const readmeContent = await response.text();
        return readmeContent;

    } catch (error) {
        console.error('Error fetching README:', error);
        throw new Error('Failed to fetch repository README');
    }
}



