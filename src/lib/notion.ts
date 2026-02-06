import { notionDatabaseQuery, getAllBlocks } from './notionRest';
import { NotionToMarkdown } from 'notion-to-md';

// Create a dummy client for n2m that uses our REST implementation
const dummyClient = {
    blocks: {
        children: {
            list: async ({ block_id, start_cursor }: { block_id: string; start_cursor?: string }) => {
                const response = await fetch(`https://api.notion.com/v1/blocks/${block_id}/children?page_size=100${start_cursor ? `&start_cursor=${start_cursor}` : ''}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                        'Notion-Version': '2022-06-28',
                    }
                });
                return await response.json();
            }
        }
    }
} as any;

const n2m = new NotionToMarkdown({ notionClient: dummyClient });

// Category values for filtering
export type CategoryType = 'template' | 'checklist' | 'sop' | 'prompt' | 'note' | '';

export interface NotionNote {
    id: string;
    title: string;
    slug: string;
    summary: string;
    date: string;
    tags: string[];
    language: 'zh' | 'ja';
    category: CategoryType;
    type: string; // Original Type field for distinguishing notes
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function getText(prop: any): string {
    if (!prop) return '';
    if (prop.type === 'title' && prop.title) {
        return prop.title.map((t: any) => t.plain_text).join('');
    }
    if (prop.type === 'rich_text' && prop.rich_text) {
        return prop.rich_text.map((t: any) => t.plain_text).join('');
    }
    if (prop.type === 'select' && prop.select) {
        return prop.select.name;
    }
    return '';
}

function getDate(prop: any): string {
    if (!prop || prop.type !== 'date' || !prop.date) return '';
    return prop.date.start;
}

function getMultiSelect(prop: any): string[] {
    if (!prop || prop.type !== 'multi_select' || !prop.multi_select) return [];
    return prop.multi_select.map((o: any) => o.name);
}

function getCheckbox(prop: any): boolean {
    if (!prop || prop.type !== 'checkbox') return false;
    return prop.checkbox;
}

function parseNotionPage(page: any): NotionNote | null {
    const props = page.properties;

    const isPublished = getCheckbox(props['Published']);
    if (!isPublished) return null;

    const title = getText(props['Title']);
    const slug = getText(props['Slug']);
    const language = getText(props['Language']) as 'zh' | 'ja';
    const summary = getText(props['Summary']);
    const date = getDate(props['Date']);
    const tags = getMultiSelect(props['Tags']);
    const category = (getText(props['Category']) || '') as CategoryType;
    const type = getText(props['Type']);

    if (!title || !slug || !language) return null;

    return {
        id: page.id,
        title,
        slug,
        summary,
        date: date || new Date().toISOString().split('T')[0],
        tags,
        language,
        category,
        type,
    };
}

// Query notes by Type=note (for /notes page)
export async function queryNotes(language: 'zh' | 'ja'): Promise<NotionNote[]> {
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) return [];

    try {
        const response = await notionDatabaseQuery(databaseId, {
            filter: {
                and: [
                    { property: 'Published', checkbox: { equals: true } },
                    { property: 'Type', select: { equals: 'note' } },
                    { property: 'Language', select: { equals: language } },
                ],
            },
            sorts: [{ property: 'Date', direction: 'descending' }],
        });

        const notes: NotionNote[] = [];
        for (const page of response.results) {
            const parsed = parseNotionPage(page);
            if (parsed) notes.push(parsed);
        }
        return notes;
    } catch (error) {
        console.error('Error querying Notion notes:', error);
        return [];
    }
}

// Query library items by Category (for /library page)
export async function queryLibraryByCategory(
    language: 'zh' | 'ja',
    category?: CategoryType
): Promise<NotionNote[]> {
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) return [];

    try {
        // Build filter based on category
        const baseFilter: any[] = [
            { property: 'Published', checkbox: { equals: true } },
            { property: 'Language', select: { equals: language } },
        ];

        if (category) {
            // Filter by specific category
            baseFilter.push({ property: 'Category', select: { equals: category } });
        }
        // If no category specified (All), just use Published + Language filter

        const response = await notionDatabaseQuery(databaseId, {
            filter: { and: baseFilter },
            sorts: [{ property: 'Date', direction: 'descending' }],
        });

        const items: NotionNote[] = [];
        for (const page of response.results) {
            const parsed = parseNotionPage(page);
            if (parsed) items.push(parsed);
        }
        return items;
    } catch (error) {
        console.error('Error querying Notion library:', error);
        return [];
    }
}

export async function getNotePageBySlug(slug: string, language: 'zh' | 'ja'): Promise<NotionNote | null> {
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) return null;

    try {
        const response = await notionDatabaseQuery(databaseId, {
            filter: {
                and: [
                    { property: 'Slug', rich_text: { equals: slug } },
                    { property: 'Language', select: { equals: language } },
                ],
            },
        });

        if (!response.results || response.results.length === 0) return null;
        return parseNotionPage(response.results[0]);
    } catch (error) {
        console.error('Error fetching note by slug:', error);
        return null;
    }
}

export async function getPageContent(pageId: string): Promise<string> {
    try {
        const mdblocks = await n2m.pageToMarkdown(pageId);
        const mdString = n2m.toMarkdownString(mdblocks);
        return mdString.parent;
    } catch (error) {
        console.error('Error fetching page content:', error);
        return '';
    }
}
