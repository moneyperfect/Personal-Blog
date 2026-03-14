'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import type { AboutSupportContent } from './types';

interface AboutSupportWallProps {
    locale: string;
    content: AboutSupportContent;
}

export default function AboutSupportWall({ locale, content }: AboutSupportWallProps) {
    const reduceMotion = useReducedMotion();

    return (
        <section className="about-support-stack">
            <article className="about-bento-card about-hover-spring">
                <div className="about-section-header">
                    <div>
                        <span className="about-eyebrow">{content.title}</span>
                        <h3 className="about-section-title about-section-title--compact">{content.title}</h3>
                        <p className="about-section-copy">{content.intro}</p>
                    </div>
                </div>

                <div className="about-support-grid">
                    {content.supporters.map((item) => (
                        <motion.div
                            key={`${item.name}-${item.amount}`}
                            whileHover={reduceMotion ? undefined : { y: -4 }}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                            className="about-support-item"
                        >
                            <span className="about-support-name">{item.name}</span>
                            <span className="about-support-amount">{item.amount}</span>
                            <p className="about-support-msg">{item.note}</p>
                        </motion.div>
                    ))}
                </div>
            </article>

            <article className="about-bento-card about-hover-spring about-support-cta">
                <div>
                    <span className="about-eyebrow">{locale === 'zh' ? '下一步' : '次のステップ'}</span>
                    <h3 className="about-section-title about-section-title--compact">{content.ctaTitle}</h3>
                    <p className="about-section-copy">{content.ctaBody}</p>
                </div>

                <div className="about-hero-cta about-hero-cta--compact">
                    <Link href={`/${locale}/contact`} className="about-btn about-btn--primary">
                        {content.primaryCta}
                    </Link>
                    <Link href={`/${locale}/notes`} className="about-btn about-btn--secondary">
                        {content.secondaryCta}
                    </Link>
                </div>
            </article>
        </section>
    );
}
