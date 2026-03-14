'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { AboutPageContent } from './types';

interface AboutLifeModulesProps {
    locale: string;
    content: AboutPageContent;
}

export default function AboutLifeModules({ locale, content }: AboutLifeModulesProps) {
    const reduceMotion = useReducedMotion();
    const [activePreference, setActivePreference] = useState(0);
    const [activeWork, setActiveWork] = useState(0);
    const currentWork = content.works[activeWork];

    return (
        <section className="about-life-stack">
            <div className="about-grid about-grid--personality">
                <article className="about-bento-card about-hover-spring about-personality-card">
                    <span className="about-eyebrow">{content.personality.label}</span>
                    <div className="about-personality-card__content">
                        <div className="about-personality-card__copy">
                            <h3 className="about-personality-card__title">{content.personality.title}</h3>
                            <p className="about-personality-card__code">{content.personality.code}</p>
                            <p className="about-personality-card__note">
                                {content.personality.notePrefix}
                                <a href={content.personality.noteLinkHref} target="_blank" rel="noreferrer">
                                    {content.personality.noteLinkLabel}
                                </a>
                                {content.personality.noteSuffix}
                            </p>
                        </div>
                        <div className="about-personality-card__art">
                            <Image
                                src={content.personality.illustrationSrc}
                                alt={content.personality.illustrationAlt}
                                fill
                                className="object-contain"
                                sizes="360px"
                            />
                        </div>
                    </div>
                </article>

                <article className="about-bento-card about-hover-spring about-photo-card">
                    <span className="about-eyebrow">{content.personality.photoLabel}</span>
                    <div className="about-photo-card__media">
                        <Image
                            src={content.personality.photoSrc}
                            alt={content.personality.photoAlt}
                            fill
                            className="object-cover"
                            sizes="480px"
                        />
                    </div>
                </article>
            </div>

            <article className="about-bento-card about-hover-spring about-work-card">
                <div className="about-work-card__header">
                    <div>
                        <span className="about-eyebrow">{content.worksTitle}</span>
                        <h3 className="about-section-title about-section-title--compact">{content.worksTitle}</h3>
                    </div>
                    <div className="about-work-card__controls">
                        <button
                            type="button"
                            className="about-carousel-button"
                            onClick={() => setActiveWork((current) => (current === 0 ? content.works.length - 1 : current - 1))}
                            aria-label={locale === 'zh' ? '上一个作品' : 'Previous work'}
                        >
                            ←
                        </button>
                        <button
                            type="button"
                            className="about-carousel-button"
                            onClick={() => setActiveWork((current) => (current + 1) % content.works.length)}
                            aria-label={locale === 'zh' ? '下一个作品' : 'Next work'}
                        >
                            →
                        </button>
                    </div>
                </div>

                <div className="about-work-card__stage">
                    <div className="about-work-card__media">
                        <Image
                            src={currentWork.imageSrc}
                            alt={currentWork.imageAlt}
                            fill
                            className="object-cover"
                            sizes="900px"
                        />
                    </div>
                    <div className="about-work-card__body">
                        <span className="about-work-card__meta">{currentWork.meta}</span>
                        <h4>{currentWork.title}</h4>
                        <p>{currentWork.summary}</p>
                        {currentWork.href ? (
                            <Link href={currentWork.href} className="about-inline-link">
                                {locale === 'zh' ? '查看作品' : 'View work'}
                            </Link>
                        ) : null}
                    </div>
                </div>

                <div className="about-work-card__thumbs">
                    {content.works.map((item, index) => (
                        <button
                            key={item.title}
                            type="button"
                            className={`about-work-thumb ${index === activeWork ? 'is-active' : ''}`}
                            onClick={() => setActiveWork(index)}
                        >
                            <div className="about-work-thumb__image">
                                <Image
                                    src={item.imageSrc}
                                    alt={item.imageAlt}
                                    fill
                                    className="object-cover"
                                    sizes="150px"
                                />
                            </div>
                            <span>{item.title}</span>
                        </button>
                    ))}
                </div>
            </article>

            <div className="about-grid about-grid--games">
                {content.games.map((item) => (
                    <motion.article
                        key={item.imageAlt}
                        whileHover={reduceMotion ? undefined : { y: -4 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="about-bento-card about-hover-spring about-game-card"
                    >
                        <div className="about-game-card__media">
                            <Image
                                src={item.imageSrc}
                                alt={item.imageAlt}
                                fill
                                className="object-cover"
                                sizes="560px"
                            />
                        </div>
                        <span className="about-game-card__label">{item.label}</span>
                    </motion.article>
                ))}
            </div>

            <article className="about-bento-card about-hover-spring about-preference-card">
                <div className="about-preference-card__header">
                    <span className="about-eyebrow">{content.preferencesTitle}</span>
                    <h3 className="about-section-title about-section-title--compact">{content.preferencesTitle}</h3>
                </div>
                <div className="about-preference-panels">
                    {content.preferences.map((item, index) => {
                        const active = activePreference === index;

                        return (
                            <button
                                key={item.title}
                                type="button"
                                className={`about-preference-panel ${active ? 'is-active' : ''}`}
                                onMouseEnter={() => !reduceMotion && setActivePreference(index)}
                                onFocus={() => setActivePreference(index)}
                                onClick={() => setActivePreference(index)}
                            >
                                <div className="about-preference-panel__image">
                                    <Image
                                        src={item.imageSrc}
                                        alt={item.imageAlt}
                                        fill
                                        className="object-cover"
                                        sizes="280px"
                                    />
                                </div>
                                <div className="about-preference-panel__overlay" />
                                <div className="about-preference-panel__text">
                                    <span>{item.label}</span>
                                    <h4>{item.title}</h4>
                                    <p>{item.subtitle}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </article>

            <div className="about-grid about-grid--info">
                <article className="about-bento-card about-hover-spring about-stats-card">
                    <span className="about-eyebrow about-eyebrow--light">{content.info.statsTitle}</span>
                    <div className="about-stats-card__grid">
                        {content.info.stats.map((item) => (
                            <div key={item.label}>
                                <div className="about-stats-card__value">{item.value}</div>
                                <div className="about-stats-card__label">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="about-bento-card about-hover-spring about-about-card">
                    <div className="about-about-card__block">
                        <span className="about-eyebrow">{content.info.aboutTitle}</span>
                        <p>{content.info.aboutBody}</p>
                    </div>
                    <div className="about-about-card__block">
                        <span className="about-eyebrow">{content.info.educationTitle}</span>
                        <div className="about-chip-list">
                            {content.info.educationItems.map((item) => (
                                <span key={item}>{item}</span>
                            ))}
                        </div>
                    </div>
                    <div className="about-about-card__block">
                        <span className="about-eyebrow">{content.info.currentTitle}</span>
                        <div className="about-chip-list">
                            {content.info.currentItems.map((item) => (
                                <span key={item}>{item}</span>
                            ))}
                        </div>
                    </div>
                </article>
            </div>

            <article className="about-bento-card about-hover-spring about-route-card">
                <span className="about-eyebrow">{content.narrative.routeTitle}</span>
                <h3 className="about-section-title about-section-title--compact">{content.narrative.routeTitle}</h3>
                <p className="about-route-card__intro">{content.narrative.routeIntro}</p>
                <div className="about-route-card__list">
                    {content.narrative.routeItems.map((item) => (
                        <div key={item} className="about-route-chip">
                            {item}
                        </div>
                    ))}
                </div>
            </article>
        </section>
    );
}
