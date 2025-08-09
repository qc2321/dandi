/**
 * GitHub utility functions for fetching repository data
 */

/**
 * Fetches README content from a GitHub repository
 * @param {string} githubUrl - The GitHub repository URL
 * @returns {Promise<string>} The README content as text
 */
export async function getReadmeContent(githubUrl) {
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

/**
 * Fetches repository metadata including stars, latest version, and other info
 * @param {string} githubUrl - The GitHub repository URL
 * @returns {Promise<Object>} Repository metadata object
 */
export async function getRepositoryMetadata(githubUrl) {
    try {
        // Parse GitHub URL to get owner and repo
        const urlParts = githubUrl.replace('https://github.com/', '').split('/');
        const owner = urlParts[0];
        const repo = urlParts[1];

        // Construct API URL for repository metadata
        const repoUrl = `https://api.github.com/repos/${owner}/${repo}`;
        const releasesUrl = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;

        // Fetch repository metadata and latest release in parallel
        const [repoResponse, releaseResponse] = await Promise.all([
            fetch(repoUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Dandi-App'
                }
            }),
            fetch(releasesUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Dandi-App'
                }
            })
        ]);

        if (!repoResponse.ok) {
            throw new Error(`GitHub API returned ${repoResponse.status} for repository metadata`);
        }

        const repoData = await repoResponse.json();

        let latestVersion = null;
        if (releaseResponse.ok) {
            const releaseData = await releaseResponse.json();
            latestVersion = releaseData.tag_name;
        }

        return {
            stars: repoData.stargazers_count,
            latestVersion: latestVersion,
            description: repoData.description,
            language: repoData.language,
            forks: repoData.forks_count,
            openIssues: repoData.open_issues_count
        };

    } catch (error) {
        console.error('Error fetching repository metadata:', error);
        throw new Error('Failed to fetch repository metadata');
    }
}

/**
 * Fetches all GitHub repository data in parallel (README + metadata)
 * This is the most optimized version that fetches everything at once
 * @param {string} githubUrl - The GitHub repository URL
 * @returns {Promise<Object>} Object containing readme content and repository metadata
 */
export async function getAllRepositoryData(githubUrl) {
    try {
        // Parse GitHub URL to get owner and repo
        const urlParts = githubUrl.replace('https://github.com/', '').split('/');
        const owner = urlParts[0];
        const repo = urlParts[1];

        // Construct all API URLs
        const readmeUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
        const repoUrl = `https://api.github.com/repos/${owner}/${repo}`;
        const releasesUrl = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;

        // Fetch all data in parallel - this is the key optimization
        const [readmeResponse, repoResponse, releaseResponse] = await Promise.all([
            fetch(readmeUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3.raw',
                    'User-Agent': 'Dandi-App'
                }
            }),
            fetch(repoUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Dandi-App'
                }
            }),
            fetch(releasesUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Dandi-App'
                }
            })
        ]);

        // Handle README response
        if (!readmeResponse.ok) {
            throw new Error(`GitHub API returned ${readmeResponse.status} for README`);
        }
        const readmeContent = await readmeResponse.text();

        // Handle repository metadata response
        if (!repoResponse.ok) {
            throw new Error(`GitHub API returned ${repoResponse.status} for repository metadata`);
        }
        const repoData = await repoResponse.json();

        // Handle releases response (optional - some repos don't have releases)
        let latestVersion = null;
        if (releaseResponse.ok) {
            const releaseData = await releaseResponse.json();
            latestVersion = releaseData.tag_name;
        }

        return {
            readmeContent,
            repositoryMetadata: {
                stars: repoData.stargazers_count,
                latestVersion: latestVersion,
                description: repoData.description,
                language: repoData.language,
                forks: repoData.forks_count,
                openIssues: repoData.open_issues_count,
                website: repoData.homepage,
                license: repoData.license?.name || null,
                licenseUrl: repoData.license?.url || null,
                createdAt: repoData.created_at,
                updatedAt: repoData.updated_at,
                pushedAt: repoData.pushed_at,
                size: repoData.size,
                watchers: repoData.watchers_count,
                defaultBranch: repoData.default_branch,
                topics: repoData.topics || []
            }
        };

    } catch (error) {
        console.error('Error fetching all repository data:', error);
        throw new Error('Failed to fetch repository data');
    }
}
