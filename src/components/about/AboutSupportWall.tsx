'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { AboutSupportContent } from './types';

interface AboutSupportWallProps {
    locale: string;
    content: AboutSupportContent;
}

const AMOUNT_COLORS = [
    'about-amount--green',
    'about-amount--red',
    'about-amount--blue',
    'about-amount--orange',
    'about-amount--purple',
    'about-amount--pink',
];

export default function AboutSupportWall({ locale, content }: AboutSupportWallProps) {
    const reduceMotion = useReducedMotion();
    const sectionLabel = locale === 'zh' ? '致谢' : '感謝';

    return (
        <section className="about-support-section">
            {/* ── Support list card ── */}
            <div className="about-support-card">
                <div className="about-support-header">
                    <div>
                        <p className="about-card__eyebrow">{sectionLabel}</p>
                        <h2 className="about-support-header__title">{content.title}</h2>
                        <p style={{ fontSize: 14, color: '#666', marginTop: 8 }}>{content.intro}</p>
                    </div>
                    <button type="button" className="about-support-donate-btn">
                        ❤️ {locale === 'zh' ? '赞赏作者' : '応援する'}
                    </button>
                </div>

                <div className="about-support-grid">
                    {content.supporters.map((s, i) => (
                        <motion.div
                            key={`${s.name}-${s.amount}`}
                            whileHover={reduceMotion ? undefined : { y: -2 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="about-supporter-item"
                        >
                            <p className="about-supporter-item__name">{s.name}</p>
                            <span className={`about-supporter-item__amount ${AMOUNT_COLORS[i % AMOUNT_COLORS.length]}`}>
                                💰 {s.amount}
                            </span>
                            <p className="about-supporter-item__date">
                                {s.note}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ── CTA row ── */}
            <div className="about-hero-cta" style={{ marginTop: 24 }}>
                <Link href={`/${locale}/contact`} className="about-btn about-btn--primary">
                    {content.primaryCta}
                </Link>
                <Link href={`/${locale}/notes`} className="about-btn about-btn--secondary">
                    {content.secondaryCta}
                </Link>
            </div>

            {/* ── Footer signature ── */}
            <div className="about-footer-sign">
                <div className="about-footer-sign__avatar">
                    <Image src="/about/avatar-demo.svg" alt="Avatar" width={64} height={64} />
                </div>
                <p className="about-footer-sign__text">
                    {locale === 'zh' ? '这是我的博客 / This is my Blog' : 'これは私のブログです'}
                </p>
                <p className="about-footer-sign__name">NAS</p>
                <p className="about-footer-sign__quote">
                    {locale === 'zh'
                        ? '只有迎风，风筝才能飞得更高。'
                        : '風に向かってこそ、凧はもっと高く飛べる。'}
                </p>
            </div>
        </section>
    );
}
