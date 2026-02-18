'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { trackAppEvent } from '@/lib/analytics';

interface TocHeading {
    id: string;
    text: string;
    level: 2 | 3;
}

interface NoteReaderClientProps {
    headings: TocHeading[];
    slug: string;
    locale: string;
    readingMinutes: number;
    wordCount: number;
}

const MILESTONES = [25, 50, 75, 100];

export default function NoteReaderClient({
    headings,
    slug,
    locale,
    readingMinutes,
    wordCount,
}: NoteReaderClientProps) {
    const [progress, setProgress] = useState(0);
    const [activeHeadingId, setActiveHeadingId] = useState<string | null>(headings[0]?.id ?? null);
    const firedMilestones = useRef(new Set<number>());

    const labels = useMemo(() => {
        const isZh = locale === 'zh';
        return {
            readingStats: isZh ? '阅读信息' : 'Reading Stats',
            estimated: isZh ? '预计阅读' : 'Estimated',
            minutes: isZh ? '分钟' : 'min',
            words: isZh ? '字数' : 'words',
            toc: isZh ? '目录' : 'Contents',
            backTop: isZh ? '返回顶部' : 'Back to top',
        };
    }, [locale]);

    useEffect(() => {
        trackAppEvent('note_view', {
            category: 'content',
            label: slug,
            metadata: { slug, locale },
        });
    }, [locale, slug]);

    useEffect(() => {
        const onScroll = () => {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            const ratio = total <= 0 ? 1 : Math.min(1, Math.max(0, window.scrollY / total));
            const nextProgress = Math.round(ratio * 100);
            setProgress(nextProgress);

            MILESTONES.forEach((milestone) => {
                if (nextProgress >= milestone && !firedMilestones.current.has(milestone)) {
                    firedMilestones.current.add(milestone);
                    trackAppEvent('read_progress', {
                        category: 'content',
                        label: slug,
                        value: milestone,
                        metadata: { slug, locale, milestone },
                    });
                }
            });
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [locale, slug]);

    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveHeadingId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '0px 0px -70% 0px',
                threshold: 0.1,
            }
        );

        headings.forEach((heading) => {
            const node = document.getElementById(heading.id);
            if (node) observer.observe(node);
        });

        return () => observer.disconnect();
    }, [headings]);

    return (
        <>
            <div
                className="fixed top-0 left-0 z-50 h-1 bg-primary-600 transition-[width] duration-150"
                style={{ width: `${progress}%` }}
            />

            <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-4">
                    <section className="card p-4">
                        <h2 className="text-sm font-semibold text-surface-900 mb-2">{labels.readingStats}</h2>
                        <div className="text-xs text-surface-600 space-y-1">
                            <p>{labels.estimated}: {readingMinutes} {labels.minutes}</p>
                            <p>{labels.words}: {wordCount}</p>
                            <p>Progress: {progress}%</p>
                        </div>
                    </section>

                    {headings.length > 0 && (
                        <section className="card p-4">
                            <h2 className="text-sm font-semibold text-surface-900 mb-2">{labels.toc}</h2>
                            <nav className="space-y-1">
                                {headings.map((heading) => (
                                    <a
                                        key={heading.id}
                                        href={`#${heading.id}`}
                                        className={`block text-xs leading-5 hover:text-primary-700 ${heading.level === 3 ? 'pl-3' : 'pl-0'} ${activeHeadingId === heading.id ? 'text-primary-700 font-semibold' : 'text-surface-600'
                                            }`}
                                    >
                                        {heading.text}
                                    </a>
                                ))}
                            </nav>
                        </section>
                    )}

                    <a
                        href="#top"
                        className="inline-flex text-xs text-primary-600 hover:text-primary-700"
                    >
                        {labels.backTop}
                    </a>
                </div>
            </aside>
        </>
    );
}
