import { setRequestLocale } from 'next-intl/server';
import AboutExperience from '@/components/about/AboutExperience';
import { getAboutProfileMedia } from '@/lib/about-profile-media';
import { getAboutContent, getAboutMetadata } from './content';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    return getAboutMetadata(locale);
}

export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const media = await getAboutProfileMedia();
    const content = getAboutContent(locale, media);

    return <AboutExperience locale={locale} content={content} />;
}
