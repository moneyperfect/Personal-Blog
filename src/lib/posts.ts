import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Locale } from '@/i18n/routing';

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

export interface PostFrontmatter {
    title: string;
    date: string;
    tags: string[];
    coverImage: string;
    description: string;
    lang?: Locale;
}

export interface PostItem {
    slug: string;
    frontmatter: PostFrontmatter;
    content: string;
}

function getPostFiles(): string[] {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }
    return fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.md'));
}

function parsePostFile(filename: string): PostItem | null {
    const slug = filename.replace(/\.md$/, '');
    const filePath = path.join(postsDirectory, filename);

    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        const frontmatter: PostFrontmatter = {
            title: data.title || '',
            date: data.date || '',
            tags: data.tags || [],
            coverImage: data.coverImage || '',
            description: data.description || '',
            lang: data.lang || 'zh',
        };

        return { slug, frontmatter, content };
    } catch {
        return null;
    }
}

export function getAllPosts(locale: Locale): PostItem[] {
    const files = getPostFiles();

    const posts = files
        .map(parsePostFile)
        .filter((post): post is PostItem => post !== null)
        .filter((post) => post.frontmatter.lang === locale);

    posts.sort((a, b) => {
        const dateA = new Date(a.frontmatter.date).getTime();
        const dateB = new Date(b.frontmatter.date).getTime();
        return dateB - dateA;
    });

    return posts;
}

export function getPostBySlug(slug: string, locale: Locale): PostItem | null {
    const filePath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        const frontmatter: PostFrontmatter = {
            title: data.title || '',
            date: data.date || '',
            tags: data.tags || [],
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
