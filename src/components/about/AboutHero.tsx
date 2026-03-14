'use client';

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useEffect } from 'react';
import type { AboutHeroContent } from './types';

interface AboutHeroProps {
    locale: string;
    content: AboutHeroContent;
}

export default function AboutHero({ locale, content }: AboutHeroProps) {
    const reduceMotion = useReducedMotion();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { damping: 24, stiffness: 140, mass: 0.7 });
    const springY = useSpring(mouseY, { damping: 24, stiffness: 140, mass: 0.7 });
    const avatarRotate = useTransform(springX, [-1, 1], [-2, 2]);
    const avatarY = useTransform(springY, [-1, 1], [5, -5]);

    useEffect(() => {
        if (reduceMotion) return undefined;

        const handleMove = (event: MouseEvent) => {
            const nextX = (event.clientX / window.innerWidth) * 2 - 1;
            const nextY = (event.clientY / window.innerHeight) * 2 - 1;
            mouseX.set(nextX);
            mouseY.set(nextY);
        };

        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, [mouseX, mouseY, reduceMotion]);

    const leftPills = content.floatingPills.slice(0, 3);
    const rightPills = content.floatingPills.slice(3, 6);

    return (
        <section className="about-hero-shell">
            <div className="about-avatar-area">
                <div className="about-avatar-pills about-avatar-pills--left">
                    {leftPills.map((item, index) => (
                        <motion.span
                            key={item}
                            className="about-bubble-pill"
                            animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
                            transition={
                                reduceMotion
                                    ? undefined
                                    : { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }
                            }
                        >
                            {item}
                        </motion.span>
                    ))}
                </div>

                <motion.div
                    className="about-avatar-wrap"
                    style={reduceMotion ? undefined : { rotate: avatarRotate, y: avatarY }}
                    whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                >
                    <div className="about-avatar-ring">
                        <Image
                            src="/about/avatar-demo.svg"
                            alt={locale === 'zh' ? '头像' : 'Avatar'}
                            fill
                            className="object-cover"
                            sizes="240px"
                            priority
                        />
                    </div>
                    <span className="about-avatar-online" />
                </motion.div>

                <div className="about-avatar-pills about-avatar-pills--right">
                    {rightPills.map((item, index) => (
                        <motion.span
                            key={item}
                            className="about-bubble-pill"
                            animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
                            transition={
                                reduceMotion
                                    ? undefined
                                    : { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 + 0.4 }
                            }
                        >
                            {item}
                        </motion.span>
                    ))}
                </div>
            </div>

            <h1 className="about-page-title">{content.pageTitle}</h1>

            <div className="about-hero-card-grid">
                <article className="about-bento-card about-hover-spring about-card-dark">
                    <span className="about-eyebrow about-eyebrow--light">{content.aboutKicker}</span>
                    <h2 className="about-card-dark__title">{content.aboutTitle}</h2>
                    <p className="about-card-dark__subtitle">{content.aboutSubtitle}</p>
                </article>

                <article className="about-bento-card about-hover-spring about-card-ideal">
                    <span className="about-eyebrow">{content.idealLabel}</span>
                    <div className="about-ideal-lines">
                        {content.idealLines.map((line, index) => (
                            <span key={line} className={index === content.idealLines.length - 1 ? 'is-accent' : undefined}>
                                {line}
                            </span>
                        ))}
                    </div>
                </article>
            </div>
        </section>
    );
}
