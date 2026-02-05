import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { getAllNotes } from '@/lib/mdx';
import { Locale } from '@/i18n/routing';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    return {
        title: locale === 'zh' ? '笔记' : 'ノート',
    };
}

export default async function NotesPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const notes = getAllNotes(locale as Locale);
    const title = locale === 'zh' ? '笔记' : 'ノート';
    const description = locale === 'zh'
        ? '产品思考、创业心得与技术分享'
        : '製品思考、起業の知見、技術共有';

    return (
        <div className="py-12 sm:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-4">
                        {title}
                    </h1>
                    <p className="text-lg text-surface-600">{description}</p>
                </div>

                <div className="space-y-6">
                    {notes.map((note) => (
                        <Link
                            key={note.slug}
                            href={`/${locale}/notes/${note.slug}`}
                            className="group block bg-white rounded-google-lg border border-surface-300 p-6 hover:shadow-elevated-1 transition-all"
                        >
                            <div className="flex flex-wrap gap-2 mb-2">
                                {note.frontmatter.tags.map((tag) => (
                                    <span key={tag} className="text-xs text-surface-500">#{tag}</span>
                                ))}
                            </div>
                            <h2 className="text-xl font-semibold text-surface-900 group-hover:text-primary-600 mb-2">
                                {note.frontmatter.title}
                            </h2>
                            <p className="text-surface-600 line-clamp-2">{note.frontmatter.summary}</p>
                            <span className="text-sm text-surface-500 mt-2 block">
                                {note.frontmatter.updatedAt}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
