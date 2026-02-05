import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* eslint-disable @typescript-eslint/no-explicit-any */
function getTitle(page: any): string {
    if (!page || !page.properties) return '(no properties)';

    // Iterate to find title
    const props = page.properties;
    const titleKey = Object.keys(props).find(key => props[key].type === 'title');
    if (!titleKey) return '(no title title)';

    const titleVal = props[titleKey];
    if (titleVal.title && Array.isArray(titleVal.title)) {
        return titleVal.title.map((t: any) => t.plain_text).join('');
    }
    return '(empty title)';
}

export async function GET() {
    try {
        // Dynamic import to avoid build-time static analysis issues
        const { Client } = await import('@notionhq/client');

        const token = process.env.NOTION_TOKEN;
        const dbId = process.env.NOTION_DATABASE_ID;

        if (!token || !dbId) {
            return NextResponse.json({
                ok: false,
                error: 'Missing ENV',
                debug: { hasToken: !!token, hasDbId: !!dbId }
            }, { status: 500 });
        }

        const notion = new Client({ auth: token });

        // Extensive SDK Debugging
        const sdkDebug = {
            typeofClient: typeof Client,
            clientKeys: Object.keys(notion),
            databasesKeys: notion.databases ? Object.keys(notion.databases) : 'undefined',
            hasQuery: notion.databases && 'query' in notion.databases,
        };

        console.log('Notion SDK Debug:', sdkDebug);

        // Force cast to any to bypass local TS issues while we debug runtime
        const response = await (notion as any).databases.query({
            database_id: dbId,
            page_size: 5,
        });

        const results = response.results || [];
        const sampleTitles = results.slice(0, 3).map((p: any) => getTitle(p));

        return NextResponse.json({
            ok: true,
            unfilteredCount: results.length,
            sampleTitles,
            sdkDebug,
        });

    } catch (error: any) {
        console.error('Notion Test Error:', error);
        return NextResponse.json({
            ok: false,
            error: error.message || 'Unknown Error',
            stack: error.stack,
        }, { status: 500 });
    }
}
