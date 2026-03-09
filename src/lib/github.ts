import { Octokit } from '@octokit/rest';

// Initialize Octokit
const getOctokit = () => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        throw new Error('GITHUB_TOKEN is not defined');
    }
    return new Octokit({ auth: token });
};

// Configuration
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const CONFIG_PATH = 'config/ignored-notes.json';

function getErrorStatus(error: unknown) {
    if (typeof error === 'object' && error && 'status' in error) {
        const status = (error as { status?: unknown }).status;
        return typeof status === 'number' ? status : null;
    }

    return null;
}

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return 'Unknown GitHub API error';
}

// Generic helper to get file content
export async function getFileContent(path: string) {
    if (!REPO_OWNER || !REPO_NAME) {
        throw new Error('REPO_OWNER or REPO_NAME is not defined');
    }
    const octokit = getOctokit();
    try {
        const { data } = await octokit.repos.getContent({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path,
        });

        if ('content' in data && !Array.isArray(data)) {
            return Buffer.from(data.content, 'base64').toString('utf-8');
        }
        return null;
    } catch (error: unknown) {
        if (getErrorStatus(error) === 404) return null;
        throw error;
    }
}

// Generic helper to update file content
export async function updateFile(path: string, content: string, sha: string | undefined, message: string) {
    if (!REPO_OWNER || !REPO_NAME) {
        throw new Error('REPO_OWNER or REPO_NAME is not defined');
    }
    const octokit = getOctokit();

    try {
        await octokit.repos.createOrUpdateFileContents({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path,
            message,
            content: Buffer.from(content).toString('base64'),
            sha,
        });
        return { success: true };
    } catch (error: unknown) {
        console.error('Error updating file:', error);
        return { success: false, error: getErrorMessage(error) };
    }
}

export async function addToIgnoreList(slug: string) {
    if (!REPO_OWNER || !REPO_NAME) {
        throw new Error('REPO_OWNER or REPO_NAME is not defined');
    }

    const octokit = getOctokit();

    try {
        // 1. Try to get existing file
        let currentContent: string[] = [];
        let sha: string | undefined;

        try {
            const { data } = await octokit.repos.getContent({
                owner: REPO_OWNER,
                repo: REPO_NAME,
                path: CONFIG_PATH,
            });

            if ('content' in data && !Array.isArray(data)) {
                const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
                currentContent = JSON.parse(decoded);
                sha = data.sha;
            }
        } catch (error: unknown) {
            if (getErrorStatus(error) !== 404) throw error;
            // File doesn't exist, start with empty array
            console.log('ignored-notes.json not found, creating new one.');
        }

        // 2. Add slug if not exists
        if (!currentContent.includes(slug)) {
            currentContent.push(slug);

            // 3. Update/Create file
            await octokit.repos.createOrUpdateFileContents({
                owner: REPO_OWNER,
                repo: REPO_NAME,
                path: CONFIG_PATH,
                message: `chore: unpublish note ${slug}`,
                content: Buffer.from(JSON.stringify(currentContent, null, 2)).toString('base64'),
                sha,
            });
            return true;
        }

        return false; // Already ignored
    } catch (error) {
        console.error('GitHub API Error:', error);
        throw error;
    }
}
