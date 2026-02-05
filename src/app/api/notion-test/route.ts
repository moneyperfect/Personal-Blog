import { NextResponse } from 'next/server';
import { notion } from '@/lib/notionClient';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* eslint-disable @typescript-eslint/no-explicit-any */
function getTitle(page: any): string {
    const props = page.properties;
    if (!props) return '(no props)';

    // Find the title property (it has type 'title')
    const titlePropKey = Object.keys(props).find(key => props[key].type === 'title');
    if (!titlePropKey) return '(no title prop)';

    const titleProp = props[titlePropKey];
    if (titleProp.title && Array.isArray(titleProp.title)) {
        return titleProp.title.map((t: any) => t.plain_text).join('');
    }
    return '(empty title)';
}

export async function GET() {
    const dbId = process.env.NOTION_DATABASE_ID;

    if (!process.env.NOTION_TOKEN) {
        return NextResponse.json({ ok: false, error: 'NOTION_TOKEN missing' }, { status: 500 });
    }
    if (!dbId) {
        return NextResponse.json({ ok: false, error: 'NOTION_DATABASE_ID missing' }, { status: 500 });
    }

    try {
        // 1. Unfiltered Query (Simple)
        const response = await notion.databases.query({
            database_id: dbId,
            page_size: 5,
        });

        const results = response.results;
        const unfilteredCount = results.length;

        const sampleTitles = results.map((page) => {
            if (!('properties' in page)) return '(not a page)';
            return getTitle(page as PageObjectResponse);
        });

        return NextResponse.json({
            ok: true,
            databaseId: dbId,
            unfilteredCount,
            sampleTitles,
            rawFirstItem: results[0] ? results[0] : null
        });

    } catch (error) {
        console.error('Notion API Error:', error);
        return NextResponse.json({
            ok: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            details: error
        }, { status: 500 });
    }
}
