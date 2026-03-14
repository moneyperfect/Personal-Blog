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
                <p className="about-skill-summary">{content.summary}</p>

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
                    {content.careerTimeline.map((item) => (
                        <div
                            key={item.date}
                            className={`about-career-entry about-career-entry--${item.tone}`}
                            style={{ '--career-progress': item.progress } as CSSProperties}
                        >
                            <div className={`about-career-entry__dot about-career-entry__dot--${item.tone}`} />
                            <div className="about-career-entry__copy">
                                <div className="about-career-entry__date">{item.date}</div>
                                <div className="about-career-entry__title">{item.title}</div>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="about-career-progress">
                    <span className="about-career-progress__legend">{content.careerLegend}</span>
                    <div className="about-career-progress__line">
                        <div className="about-career-progress__rail" />
                        {content.careerTimeline.map((item) => (
                            <span
                                key={item.date}
                                className={`about-career-progress__marker about-career-progress__marker--${item.tone}`}
                                style={{ '--career-progress': item.progress } as CSSProperties}
                                aria-hidden="true"
                            />
                        ))}
                    </div>
                </div>

                <div className="about-career-years">
                    <span>{content.careerStart}</span>
                    <span>{content.careerEnd}</span>
                </div>
            </article>
        </section>
    );
}
