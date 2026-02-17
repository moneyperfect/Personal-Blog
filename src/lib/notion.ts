import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notionDatabaseQuery, getAllBlocks } from './notionRest';
import { NotionToMarkdown } from 'notion-to-md';

// Type for dummy client to satisfy notion-to-md
type NotionClientLike = {
    blocks: {
        children: {
            list: (args: { block_id: string; start_cursor?: string }) => Promise<{
                results: unknown[];
                has_more: boolean;
                next_cursor: string | null;
            }>;
        };
    };
};

// Simple in-memory cache for page content
const pageContentCache = new Map<
    string,
    { content: string; timestamp: number }
>();
const CACHE_TTL = 60 * 1000; // 60 seconds

// Create a dummy client for n2m that uses our REST implementation
const blockChildrenCache = new Map<string, unknown[]>(); // block_id -> all child blocks
const dummyClient = {
    blocks: {
        children: {
            list: async ({ block_id, start_cursor }: { block_id: string; start_cursor?: string }) => {
                // If we have cached all blocks for this block_id, return all blocks (ignore pagination)
                if (blockChildrenCache.has(block_id)) {
                    const cachedBlocks = blockChildrenCache.get(block_id);
                    console.log(`Using cached blocks for ${block_id}, count: ${cachedBlocks?.length}`);
                    return {
                        results: cachedBlocks,
                        has_more: false,
                        next_cursor: null,
                    };
                }
                // Otherwise fetch all blocks using getAllBlocks
                console.log(`Fetching all blocks for ${block_id} via getAllBlocks`);
                const start = Date.now();
                const allBlocks = await getAllBlocks(block_id);
                const end = Date.now();
                console.log(`getAllBlocks for ${block_id} took ${end - start}ms, total blocks: ${allBlocks.length}`);
                // Cache the result
                blockChildrenCache.set(block_id, allBlocks);
                // Return all blocks as a single page
                return {
                    results: allBlocks as unknown[],
                    has_more: false,
                    next_cursor: null,
                };
            }
        }
    }
} as NotionClientLike;

const n2m = new NotionToMarkdown({ notionClient: dummyClient });

// Category values for filtering
export type CategoryType =
    | 'template' | 'checklist' | 'sop' | 'prompt' | 'note'
    | 'AI' | 'Bug修复' | 'MVP' | 'ai' | '上线' | '产品' | '代码审查'
    | '写作' | '开发' | '效率' | '文案' | '检查清单' | '模板'
    | '用户研究' | '竞品分析' | '编程' | '营销' | '访谈'
    | '';

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

