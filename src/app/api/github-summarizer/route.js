import { NextResponse } from 'next/server';
import { validateAndIncrementUsage } from '@/lib/apiKeyUtils.js';
import { summarizeReadme } from './chain';
import { getReadmeContent, getRepositoryMetadata } from '@/lib/githubUtils.js';

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
                // Fetch README content and repository metadata in parallel
                const [readmeContent, repoMetadata] = await Promise.all([
                    getReadmeContent(githubUrl),
                    getRepositoryMetadata(githubUrl)
                ]);

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
                        cool_facts: summary.cool_facts,
                        repository_info: {
                            stars: repoMetadata.stars,
                            latest_version: repoMetadata.latestVersion,
                            description: repoMetadata.description,
                            language: repoMetadata.language,
                            forks: repoMetadata.forks,
                            open_issues: repoMetadata.openIssues
                        }
                    }
                });
            } catch (readmeError) {
                console.error('Error fetching repository data:', readmeError);
                return NextResponse.json({
                    success: true,
                    message: 'API key is valid but failed to fetch repository data',
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





