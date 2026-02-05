import { NextResponse } from 'next/server';
import { queryNotes } from '@/lib/notion';

export async function GET() {
    const token = process.env.NOTION_TOKEN;
    const dbId = process.env.NOTION_DATABASE_ID;

    if (!token || !dbId) {
        return NextResponse.json({
            ok: false,
            error: 'Missing environment variables: NOTION_TOKEN or NOTION_DATABASE_ID'
        }, { status: 500 });
    }

    try {
        // Try querying for both languages to see what we get
        const zhNotes = await queryNotes('zh');
        const jaNotes = await queryNotes('ja');
        const allNotes = [...zhNotes, ...jaNotes];

        return NextResponse.json({
            ok: true,
            resultsCount: allNotes.length,
            sampleTitles: allNotes.map(n => n.title),
            debug: {
                zhCount: zhNotes.length,
                jaCount: jaNotes.length,
                firstNote: allNotes[0] || null
            }
        });
    } catch (error) {
        return NextResponse.json({
            ok: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        }, { status: 500 });
    }
}
