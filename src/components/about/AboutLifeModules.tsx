'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { AboutMediaCard, AboutPageContent } from './types';

interface AboutLifeModulesProps {
    locale: string;
    content: AboutPageContent;
}

function AboutMediaLink({ card }: { card: AboutMediaCard }) {
    if (card.href) {
        return (
            <Link href={card.href} className="about-media-link">
                {card.caption ?? 'Open'}
            </Link>
        );
    }

    return null;
}

export default function AboutLifeModules({ locale, content }: AboutLifeModulesProps) {
    const reduceMotion = useReducedMotion();
    const [activeAnime, setActiveAnime] = useState(0);
    const [activeWork, setActiveWork] = useState(0);
    const work = content.works[activeWork];

    return (
        <section className="about-life-stack">
            <article className="about-bento-card about-hover-spring about-mbti-feature">
                <div className="about-mbti-feature__copy">
                    <span className="about-eyebrow">{content.personality.title}</span>
                    <h2 className="about-section-title">
                        {content.personality.mbtiLabel}{' '}
                        <span className="about-mbti-code">{content.personality.mbti}</span>
                    </h2>
                    <p className="about-section-copy">{content.personality.intro}</p>
                    <div className="about-mbti-note">{content.personality.mbtiSummary}</div>
                </div>
                <div className="about-mbti-feature__photo">
                    <div className="about-media-frame about-media-frame--portrait">
                        <Image
                            src="/about/portrait-demo.svg"
                            alt={content.personality.photoTitle}
                            fill
                            className="object-cover"
                            sizes="360px"
                        />
                    </div>
                    <div className="about-photo-caption">
                        <span className="about-eyebrow">{content.personality.photoTitle}</span>
                        <p>{content.personality.photoBody}</p>
                    </div>
                </div>
            </article>

            <div className="about-grid about-grid--talent">
                <article className="about-bento-card about-hover-spring">
                    <span className="about-eyebrow">{content.personality.talentsTitle}</span>
                    <h3 className="about-section-title about-section-title--compact">
                        {content.personality.talentsTitle}
                    </h3>
                    <p className="about-section-copy">{content.personality.talentsIntro}</p>
                    <div className="about-talent-list">
                        {content.personality.talents.map((item) => (
                            <div key={item.title} className="about-talent-item">
                                <h4>{item.title}</h4>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="about-bento-card about-hover-spring about-work-feature">
                    <div className="about-work-feature__header">
                        <div>
                            <span className="about-eyebrow">{content.worksTitle}</span>
                            <h3 className="about-section-title about-section-title--compact">{content.worksTitle}</h3>
                            <p className="about-section-copy">{content.worksIntro}</p>
                        </div>
                        <div className="about-carousel-controls">
                            <button
                                type="button"
                                className="about-carousel-button"
                                onClick={() =>
                                    setActiveWork((current) =>
                                        current === 0 ? content.works.length - 1 : current - 1,
                                    )
                                }
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

                    <div className="about-work-feature__stage">
                        <div className="about-media-frame about-media-frame--work">
                            <Image
                                src={work.imageSrc}
                                alt={work.imageAlt}
                                fill
                                className="object-cover"
                                sizes="680px"
                            />
                        </div>
                        <div className="about-work-feature__body">
                            <span className="about-work-meta">{work.meta}</span>
                            <h4>{work.title}</h4>
                            <p>{work.summary}</p>
                            {work.href ? (
                                <Link href={work.href} className="about-media-link">
                                    {locale === 'zh' ? '查看作品' : 'View work'}
                                </Link>
                            ) : null}
                        </div>
                    </div>

                    <div className="about-work-thumbnails">
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
                                        sizes="120px"
                                    />
                                </div>
                                <span>{item.title}</span>
                            </button>
                        ))}
                    </div>
                </article>
            </div>

            <div className="about-grid about-grid--games">
                {content.games.map((game) => (
                    <motion.article
                        key={game.title}
                        whileHover={reduceMotion ? undefined : { y: -5 }}
                        transition={{ duration: 0.24, ease: 'easeOut' }}
                        className="about-bento-card about-hover-spring about-game-card"
                    >
                        <div className="about-media-frame about-media-frame--game">
                            <Image
                                src={game.imageSrc}
                                alt={game.imageAlt}
                                fill
                                className="object-cover"
                                sizes="480px"
                            />
                        </div>
                        <div className="about-game-card__body">
                            <span className="about-eyebrow">{game.tag}</span>
                            <h3>{game.title}</h3>
                            <p>{game.summary}</p>
                            {game.href ? (
                                <Link href={game.href} className="about-media-link">
                                    {locale === 'zh' ? '查看详情' : 'Open detail'}
                                </Link>
                            ) : null}
                        </div>
                    </motion.article>
                ))}
            </div>

            <article className="about-bento-card about-hover-spring">
                <div className="about-section-header">
                    <div>
                        <span className="about-eyebrow">{content.animeTitle}</span>
                        <h3 className="about-section-title about-section-title--compact">{content.animeTitle}</h3>
                        <p className="about-section-copy">{content.animeIntro}</p>
                    </div>
                </div>
                <div className="about-anime-container">
                    {content.anime.map((item, index) => {
                        const isActive = activeAnime === index;

                        return (
                            <button
                                key={item.title}
                                type="button"
                                className={`about-anime-panel ${isActive ? 'is-active' : ''}`}
                                onMouseEnter={() => !reduceMotion && setActiveAnime(index)}
                                onFocus={() => setActiveAnime(index)}
                                onClick={() => setActiveAnime(index)}
                            >
                                <div className="about-anime-bg">
                                    <Image
                                        src={item.imageSrc}
                                        alt={item.imageAlt}
                                        fill
                                        className="object-cover"
                                        sizes="260px"
                                    />
                                </div>
                                <div className="about-anime-gradient" />
                                <div className="about-anime-text">
                                    <span>{item.tag ?? (locale === 'zh' ? '爱好番剧' : 'Anime')}</span>
                                    <h4>{item.title}</h4>
                                    <p>{item.description}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </article>

            <div className="about-grid about-grid--media">
                {[content.musicCard, content.focusCard].map((card) => (
                    <article key={card.title} className="about-bento-card about-hover-spring about-media-card">
                        <div className="about-media-frame about-media-frame--media">
                            <Image
                                src={card.imageSrc}
                                alt={card.imageAlt}
                                fill
                                className="object-cover"
                                sizes="480px"
                            />
                        </div>
                        <div className="about-media-card__body">
                            <span className="about-eyebrow">{card.tag}</span>
                            <h3>{card.title}</h3>
                            <p>{card.description}</p>
                            <AboutMediaLink card={card} />
                        </div>
                    </article>
                ))}
            </div>

            <div className="about-grid about-grid--info">
                <article className="about-bento-card about-hover-spring about-data-panel">
                    <span className="about-eyebrow">{content.info.statsTitle}</span>
                    <div className="about-data-grid">
                        {content.info.stats.map((item) => (
                            <div key={item.label}>
                                <div className="about-data-val">{item.value}</div>
                                <div className="about-data-label">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="about-bento-card about-hover-spring about-media-card">
                    <div className="about-media-frame about-media-frame--map">
                        <Image
                            src="/about/map-demo.svg"
                            alt={content.info.mapTitle}
                            fill
                            className="object-cover"
                            sizes="420px"
                        />
                    </div>
                    <div className="about-media-card__body">
                        <span className="about-eyebrow">{content.info.mapTitle}</span>
                        <h3>{content.info.mapTitle}</h3>
                        <p>{content.info.mapBody}</p>
                    </div>
                </article>

                <article className="about-bento-card about-hover-spring about-info-card">
                    <div>
                        <span className="about-eyebrow">{content.info.identityTitle}</span>
                        <p className="about-info-card__copy">{content.info.identityBody}</p>
                    </div>
                    <div>
                        <span className="about-eyebrow">{content.info.educationTitle}</span>
                        <div className="about-inline-list">
                            {content.info.educationItems.map((item) => (
                                <span key={item}>{item}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <span className="about-eyebrow">{content.info.currentTitle}</span>
                        <div className="about-inline-list">
                            {content.info.currentItems.map((item) => (
                                <span key={item}>{item}</span>
                            ))}
                        </div>
                    </div>
                </article>
            </div>

            <div className="about-grid about-grid--narrative">
                <article className="about-bento-card about-hover-spring">
                    <span className="about-eyebrow">{content.narrative.routeTitle}</span>
                    <h3 className="about-section-title about-section-title--compact">{content.narrative.routeTitle}</h3>
                    <p className="about-section-copy">{content.narrative.routeIntro}</p>
                    <div className="about-route-list">
                        {content.narrative.routeItems.map((item) => (
                            <div key={`${item.stage}-${item.title}`} className="about-route-item">
                                <span className="about-route-item__stage">{item.stage}</span>
                                <div>
                                    <h4>{item.title}</h4>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="about-bento-card about-hover-spring about-pact-card">
                    <span className="about-eyebrow">{content.narrative.pactTitle}</span>
                    <h3 className="about-section-title about-section-title--compact">{content.narrative.pactTitle}</h3>
                    <p className="about-section-copy">{content.narrative.pactIntro}</p>
                    <div className="about-pact-progress">
                        <span />
                    </div>
                    <div className="about-inline-list">
                        {content.narrative.pactItems.map((item) => (
                            <span key={item}>{item}</span>
                        ))}
                    </div>
                </article>
            </div>
        </section>
    );
}
