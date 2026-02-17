import { NextResponse } from 'next/server';
import { getFileContent, updateFile } from '@/lib/github';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
        return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    try {
        const file = await getFileContent(path);
        if (!file) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }
        return NextResponse.json(file);
    } catch (error) {
        console.error('Error in GitHub API route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { path, content, sha, message } = body;

        if (!path || !content || !sha || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const result = await updateFile(path, content, sha, message);

        if (result.success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }
    } catch (error) {
        console.error('Error in GitHub API route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
