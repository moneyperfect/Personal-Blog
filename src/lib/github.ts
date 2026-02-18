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
        } catch (e: any) {
            if (e.status !== 404) throw e;
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
