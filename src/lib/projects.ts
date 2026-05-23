import fs from 'fs';
import path from 'path';
import type { Locale } from '@/i18n/routing';

const projectsPath = path.join(process.cwd(), 'config', 'projects.json');

interface LocalizedString {
    zh: string;
    ja: string;
}

interface ProjectRaw {
    slug: string;
    name: LocalizedString;
    description: LocalizedString;
    techStack: string[];
    link: string;
    github?: string;
    image: string;
    content: LocalizedString;
    detailPage?: string;
}

export interface Project {
    slug: string;
    name: string;
    description: string;
    techStack: string[];
    link: string;
    github?: string;
    image: string;
    content: string;
    detailPage?: string;
}

function readProjectsRaw(): ProjectRaw[] {
    if (!fs.existsSync(projectsPath)) {
        return [];
    }
    const raw = fs.readFileSync(projectsPath, 'utf8');
    return JSON.parse(raw);
}

function localize(item: ProjectRaw, locale: Locale): Project {
    return {
        slug: item.slug,
        name: item.name[locale] || item.name.zh,
        description: item.description[locale] || item.description.zh,
        techStack: item.techStack,
        link: item.link,
        github: item.github,
        image: item.image,
        content: item.content[locale] || item.content.zh,
        detailPage: item.detailPage,
    };
}

export function getAllProjects(locale: Locale): Project[] {
    return readProjectsRaw().map((item) => localize(item, locale));
}

export function getProjectBySlug(slug: string, locale: Locale): Project | null {
    const raw = readProjectsRaw().find((item) => item.slug === slug);
    if (!raw) return null;
    return localize(raw, locale);
}

export function getAllProjectSlugs(): string[] {
    return readProjectsRaw().map((item) => item.slug);
}
