'use client';

import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { techStack } from './techStack';
import type { AboutSkillContent } from './types';

interface AboutSkillRailProps {
    content: AboutSkillContent;
}

export default function AboutSkillRail({ content }: AboutSkillRailProps) {
    const reduceMotion = useReducedMotion();
    const cardRef = useRef<HTMLElement | null>(null);
    const [supportsHover, setSupportsHover] = useState(false);
    const [isSpotlit, setIsSpotlit] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return undefined;
        }

        const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
        const syncHoverCapability = () => setSupportsHover(mediaQuery.matches);

        syncHoverCapability();
        mediaQuery.addEventListener('change', syncHoverCapability);

        return () => mediaQuery.removeEventListener('change', syncHoverCapability);
    }, []);

    const handlePointerEnter = () => {
        if (!supportsHover || reduceMotion || !cardRef.current) {
            return;
        }

        cardRef.current.style.setProperty('--skill-spotlight-x', '50%');
        cardRef.current.style.setProperty('--skill-spotlight-y', '38%');
        setIsSpotlit(true);
    };

    const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
        if (!supportsHover || reduceMotion || !cardRef.current) {
            return;
        }

        const bounds = cardRef.current.getBoundingClientRect();
        const offsetX = event.clientX - bounds.left;
        const offsetY = event.clientY - bounds.top;

        cardRef.current.style.setProperty('--skill-spotlight-x', `${offsetX}px`);
        cardRef.current.style.setProperty('--skill-spotlight-y', `${offsetY}px`);
    };

    const handlePointerLeave = () => {
        if (!supportsHover || reduceMotion) {
            return;
        }

        setIsSpotlit(false);
    };

    return (
        <section className="about-skill-row">
            <article
                ref={cardRef}
                className={`about-bento-card about-hover-spring about-skill-card ${isSpotlit ? 'is-spotlit' : ''}`}
                onPointerEnter={handlePointerEnter}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
            >
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
