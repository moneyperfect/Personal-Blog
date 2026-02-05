import { NextResponse } from 'next/server';
import { notionDatabaseQuery } from '@/lib/notionRest';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* eslint-disable @typescript-eslint/no-explicit-any */
function getPropValue(page: any, propName: string, type: string): string {
    const props = page.properties;
    if (!props || !props[propName]) return '(missing)';

    const prop = props[propName];
    if (prop.type !== type && type !== 'any') return `(type mismatch: ${prop.type}, expected ${type})`;

    if (type === 'title' || prop.type === 'title') {
        return prop.title?.map((t: any) => t.plain_text).join('') || '';
    }
    if (type === 'rich_text' || prop.type === 'rich_text') {
        return prop.rich_text?.map((t: any) => t.plain_text).join('') || '';
    }
    if (type === 'select' || prop.type === 'select') {
        return prop.select?.name || '(select empty)';
    }
    if (type === 'multi_select' || prop.type === 'multi_select') {
        return prop.multi_select?.map((o: any) => o.name).join(', ') || '(empty)';
    }
    if (type === 'date' || prop.type === 'date') {
        return prop.date?.start || '(no date)';
    }
    if (type === 'checkbox' || prop.type === 'checkbox') {
        return prop.checkbox ? 'true' : 'false';
    }
    return `(unsupported type: ${prop.type})`;
}

export async function GET() {
    const dbId = process.env.NOTION_DATABASE_ID;

    if (!process.env.NOTION_TOKEN) {
        return NextResponse.json({ ok: false, error: 'Missing NOTION_TOKEN' }, { status: 500 });
    }
    if (!dbId) {
        return NextResponse.json({ ok: false, error: 'Missing NOTION_DATABASE_ID' }, { status: 500 });
    }

    try {
        // 1. Unfiltered Query (Simple)
        console.log('Querying Notion via REST (unfiltered)...');
        const response = await notionDatabaseQuery(dbId, { page_size: 5 });

        const results = response.results || [];
        const unfilteredCount = results.length;

        const sampleTitles = results.map((page: any) => {
            if (!('properties' in page)) return '(not a page)';
            return getPropValue(page, 'Title', 'title');
        });

        // 2. Filtered Queries Sample (zh)
        const zhResponse = await notionDatabaseQuery(dbId, {
            filter: {
                and: [
                    { property: 'Published', checkbox: { equals: true } },
                    { property: 'Type', select: { equals: 'note' } },
                    { property: 'Language', select: { equals: 'zh' } },
                ],
            },
            page_size: 1
        });

        return NextResponse.json({
            ok: true,
            unfilteredCount,
            sampleTitles,
            rawFirst: results[0] ? results[0] : null,
            filteredDebug: {
                zhCount: zhResponse.results.length, // Just checking if ANY returned
            }
        });

    } catch (error: any) {
        console.error('Notion REST API Error:', error);
        return NextResponse.json({
            ok: false,
            error: error.message || 'Unknown Error',
            details: error
        }, { status: 500 });
    }
}
