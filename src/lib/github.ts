import { Octokit } from '@octokit/rest';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'moneyperfect';
const REPO_NAME = 'Personal-Blog';
const BRANCH = 'main'; // Adjust if using a different branch

if (!GITHUB_TOKEN) {
    console.warn('GITHUB_TOKEN is not set. GitHub API features will not work.');
}

const octokit = new Octokit({
    auth: GITHUB_TOKEN,
});

export interface GitHubFile {
    content: string;
    sha: string;
    path: string;
}

export async function getFileContent(filePath: string): Promise<GitHubFile | null> {
    try {
        const response = await octokit.repos.getContent({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: filePath,
            ref: BRANCH,
        });

        // The response can be an array (directory) or an object (file)
        if (Array.isArray(response.data)) {
            throw new Error('Path points to a directory, not a file.');
        }

        const fileData = response.data as { content: string; sha: string; path: string; encoding: string };

        if (fileData.encoding === 'base64') {
            return {
                content: Buffer.from(fileData.content, 'base64').toString('utf-8'),
                sha: fileData.sha,
                path: fileData.path,
            };
        }

        return {
            content: fileData.content,
            sha: fileData.sha,
            path: fileData.path,
        };
    } catch (error) {
        console.error(`Error fetching file ${filePath} from GitHub:`, error);
        return null;
    }
}

export async function updateFile(
    filePath: string,
    content: string,
    sha: string,
    message: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await octokit.repos.createOrUpdateFileContents({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: filePath,
            message: message,
            content: Buffer.from(content).toString('base64'),
            sha: sha,
            branch: BRANCH,
        });
        return { success: true };
    } catch (error: any) {
        console.error(`Error updating file ${filePath} on GitHub:`, error);
        return { success: false, error: error.message };
    }
}
