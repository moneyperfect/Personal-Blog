'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { AboutSkillContent } from './types';

interface AboutSkillRailProps {
    content: AboutSkillContent;
    locale: string;
}

export default function AboutSkillRail({ content, locale }: AboutSkillRailProps) {
    const reduceMotion = useReducedMotion();

    return (
        <section className="about-section-card">
            <div className="about-section-header">
                <div>
                    <span className="about-eyebrow">{content.title}</span>
                    <h2 className="about-section-title">{content.title}</h2>
                    <p className="about-section-copy">{content.intro}</p>
                </div>
                <span className="about-section-note">
                    {locale === 'zh' ? '滚动技能带悬停会暂停' : 'Hover pauses the marquee'}
                </span>
            </div>

            <div className="about-creator-marquee">
                <div className={`about-creator-track ${reduceMotion ? 'about-creator-track--static' : ''}`}>
                    {[0, 1].map((group) => (
                        <div key={group} className="about-creator-group" aria-hidden={group === 1}>
                            {content.marquee.map((item) => (
                                <div key={`${group}-${item.label}`} className="about-creator-pill">
                                    <span className="about-creator-pill__icon">{item.icon}</span>
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="about-skill-display-grid">
                {content.displayGroups.map((group) => (
                    <motion.article
                        key={group.title}
                        whileHover={reduceMotion ? undefined : { y: -6 }}
                        transition={{ duration: 0.24, ease: 'easeOut' }}
                        className="about-skill-display-card"
                    >
                        <div className="about-skill-display-card__top">
                            <span className="about-skill-display-card__icon">{group.icon}</span>
                            <div>
                                <h3 className="about-skill-display-card__title">{group.title}</h3>
                                <p className="about-skill-display-card__summary">{group.summary}</p>
                            </div>
                        </div>
                        <div className="about-skill-display-card__chips">
                            {group.items.map((item) => (
                                <span key={item} className="about-skill-display-card__chip">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </motion.article>
                ))}
            </div>
        </section>
    );
}
