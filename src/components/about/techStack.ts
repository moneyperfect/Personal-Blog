import type { IconType } from 'react-icons';
import {
    SiClaude,
    SiFramer,
    SiGooglegemini,
    SiNextdotjs,
    SiObsidian,
    SiOpenai,
    SiPerplexity,
    SiReact,
    SiSupabase,
    SiTailwindcss,
    SiTypescript,
    SiVercel,
} from 'react-icons/si';

export interface TechStackEntry {
    label: string;
    icon: IconType;
    color: string;
}

export const techStack: TechStackEntry[] = [
    { label: 'ChatGPT', icon: SiOpenai, color: '#111111' },
    { label: 'Claude', icon: SiClaude, color: '#D97757' },
    { label: 'Gemini', icon: SiGooglegemini, color: '#5B8CFF' },
    { label: 'Perplexity', icon: SiPerplexity, color: '#20B8CD' },
    { label: 'Obsidian', icon: SiObsidian, color: '#7C3AED' },
    { label: 'Vercel', icon: SiVercel, color: '#111111' },
    { label: 'Next.js', icon: SiNextdotjs, color: '#111111' },
    { label: 'React', icon: SiReact, color: '#61DAFB' },
    { label: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
    { label: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4' },
    { label: 'Framer', icon: SiFramer, color: '#0055FF' },
    { label: 'Supabase', icon: SiSupabase, color: '#3ECF8E' },
];