// Notion API response types
interface NotionDatabaseQueryResponse {
    results: unknown[];
    has_more: boolean;
    next_cursor: string | null;
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
    const languageRaw = getText(props['Language']);
    const language = languageRaw.toLowerCase().trim() as 'zh' | 'ja';
    const summary = getText(props['Summary']);
    const date = getDate(props['Date']);
    const tags = getMultiSelect(props['Tags']);
    const categoryRaw = getText(props['Category']) || '';
    // Normalize category: lowercase and trim
    const category = (categoryRaw.toLowerCase().trim() as CategoryType) || '' as CategoryType;
    if (categoryRaw && categoryRaw !== category) {
        console.log(`Category normalized: "${categoryRaw}" -> "${category}"`);
    }
    const typeRaw = getText(props['Type']);
    const type = typeRaw.toLowerCase().trim();

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

// Helper to get notes from local MDX files
function getLocalNotes(language: 'zh' | 'ja'): NotionNote[] {
    const notesDir = path.join(process.cwd(), 'content', 'notes');
    if (!fs.existsSync(notesDir)) return [];

    const notes: NotionNote[] = [];
    const files = fs.readdirSync(notesDir);

    for (const file of files) {
        if (file.endsWith(`.${language}.mdx`)) {
            const filePath = path.join(notesDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const { data: frontmatter } = matter(fileContent);
            const slug = file.replace(`.${language}.mdx`, '');

            notes.push({
                id: slug, // Use slug as ID for local notes
                title: frontmatter.title || '',
                slug,
                summary: frontmatter.summary || '',
                date: frontmatter.updatedAt || frontmatter.date || '',
                tags: frontmatter.tags || [],
                language: frontmatter.language as 'zh' | 'ja',
                category: (frontmatter.category || '') as CategoryType,
                type: frontmatter.type || 'note',
            });
        }
    }

    // Sort by date descending
    return notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Query notes by Type=note (for /notes page)
export async function queryNotes(language: 'zh' | 'ja'): Promise<NotionNote[]> {
    // First try to get notes from local MDX files
    const localNotes = getLocalNotes(language);
    if (localNotes.length > 0) {
        console.log(`Using ${localNotes.length} local notes for ${language}`);
        return localNotes;
    }

    // Fallback to Notion API if no local notes found
    console.log(`No local notes found for ${language}, querying Notion...`);
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) return [];

    try {
        let hasMore = true;
        let startCursor: string | null = null;
        const allResults: unknown[] = [];

        while (hasMore) {
            const response = await notionDatabaseQuery(databaseId, {
                filter: {
                    and: [
                        { property: 'Published', checkbox: { equals: true } },
                        { property: 'Type', select: { equals: 'note' } },
                        { property: 'Language', select: { equals: language } },
                    ],
                },
                sorts: [{ property: 'Date', direction: 'descending' }],
                start_cursor: startCursor || undefined,
            }) as NotionDatabaseQueryResponse;

            allResults.push(...response.results);
            hasMore = response.has_more;
            startCursor = response.next_cursor;
        }

        const notes: NotionNote[] = [];
        for (const page of allResults) {
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
        const baseFilter: unknown[] = [
            { property: 'Published', checkbox: { equals: true } },
            { property: 'Language', select: { equals: language } },
        ];

        if (category) {
            // Filter by specific category
            baseFilter.push({ property: 'Category', select: { equals: category } });
        }
        // If no category specified (All), just use Published + Language filter

        let hasMore = true;
        let startCursor: string | null = null;
        const allResults: unknown[] = [];

        while (hasMore) {
            const response = await notionDatabaseQuery(databaseId, {
                filter: { and: baseFilter },
                sorts: [{ property: 'Date', direction: 'descending' }],
                start_cursor: startCursor || undefined,
            }) as NotionDatabaseQueryResponse;

            allResults.push(...response.results);
            hasMore = response.has_more;
            startCursor = response.next_cursor;
        }

        const items: NotionNote[] = [];
        for (const page of allResults) {
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
        }) as NotionDatabaseQueryResponse;

        if (!response.results || response.results.length === 0) return null;
        return parseNotionPage(response.results[0]);
    } catch (error) {
        console.error('Error fetching note by slug:', error);
        return null;
    }
}

export async function getPageContent(pageId: string): Promise<string> {
    // Check cache first
    const cached = pageContentCache.get(pageId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`Cache hit for page ${pageId}`);
        return cached.content;
    }
    console.log(`Cache miss for page ${pageId}, fetching from Notion`);
    try {
        console.time(`getPageContent ${pageId}`);
        const mdblocks = await n2m.pageToMarkdown(pageId);
        console.timeLog(`getPageContent ${pageId}`, 'pageToMarkdown done');
        const mdString = n2m.toMarkdownString(mdblocks);
        console.timeEnd(`getPageContent ${pageId}`);
        const content = mdString.parent;
        console.log(`Page ${pageId} content length: ${content.length}`);
        // Update cache
        pageContentCache.set(pageId, { content, timestamp: Date.now() });
        return content;
    } catch (error) {
        console.error('Error fetching page content for page', pageId, error);
        if (error instanceof Error) {
            console.error('Error details:', error.message, error.stack);
        }
        return '';
    }
}

// Get all note slugs for static generation
export async function getAllNoteSlugs(): Promise<{ locale: string; slug: string }[]> {
    // First try to get slugs from local MDX files
    const notesDir = path.join(process.cwd(), 'content', 'notes');
    if (fs.existsSync(notesDir)) {
        const files = fs.readdirSync(notesDir);
        const slugs: { locale: string; slug: string }[] = [];
        for (const file of files) {
            if (file.endsWith('.zh.mdx')) {
                const slug = file.replace('.zh.mdx', '');
                slugs.push({ locale: 'zh', slug });
            } else if (file.endsWith('.ja.mdx')) {
                const slug = file.replace('.ja.mdx', '');
                slugs.push({ locale: 'ja', slug });
            }
        }
        if (slugs.length > 0) {
            console.log(`Using ${slugs.length} local note slugs for static generation`);
            return slugs;
        }
    }

    // Fallback to Notion API if no local files found
    console.log('No local note files found, querying Notion for slugs...');
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) return [];
    try {
        // Query all published notes (both languages)
        const response = await notionDatabaseQuery(databaseId, {
            filter: {
                and: [
                    { property: 'Published', checkbox: { equals: true } },
                    { property: 'Type', select: { equals: 'note' } },
                ],
            },
        }) as NotionDatabaseQueryResponse;
        const slugs: { locale: string; slug: string }[] = [];
        for (const page of response.results) {
            const parsed = parseNotionPage(page);
            if (parsed) {
                slugs.push({ locale: parsed.language, slug: parsed.slug });
            }
        }
        return slugs;
    } catch (error) {
        console.error('Error fetching all note slugs:', error);
        return [];
    }
}
