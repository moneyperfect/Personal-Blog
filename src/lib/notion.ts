import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export interface NotionNote {
    id: string;
    title: string;
    slug: string;
    summary: string;
    date: string;
    tags: string[];
    language: 'zh' | 'ja';
}

function getProperty(page: PageObjectResponse, propName: string, type: string) {
    if (!page.properties[propName]) {
        return null;
    }
    return page.properties[propName];
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

// Helper to validate and parse a page object into NotionNote
function parseNotionPage(page: PageObjectResponse): NotionNote | null {
    const props = page.properties;

    const isPublished = getCheckbox(props['Published']);
    if (!isPublished) return null;

    const type = getText(props['Type']);
    if (type !== 'note') return null; // Filter by Type=note

    const title = getText(props['Title']);
    const slug = getText(props['Slug']);
    const language = getText(props['Language']) as 'zh' | 'ja';
    const summary = getText(props['Summary']);
    const date = getDate(props['Date']);
    const tags = getMultiSelect(props['Tags']);

    // Strict validation as requested
    if (!title) console.warn(`Page ${page.id} missing Title`);
    if (!slug) console.warn(`Page ${page.id} missing Slug`);
    if (!language) console.warn(`Page ${page.id} missing Language`);
    if (!date) console.warn(`Page ${page.id} missing Date`);

    if (!title || !slug || !language || !date) return null;

    return {
        id: page.id,
        title,
        slug,
        summary,
        date,
        tags,
        language,
    };
}

export async function queryNotes(language: 'zh' | 'ja'): Promise<NotionNote[]> {
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) {
        console.error('NOTION_DATABASE_ID is not set');
        return [];
    }

    try {
        const response = await (notion.databases as any).query({
            database_id: databaseId,
            filter: {
                and: [
                    {
                        property: 'Published',
                        checkbox: {
                            equals: true,
                        },
                    },
                    {
                        property: 'Type',
                        select: {
                            equals: 'note',
                        },
                    },
                    {
                        property: 'Language',
                        select: {
                            equals: language,
                        },
                    },
                ],
            },
            sorts: [
                {
                    property: 'Date',
                    direction: 'descending',
                },
            ],
        });

        const notes: NotionNote[] = [];
        for (const page of response.results) {
            if ('properties' in page) {
                const parsed = parseNotionPage(page as PageObjectResponse);
                if (parsed) {
                    notes.push(parsed);
                }
            }
        }
        return notes;
    } catch (error) {
        console.error('Error querying Notion:', error);
        return [];
    }
}

export async function getNotePageBySlug(slug: string, language: 'zh' | 'ja'): Promise<NotionNote | null> {
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) return null;

    try {
        const response = await (notion.databases as any).query({
            database_id: databaseId,
            filter: {
                and: [
                    {
                        property: 'Slug',
                        rich_text: {
                            equals: slug,
                        },
                    },
                    {
                        property: 'Language',
                        select: {
                            equals: language,
                        },
                    },
                ],
            },
        });

        if (response.results.length === 0) return null;

        const page = response.results[0];
        if ('properties' in page) {
            return parseNotionPage(page as PageObjectResponse);
        }
        return null;
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
