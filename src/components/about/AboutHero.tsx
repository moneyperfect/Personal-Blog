'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { AboutHeroContent } from './types';

interface AboutHeroProps {
    locale: string;
    content: AboutHeroContent;
}

/* 8 floating bubbles around the avatar — positions mirror the ref site layout */
const BUBBLE_ITEMS_ZH = [
    { label: '🎨 艺术创作发烧友', x: -170, y: -60 },
    { label: '💻 编程技巧分享者', x: -180, y: 20 },
    { label: '🏠 捕捉生活的瞬间', x: -160, y: 100 },
    { label: '📹 视频创作艺术家', x: -120, y: 170 },
    { label: '🔍 挖掘编程的秘密', x: 140, y: -60 },
    { label: '🏃 不放弃无限进步', x: 160, y: 20 },
    { label: '🧱 现实中唯唯诺诺', x: 150, y: 100 },
    { label: '💢 互联网重拳出击', x: 120, y: 170 },
];

const BUBBLE_ITEMS_JA = [
    { label: '🎨 クリエイティブ好き', x: -170, y: -60 },
    { label: '💻 コーディング共有', x: -180, y: 20 },
    { label: '🏠 日常のひとコマ', x: -160, y: 100 },
    { label: '📹 映像クリエイター', x: -120, y: 170 },
    { label: '🔍 コードの秘密を探求', x: 140, y: -60 },
    { label: '🏃 無限に前へ', x: 160, y: 20 },
    { label: '🧱 オフラインは控えめ', x: 150, y: 100 },
    { label: '💢 ネットでは全力', x: 120, y: 170 },
];

export default function AboutHero({ locale, content }: AboutHeroProps) {
    const reduceMotion = useReducedMotion();
    const bubbles = locale === 'zh' ? BUBBLE_ITEMS_ZH : BUBBLE_ITEMS_JA;

    return (
        <section>
            {/* ── Avatar + floating bubbles ── */}
            <div className="about-hero-avatar-ring">
                <div className="about-avatar-wrap">
                    <motion.div
                        whileHover={reduceMotion ? undefined : { scale: 1.08, rotate: -3 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="about-avatar-img"
                    >
                        <Image
                            src="/about/avatar-demo.svg"
                            alt="Avatar"
                            fill
                            className="object-cover"
                            sizes="160px"
                        />
                    </motion.div>
                    {/* online indicator */}
                    <span className="about-avatar-online" />
                </div>

                {/* floating bubble pills */}
                {bubbles.map((b, i) => (
                    <motion.span
                        key={b.label}
                        className="about-bubble-pill"
                        style={{ '--bx': `${b.x}px`, '--by': `${b.y}px` } as React.CSSProperties}
                        animate={
                            reduceMotion
                                ? undefined
                                : { y: [0, -6, 0] }
                        }
                        transition={
                            reduceMotion
                                ? undefined
                                : { duration: 3.4, repeat: Infinity, delay: i * 0.25, ease: 'easeInOut' }
                        }
                    >
                        {b.label}
                    </motion.span>
                ))}
            </div>

            {/* ── Page title ── */}
            <h1 className="about-page-title">
                {locale === 'zh' ? '关于 NAS' : 'About NAS'}
            </h1>

            {/* ── Three-column cards ── */}
            <div className="about-hero-grid">
                {/* Left card — dark identity */}
                <motion.article
                    whileHover={reduceMotion ? undefined : { y: -4 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="about-card about-card--dark"
                >
                    <p className="about-card__eyebrow about-card__eyebrow--light">
                        {locale === 'zh' ? '倘若生活太苦，我便往里加点糖 ✨' : '人生が苦いなら、砂糖を足せばいい ✨'}
                    </p>
                    <h2 className="about-card__name">{content.name}</h2>
                    <p className="about-card__tagline">{content.tagline}</p>
                </motion.article>

                {/* Right card — ideal / aspiration */}
                <motion.article
                    whileHover={reduceMotion ? undefined : { y: -4 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="about-card about-card--ideal"
                >
                    <p className="about-card__eyebrow">
                        {locale === 'zh' ? '理想' : '理想'}
                    </p>
                    <div className="about-ideal-text">
                        <span className="about-ideal-text__line">{locale === 'zh' ? '源于' : '源は'}</span>
                        <span className="about-ideal-text__line">
                            {locale === 'zh' ? '热爱而去 努力' : '情熱から 努力へ'}
                        </span>
                        <span className="about-ideal-text__line about-ideal-text__accent">
                            {locale === 'zh' ? '创作' : '創作'}
                        </span>
                    </div>
                </motion.article>
            </div>

            {/* ── CTA buttons ── */}
            <div className="about-hero-cta">
                <Link href={`/${locale}/contact`} className="about-btn about-btn--primary">
                    {content.primaryCta}
                </Link>
                <Link href={`/${locale}/work-with-me`} className="about-btn about-btn--secondary">
                    {content.secondaryCta}
                </Link>
            </div>
        </section>
    );
}
