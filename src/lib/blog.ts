import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Locale } from '@/i18n/routing';

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

export function getAllPosts(locale: Locale): BlogItem[] {
    const files = getPostFiles();

    const posts = files
        .map(parsePostFile)
        .filter((post): post is BlogItem => post !== null)
        .filter((post) => post.frontmatter.lang === locale);

    posts.sort((a, b) => {
        const dateA = new Date(a.frontmatter.date).getTime();
        const dateB = new Date(b.frontmatter.date).getTime();
        return dateB - dateA;
    });

    return posts;
}

export function getPostBySlug(slug: string, locale: Locale): BlogItem | null {
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

        if (frontmatter.lang !== locale) {
            return null;
        }

        return { slug, frontmatter, content };
    } catch {
        return null;
    }
}

export function getAllPostSlugs(locale: Locale): string[] {
    return getAllPosts(locale).map((post) => post.slug);
}

export function getAllPostTags(locale: Locale): string[] {
    const posts = getAllPosts(locale);
    const tagSet = new Set<string>();

    for (const post of posts) {
        for (const tag of post.frontmatter.tags) {
            tagSet.add(tag);
        }
    }

    return Array.from(tagSet).sort();
}

export function getAllCategories(locale: Locale): string[] {
    const posts = getAllPosts(locale);
    const categorySet = new Set<string>();

    for (const post of posts) {
        if (post.frontmatter.category) {
            categorySet.add(post.frontmatter.category);
        }
    }

    return Array.from(categorySet).sort();
}

export function getRelatedPosts(
    currentSlug: string,
    locale: Locale,
    limit = 3
): BlogItem[] {
    const current = getPostBySlug(currentSlug, locale);
    if (!current) return [];

    const allPosts = getAllPosts(locale).filter((p) => p.slug !== currentSlug);

    const scored = allPosts.map((post) => {
        let score = 0;

        // Same category = high priority
        if (
            current.frontmatter.category &&
            post.frontmatter.category === current.frontmatter.category
        ) {
            score += 10;
        }

        // Shared tags
        const sharedTags = post.frontmatter.tags.filter((tag) =>
            current.frontmatter.tags.includes(tag)
        );
        score += sharedTags.length * 2;

        return { post, score };
    });

    // Sort by score desc, then by date desc
    scored.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (
            new Date(b.post.frontmatter.date).getTime() -
            new Date(a.post.frontmatter.date).getTime()
        );
    });

    return scored.slice(0, limit).map((s) => s.post);
}
