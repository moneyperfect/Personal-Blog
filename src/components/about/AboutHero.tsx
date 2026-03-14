'use client';

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import type { AboutHeroContent } from './types';

interface AboutHeroProps {
    locale: string;
    content: AboutHeroContent;
}

const BUBBLE_POSITIONS = [
    { side: 'left', top: '16%' },
    { side: 'left', top: '46%' },
    { side: 'left', top: '75%' },
    { side: 'right', top: '18%' },
    { side: 'right', top: '48%' },
    { side: 'right', top: '76%' },
] as const;

export default function AboutHero({ locale, content }: AboutHeroProps) {
    const reduceMotion = useReducedMotion();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 28, stiffness: 120, mass: 0.7 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);
    const avatarX = useTransform(springX, [-1, 1], [10, -10]);
    const avatarY = useTransform(springY, [-1, 1], [10, -10]);

    useEffect(() => {
        if (reduceMotion) return undefined;

        const handleMouseMove = (event: MouseEvent) => {
            const nX = (event.clientX / window.innerWidth) * 2 - 1;
            const nY = (event.clientY / window.innerHeight) * 2 - 1;
            mouseX.set(nX);
            mouseY.set(nY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY, reduceMotion]);

    return (
        <section className="about-hero-shell">
            <div className="about-hero-grid">
                <motion.article
                    whileHover={reduceMotion ? undefined : { y: -4 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="about-bento-card about-hover-spring about-hero-side"
                >
                    <span className="about-eyebrow">{content.introTitle}</span>
                    <h2 className="about-hero-side-title">{content.name}</h2>
                    <p className="about-hero-side-copy">{content.introBody}</p>
                    <div className="about-hero-bullet-list">
                        {content.introBullets.map((item) => (
                            <div key={item} className="about-hero-bullet">
                                {item}
                            </div>
                        ))}
                    </div>
                    <div className="about-hero-status">{content.status}</div>
                </motion.article>

                <div className="about-hero-center">
                    <span className="about-eyebrow">{content.eyebrow}</span>

                    <div className="about-hero-avatar-stage">
                        {content.floatingPills.slice(0, 6).map((item, index) => {
                            const config = BUBBLE_POSITIONS[index];
                            const pillStyle = {
                                '--bubble-top': config.top,
                            } as CSSProperties;

                            return (
                                <motion.span
                                    key={item}
                                    className={`about-bubble-pill about-bubble-pill--${config.side}`}
                                    style={pillStyle}
                                    animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
                                    transition={
                                        reduceMotion
                                            ? undefined
                                            : {
                                                duration: 3.4,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                                delay: index * 0.2,
                                            }
                                    }
                                >
                                    {item}
                                </motion.span>
                            );
                        })}

                        <motion.div
                            className="about-avatar-ring"
                            style={reduceMotion ? undefined : { x: avatarX, y: avatarY }}
                            whileHover={reduceMotion ? undefined : { scale: 1.035 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                        >
                            <Image
                                src="/about/avatar-demo.svg"
                                alt={locale === 'zh' ? '个人头像' : 'Avatar'}
                                fill
                                className="object-cover"
                                sizes="220px"
                                priority
                            />
                            <span className="about-avatar-online" />
                        </motion.div>
                    </div>

                    <h1 className="about-page-title">{content.name}</h1>
                    <p className="about-hero-tagline">{content.tagline}</p>

                    <div className="about-hero-cta">
                        <Link href={`/${locale}/contact`} className="about-btn about-btn--primary">
                            {content.primaryCta}
                        </Link>
                        <Link href={`/${locale}/work-with-me`} className="about-btn about-btn--secondary">
                            {content.secondaryCta}
                        </Link>
                    </div>
                </div>

                <motion.article
                    whileHover={reduceMotion ? undefined : { y: -4 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="about-bento-card about-hover-spring about-hero-side"
                >
                    <span className="about-eyebrow">{content.journeyTitle}</span>
                    <h2 className="about-hero-side-title">{content.journeyTitle}</h2>
                    <p className="about-hero-side-copy">{content.journeyBody}</p>
                    <div className="about-hero-journey-list">
                        {content.journeyItems.map((item, index) => (
                            <div key={item} className="about-hero-journey-item">
                                <span className="about-hero-journey-index">0{index + 1}</span>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </motion.article>
            </div>
        </section>
    );
}
