import { NextResponse } from 'next/server';
import { validateAndIncrementUsage } from '../../../../lib/apiKeyUtils';
import { summarizeReadme } from './chain';

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
                        id: result.data.id,
                        name: result.data.name,
                        usage: result.data.usage,
                        limit: result.data.limit,
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
                        id: result.data.id,
                        name: result.data.name,
                        usage: result.data.usage,
                        limit: result.data.limit,
                        error: readmeError.message
                    }
                });
            }
        } else {
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



