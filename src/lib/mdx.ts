import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

type Locale = 'zh' | 'ja';


const contentDirectory = path.join(process.cwd(), 'content');

export interface ProductFrontmatter {
    title: string;
    summary: string;
    tags: string[];
    updatedAt: string;
    language: string;
    price: string;
    purchaseUrl: string;
}

export interface LibraryFrontmatter {
    title: string;
    summary: string;
    tags: string[];
    updatedAt: string;
    language: string;
    type: 'template' | 'checklist' | 'sop' | 'prompt';
    downloadUrl?: string;
    copyText?: string;
}

export interface ContentFrontmatter {
    title: string;
    summary: string;
    tags: string[];
    updatedAt: string;
    language: string;
}

export interface NoteFrontmatter extends ContentFrontmatter {
    category?: string;
    type?: string;
    coverImage?: string;
    seoTitle?: string;
    seoDescription?: string;
}

export interface ContentItem<T = ContentFrontmatter> {
    slug: string;
    frontmatter: T;
    content: string;
}

function getContentFiles(type: string, locale: Locale): string[] {
    const dir = path.join(contentDirectory, type);
    if (!fs.existsSync(dir)) {
        return [];
    }
    return fs.readdirSync(dir).filter((file) => file.endsWith(`.${locale}.mdx`));
}

export function getContentBySlug<T = ContentFrontmatter>(
    type: string,
    slug: string,
    locale: Locale
): ContentItem<T> | null {
    // Decode URL-encoded slug if necessary
    let decodedSlug = slug;
    try {
        decodedSlug = decodeURIComponent(slug);
    } catch {
        // If decoding fails, use original slug
    }
    const filePath = path.join(contentDirectory, type, `${decodedSlug}.${locale}.mdx`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
        slug,
        frontmatter: data as T,
        content,
    };
}

export function getAllContent<T extends ContentFrontmatter = ContentFrontmatter>(
    type: string,
    locale: Locale
): ContentItem<T>[] {
    const files = getContentFiles(type, locale);

    return files
        .map((file) => {
            const slug = file.replace(`.${locale}.mdx`, '');
            return getContentBySlug<T>(type, slug, locale);
        })
        .filter((item): item is ContentItem<T> => item !== null)
        .sort((a, b) =>
            new Date(b.frontmatter.updatedAt).getTime() - new Date(a.frontmatter.updatedAt).getTime()
        );
}

export function getAllProducts(locale: Locale): ContentItem<ProductFrontmatter>[] {
    return getAllContent<ProductFrontmatter>('products', locale);
}

export function getProductBySlug(slug: string, locale: Locale): ContentItem<ProductFrontmatter> | null {
    return getContentBySlug<ProductFrontmatter>('products', slug, locale);
}

export function getAllLibraryItems(locale: Locale): ContentItem<LibraryFrontmatter>[] {
    return getAllContent<LibraryFrontmatter>('library', locale);
}

export function getLibraryItemBySlug(slug: string, locale: Locale): ContentItem<LibraryFrontmatter> | null {
    return getContentBySlug<LibraryFrontmatter>('library', slug, locale);
}

export function getAllPlaybooks(locale: Locale): ContentItem<ContentFrontmatter>[] {
    return getAllContent<ContentFrontmatter>('playbooks', locale);
}

export function getPlaybookBySlug(slug: string, locale: Locale): ContentItem<ContentFrontmatter> | null {
    return getContentBySlug<ContentFrontmatter>('playbooks', slug, locale);
}

export function getAllCases(locale: Locale): ContentItem<ContentFrontmatter>[] {
    return getAllContent<ContentFrontmatter>('cases', locale);
}

export function getCaseBySlug(slug: string, locale: Locale): ContentItem<ContentFrontmatter> | null {
    return getContentBySlug<ContentFrontmatter>('cases', slug, locale);
}

export async function getAllNotes(locale: Locale): Promise<ContentItem<NoteFrontmatter>[]> {
    const { supabase } = await import('./supabase');
    const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true) // Only fetch published notes for public view
        .order('date', { ascending: false });

    if (!posts) return [];

    return posts.map((post) => ({
        slug: post.slug,
        frontmatter: {
            title: post.title,
            summary: post.excerpt || '',
            tags: post.tags || [],
            updatedAt: post.date, // mapping date to updatedAt
            language: post.lang || 'zh',
            category: post.category,
            type: 'note', // default type
            coverImage: post.cover_image || '',
            seoTitle: post.seo_title || '',
            seoDescription: post.seo_description || '',
        },
        content: post.content || '',
    }));
}

export async function getNoteBySlug(slug: string, locale: Locale): Promise<ContentItem<NoteFrontmatter> | null> {
    const { supabase } = await import('./supabase');
    const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!post) return null;

    return {
        slug: post.slug,
        frontmatter: {
            title: post.title,
            summary: post.excerpt || '',
            tags: post.tags || [],
            updatedAt: post.date,
            language: post.lang || 'zh',
            category: post.category,
            type: 'note',
            coverImage: post.cover_image || '',
            seoTitle: post.seo_title || '',
            seoDescription: post.seo_description || '',
        },
        content: post.content || '',
    };
}



export function getAllTags(items: ContentItem<ContentFrontmatter>[]): string[] {
    const tagSet = new Set<string>();
    items.forEach((item) => {
        item.frontmatter.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
}

export async function getAllResources(locale: Locale): Promise<ContentItem<LibraryFrontmatter | NoteFrontmatter>[]> {
    const libraryItems = getAllLibraryItems(locale);
    const notes = await getAllNotes(locale);

    // Map notes to look like library items where compatible
    const notesAsResources = notes.map(note => ({
        ...note, // Keep the structure, just override frontmatter type
        frontmatter: {
            ...note.frontmatter,
            type: 'note' as const
        }
    }));

    return [...libraryItems, ...notesAsResources].sort((a, b) =>
        new Date(b.frontmatter.updatedAt).getTime() - new Date(a.frontmatter.updatedAt).getTime()
    );
}

export async function getAllSlugs(type: string, locale: Locale): Promise<string[]> {
    if (type === 'notes') {
        const { supabase } = await import('./supabase');
        const { data: posts } = await supabase
            .from('posts')
            .select('slug')
            .eq('published', true)

        if (!posts) return [];
        return posts.map(post => post.slug);
    }
    const files = getContentFiles(type, locale);
    return files.map((file) => file.replace(`.${locale}.mdx`, ''));
}
