import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

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
    const token = process.env.NOTION_TOKEN;
    const dbId = process.env.NOTION_DATABASE_ID;

    if (!token || !dbId) {
        return NextResponse.json({
            ok: false,
            error: 'Missing environment variables: NOTION_TOKEN or NOTION_DATABASE_ID'
        }, { status: 500 });
    }

    const notion = new Client({ auth: token });

    try {
        // 1. Unfiltered Query (First 10)
        console.log('Querying Notion unfiltered...');
        const unfilteredResponse = await (notion.databases as any).query({
            database_id: dbId,
            page_size: 10,
        });

        const unfilteredResults = unfilteredResponse.results;
        const unfilteredCount = unfilteredResults.length;

        const sample = unfilteredResults.slice(0, 3).map((page: any) => {
            if (!('properties' in page)) return { id: page.id, message: 'Not a page object' };

            return {
                id: page.id,
                title: getPropValue(page, 'Title', 'title'),
                slug: getPropValue(page, 'Slug', 'any'), // Could be text or rich_text
                language: getPropValue(page, 'Language', 'select'),
                type: getPropValue(page, 'Type', 'select'),
                published: getPropValue(page, 'Published', 'checkbox'),
                date: getPropValue(page, 'Date', 'date'),
                rawProps: Object.keys(page.properties) // To see available properties
            };
        });

        // 2. Filtered Queries
        // Check ZH notes count
        const zhResponse = await (notion.databases as any).query({
            database_id: dbId,
            filter: {
                and: [
                    { property: 'Published', checkbox: { equals: true } },
                    { property: 'Type', select: { equals: 'note' } },
                    { property: 'Language', select: { equals: 'zh' } },
                ],
            },
        });

        // Check JA notes count
        const jaResponse = await (notion.databases as any).query({
            database_id: dbId,
            filter: {
                and: [
                    { property: 'Published', checkbox: { equals: true } },
                    { property: 'Type', select: { equals: 'note' } },
                    { property: 'Language', select: { equals: 'ja' } },
                ],
            },
        });

        return NextResponse.json({
            ok: true,
            databaseId: dbId, // Return masked or full ID for confirmation
            unfilteredCount,
            sample,
            filtered: {
                zh: zhResponse.results.length,
                ja: jaResponse.results.length
            }
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
