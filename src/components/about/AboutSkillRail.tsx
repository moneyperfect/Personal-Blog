'use client';

import type { CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';
import { techStack } from './techStack';
import type { AboutSkillContent } from './types';

interface AboutSkillRailProps {
    content: AboutSkillContent;
}

export default function AboutSkillRail({ content }: AboutSkillRailProps) {
    const reduceMotion = useReducedMotion();

    return (
        <section className="about-skill-row">
            <article className="about-bento-card about-hover-spring about-skill-card">
                <span className="about-eyebrow">{content.label}</span>
                <h2 className="about-section-title about-section-title--compact">{content.title}</h2>
                <div className="about-skill-category-row">
                    {content.categories.map((item) => (
                        <span key={item}>{item}</span>
                    ))}
                </div>

                <div className="about-skill-grid-shell">
                    <div className={`about-skill-grid-track ${reduceMotion ? 'about-skill-grid-track--static' : ''}`}>
                        {[0, 1].map((group) => (
                            <div key={group} className="about-skill-grid" aria-hidden={group === 1}>
                                {techStack.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <div
                                            key={`${group}-${item.label}`}
                                            className="about-skill-tile"
                                            style={{ '--skill-brand': item.color } as CSSProperties}
                                        >
                                            <span className="about-skill-tile__icon" aria-hidden="true">
                                                <Icon />
                                            </span>
                                            <span className="about-skill-tile__label">{item.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </article>

            <article className="about-bento-card about-hover-spring about-career-card">
                <span className="about-eyebrow">{content.careerLabel}</span>
                <h2 className="about-section-title about-section-title--compact">{content.careerTitle}</h2>
                <div className="about-career-list">
                    {content.careerItems.map((item, index) => (
                        <div key={item} className="about-career-item">
                            <span className={`about-career-item__dot about-career-item__dot--${index % 3}`} />
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
                <p className="about-career-legend">{content.careerLegend}</p>
                <div className="about-career-progress">
                    <span className="about-career-progress__seg about-career-progress__seg--blue" />
                    <span className="about-career-progress__seg about-career-progress__seg--yellow" />
                    <span className="about-career-progress__seg about-career-progress__seg--green" />
                </div>
                <div className="about-career-years">
                    <span>{content.careerStart}</span>
                    <span>{content.careerEnd}</span>
                </div>
            </article>
        </section>
    );
}
