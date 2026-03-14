'use client';

import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import IntjArchitectIllustration from './IntjArchitectIllustration';
import type { AboutPageContent } from './types';

interface AboutLifeModulesProps {
    locale: string;
    content: AboutPageContent;
}

export default function AboutLifeModules({ locale, content }: AboutLifeModulesProps) {
    const reduceMotion = useReducedMotion();
    const artControls = useAnimationControls();
    const [activePreference, setActivePreference] = useState(0);
    const [activeWork, setActiveWork] = useState(0);
    const currentWork = content.works[activeWork];
    const copy =
        locale === 'zh'
            ? {
                  home: '首页',
                  email: '邮箱',
                  douyin: '抖音',
                  previousWork: '上一个作品',
                  nextWork: '下一个作品',
                  viewWork: '查看作品',
                  profileLinks: '联系与主页链接',
              }
            : {
                  home: 'ホーム',
                  email: 'メール',
                  douyin: '抖音',
                  previousWork: '前の作品',
                  nextWork: '次の作品',
                  viewWork: '作品を見る',
                  profileLinks: 'プロフィールリンク',
              };
    const footerLinks = [
        {
            key: 'home',
            href: `/${locale}`,
            label: copy.home,
            icon: <HomeIcon />,
            kind: 'internal',
        },
        {
            key: 'email',
            href: 'mailto:leizhen2046@gmail.com',
            label: copy.email,
            icon: <MailIcon />,
            kind: 'mail',
        },
        {
            key: 'github',
            href: 'https://github.com/moneyperfect',
            label: 'GitHub',
            icon: <GitHubIcon />,
            kind: 'external',
        },
        {
            key: 'douyin',
            href: 'https://v.douyin.com/BrWWZQDifn8/',
            label: copy.douyin,
            icon: <DouyinIcon />,
            kind: 'external',
        },
    ];

    const handleArtHoverStart = () => {
        if (reduceMotion) return;

        void artControls.start({
            rotate: -15,
            y: 0,
            transition: { type: 'spring', stiffness: 220, damping: 18, mass: 0.8 },
        });
    };

    const handleArtHoverEnd = () => {
        if (reduceMotion) return;

        void artControls.start({
            rotate: 0,
            y: [0, -10, 0],
            transition: {
                rotate: { type: 'spring', stiffness: 220, damping: 18, mass: 0.8 },
                y: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
            },
        });
    };

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
                            <motion.div
                                className="about-personality-card__artInner"
                                initial={{ rotate: 0, y: 0 }}
                                animate={artControls}
                                style={reduceMotion ? undefined : { transformOrigin: '56% 90%' }}
                                onHoverStart={handleArtHoverStart}
                                onHoverEnd={handleArtHoverEnd}
                            >
                                <IntjArchitectIllustration className="about-personality-card__illustration" />
                            </motion.div>
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
                            aria-label={copy.previousWork}
                        >
                            ←
                        </button>
                        <button
                            type="button"
                            className="about-carousel-button"
                            onClick={() => setActiveWork((current) => (current + 1) % content.works.length)}
                            aria-label={copy.nextWork}
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
                                {copy.viewWork}
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

            <div className="about-link-row" aria-label={copy.profileLinks}>
                {footerLinks.map((item) =>
                    item.kind === 'internal' ? (
                        <Link
                            key={item.key}
                            href={item.href}
                            className="about-link-icon"
                            aria-label={item.label}
                            title={item.label}
                        >
                            {item.icon}
                        </Link>
                    ) : (
                        <a
                            key={item.key}
                            href={item.href}
                            target={item.kind === 'external' ? '_blank' : undefined}
                            rel={item.kind === 'external' ? 'noreferrer' : undefined}
                            className="about-link-icon"
                            aria-label={item.label}
                            title={item.label}
                        >
                            {item.icon}
                        </a>
                    ),
                )}
            </div>
        </section>
    );
}

function HomeIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="currentColor"
                d="M12 3.4 4 9.7V20a1 1 0 0 0 1 1h4.8a1 1 0 0 0 1-1v-4.5h2.4V20a1 1 0 0 0 1 1H19a1 1 0 0 0 1-1V9.7l-8-6.3Z"
            />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="currentColor"
                d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Zm2 .5 6 4.5L18 7H6Zm12 2.5-5.4 4.04a1 1 0 0 1-1.2 0L6 9.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8Z"
            />
        </svg>
    );
}

function GitHubIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="currentColor"
                d="M12 .7a11.3 11.3 0 0 0-3.57 22.02c.56.1.77-.24.77-.55v-1.93c-3.13.68-3.8-1.34-3.8-1.34-.5-1.3-1.24-1.64-1.24-1.64-1.01-.7.08-.69.08-.69 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.2 3.23.92.1-.72.39-1.2.7-1.48-2.5-.28-5.13-1.25-5.13-5.58 0-1.23.44-2.24 1.15-3.03-.12-.28-.5-1.42.1-2.95 0 0 .95-.3 3.1 1.16a10.75 10.75 0 0 1 5.64 0c2.15-1.46 3.1-1.16 3.1-1.16.6 1.53.22 2.67.1 2.95.72.79 1.15 1.8 1.15 3.03 0 4.34-2.64 5.3-5.15 5.57.4.35.77 1.04.77 2.1v3.12c0 .31.2.66.78.55A11.3 11.3 0 0 0 12 .7Z"
            />
        </svg>
    );
}

function DouyinIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="currentColor"
                d="M14.4 2.8c.46 2.3 1.84 4.1 3.98 5.06v2.54a8.34 8.34 0 0 1-3.25-1.03v5.44c0 3.8-3.03 6.5-6.7 6.5A6.52 6.52 0 0 1 2 14.77c0-3.6 2.9-6.57 6.55-6.57.39 0 .77.04 1.15.12v2.72a3.84 3.84 0 0 0-1.15-.18 3.88 3.88 0 0 0-3.9 3.9 3.83 3.83 0 0 0 3.78 3.9c2.08 0 3.92-1.5 3.92-3.77V2.8h2.05Z"
            />
        </svg>
    );
}
