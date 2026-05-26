import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Locale } from '@/i18n/routing';
import { supabaseAdmin } from '@/lib/supabase';

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

export interface BlogFrontmatter {
    title: string;
    date: string;
    tags: string[];
    category?: string;
    coverImage: string;
    description: string;
    lang?: Locale;
}

export interface BlogItem {
    slug: string;
    frontmatter: BlogFrontmatter;
    content: string;
}

// ─── Local file reading ───────────────────────────────────────────────

function getPostFiles(): string[] {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }
    return fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.md'));
}

function parsePostFile(filename: string): BlogItem | null {
    const slug = filename.replace(/\.md$/, '');
    const filePath = path.join(postsDirectory, filename);

    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        const frontmatter: BlogFrontmatter = {
            title: data.title || '',
            date: data.date || '',
            tags: data.tags || [],
            category: data.category || undefined,
            coverImage: data.coverImage || '',
            description: data.description || '',
            lang: data.lang || 'zh',
        };

        return { slug, frontmatter, content };
    } catch {
        return null;
    }
}

function getAllLocalPosts(): BlogItem[] {
    const files = getPostFiles();
    return files
        .map(parsePostFile)
        .filter((post): post is BlogItem => post !== null);
}

// ─── Supabase reading ─────────────────────────────────────────────────

async function getAllSupabasePosts(): Promise<BlogItem[]> {
    const { data, error } = await supabaseAdmin
        .from('posts')
        .select('slug, title, content, excerpt, category, tags, cover_image, lang, date')
        .eq('published', true)
        .order('date', { ascending: false });

    if (error || !data) {
        return [];
    }

    return data.map((row) => ({
        slug: row.slug,
        frontmatter: {
            title: row.title || '',
            date: row.date ? new Date(row.date).toISOString().split('T')[0] : '',
            tags: row.tags || [],
            category: row.category || undefined,
            coverImage: row.cover_image || '',
            description: row.excerpt || '',
            lang: (row.lang || 'zh') as Locale,
        },
        content: row.content || '',
    }));
}

async function getSupabasePostBySlug(slug: string): Promise<BlogItem | null> {
    const { data, error } = await supabaseAdmin
        .from('posts')
        .select('slug, title, content, excerpt, category, tags, cover_image, lang, date')
        .eq('slug', slug)
        .eq('published', true)
        .single();

    if (error || !data) {
        return null;
    }

    return {
        slug: data.slug,
        frontmatter: {
            title: data.title || '',
            date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
            tags: data.tags || [],
            category: data.category || undefined,
            coverImage: data.cover_image || '',
            description: data.excerpt || '',
            lang: (data.lang || 'zh') as Locale,
        },
        content: data.content || '',
    };
}

// ─── Merged public API ────────────────────────────────────────────────

export async function getAllPosts(locale: Locale): Promise<BlogItem[]> {
    const [localPosts, supabasePosts] = await Promise.all([
        Promise.resolve(getAllLocalPosts()),
        getAllSupabasePosts(),
    ]);

    // Supabase takes priority over local files with same slug
    const slugMap = new Map<string, BlogItem>();

    // Local posts first (lower priority)
    for (const post of localPosts) {
        const existing = slugMap.get(post.slug);
        if (!existing) {
            slugMap.set(post.slug, post);
        } else if (post.frontmatter.lang === locale) {
            slugMap.set(post.slug, post);
        }
    }

    // Supabase posts override (higher priority)
    for (const post of supabasePosts) {
        slugMap.set(post.slug, post);
    }

    const result = Array.from(slugMap.values());

    // Filter by locale: prefer exact match, fallback to zh
    const filtered = result.filter(
        (post) => post.frontmatter.lang === locale || post.frontmatter.lang === 'zh'
    );

    filtered.sort((a, b) => {
        const dateA = new Date(a.frontmatter.date).getTime();
        const dateB = new Date(b.frontmatter.date).getTime();
        return dateB - dateA;
    });

    return filtered;
}

export async function getPostBySlug(slug: string, locale: Locale): Promise<BlogItem | null> {
    // Supabase first
    const supabasePost = await getSupabasePostBySlug(slug);
    if (supabasePost) {
        if (supabasePost.frontmatter.lang === locale || supabasePost.frontmatter.lang === 'zh') {
            return supabasePost;
        }
    }

    // Fallback to local file
    const filePath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
        return null;
    }

    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        const frontmatter: BlogFrontmatter = {
            title: data.title || '',
            date: data.date || '',
            tags: data.tags || [],
            category: data.category || undefined,
            coverImage: data.coverImage || '',
            description: data.description || '',
            lang: data.lang || 'zh',
        };

        if (frontmatter.lang !== locale && frontmatter.lang !== 'zh') {
            return null;
        }

        return { slug, frontmatter, content };
    } catch {
        return null;
    }
}

export async function getAllPostSlugs(locale: Locale): Promise<string[]> {
    const posts = await getAllPosts(locale);
    return posts.map((post) => post.slug);
}

export async function getAllPostTags(locale: Locale): Promise<string[]> {
    const posts = await getAllPosts(locale);
    const tagSet = new Set<string>();

    for (const post of posts) {
        for (const tag of post.frontmatter.tags) {
            tagSet.add(tag);
        }
    }

    return Array.from(tagSet).sort();
}

export async function getAllCategories(locale: Locale): Promise<string[]> {
    const posts = await getAllPosts(locale);
    const categorySet = new Set<string>();

    for (const post of posts) {
        if (post.frontmatter.category) {
            categorySet.add(post.frontmatter.category);
        }
    }

    return Array.from(categorySet).sort();
}

export async function getRelatedPosts(
    currentSlug: string,
    locale: Locale,
    limit = 3
): Promise<BlogItem[]> {
    const current = await getPostBySlug(currentSlug, locale);
    if (!current) return [];

    const allPosts = (await getAllPosts(locale)).filter((p) => p.slug !== currentSlug);

    const scored = allPosts.map((post) => {
        let score = 0;

        if (
            current.frontmatter.category &&
            post.frontmatter.category === current.frontmatter.category
        ) {
            score += 10;
        }

        const sharedTags = post.frontmatter.tags.filter((tag) =>
            current.frontmatter.tags.includes(tag)
        );
        score += sharedTags.length * 2;

        return { post, score };
    });

    scored.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (
            new Date(b.post.frontmatter.date).getTime() -
            new Date(a.post.frontmatter.date).getTime()
        );
    });

    return scored.slice(0, limit).map((s) => s.post);
}
