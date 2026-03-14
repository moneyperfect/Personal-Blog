'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRef, useState } from 'react';
import AboutHero from './AboutHero';
import AboutLifeModules from './AboutLifeModules';
import AboutSkillRail from './AboutSkillRail';
import AboutSupportWall from './AboutSupportWall';
import type { AboutPageContent } from './types';

interface AboutExperienceProps {
    locale: string;
    content: AboutPageContent;
}

interface Particle {
    id: string;
    x: number;
    y: number;
    dx: number;
    dy: number;
    size: number;
    hue: number;
    duration: number;
}

const STAR_FIELD = [
    { left: '6%', top: '12%', size: 4, delay: 0.1 },
    { left: '18%', top: '25%', size: 3, delay: 0.6 },
    { left: '34%', top: '15%', size: 2, delay: 0.3 },
    { left: '48%', top: '31%', size: 4, delay: 0.8 },
    { left: '62%', top: '9%', size: 3, delay: 0.4 },
    { left: '79%', top: '18%', size: 5, delay: 0.7 },
    { left: '91%', top: '29%', size: 3, delay: 0.9 },
    { left: '15%', top: '78%', size: 2, delay: 0.5 },
    { left: '28%', top: '84%', size: 4, delay: 1.2 },
    { left: '58%', top: '81%', size: 3, delay: 0.2 },
    { left: '84%', top: '74%', size: 2, delay: 1.4 },
];

export default function AboutExperience({ locale, content }: AboutExperienceProps) {
    const reduceMotion = useReducedMotion();
    const rootRef = useRef<HTMLDivElement>(null);
    const [particles, setParticles] = useState<Particle[]>([]);

    const spawnParticles = (event: React.PointerEvent<HTMLDivElement>) => {
        if (reduceMotion || !rootRef.current || event.pointerType === 'touch') return;

        const rect = rootRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const burst = Array.from({ length: 9 }).map((_, index) => {
            const angle = (Math.PI * 2 * index) / 9;
            return {
                id: `${Date.now()}-${index}`,
                x,
                y,
                dx: Math.cos(angle) * (22 + index * 4),
                dy: Math.sin(angle) * (22 + index * 4),
                size: 3 + (index % 3),
                hue: 198 + index * 10,
                duration: 0.42 + index * 0.03,
            };
        });

        setParticles((current) => [...current, ...burst].slice(-70));
        window.setTimeout(() => {
            setParticles((current) => current.filter((particle) => !burst.some((item) => item.id === particle.id)));
        }, 850);
    };

    return (
        <div
            ref={rootRef}
            className="relative overflow-hidden bg-[linear-gradient(180deg,#faf8f3_0%,#f5f8fc_28%,#f8fbff_100%)] text-surface-900"
            onPointerDown={spawnParticles}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                    backgroundImage: [
                        'radial-gradient(circle at 12% 18%, rgba(147,197,253,0.28), transparent 28%)',
                        'radial-gradient(circle at 84% 14%, rgba(244,114,182,0.14), transparent 22%)',
                        'radial-gradient(circle at 58% 46%, rgba(96,165,250,0.10), transparent 28%)',
                    ].join(','),
                }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-25"
                style={{
                    backgroundImage: [
                        'linear-gradient(rgba(171,184,201,0.22) 1px, transparent 1px)',
                        'linear-gradient(90deg, rgba(171,184,201,0.22) 1px, transparent 1px)',
                    ].join(','),
                    backgroundSize: '68px 68px',
                    maskImage: 'radial-gradient(circle at center, black 36%, transparent 92%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 36%, transparent 92%)',
                }}
            />

            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                {STAR_FIELD.map((star) => (
                    <motion.span
                        key={`${star.left}-${star.top}`}
                        className="absolute rounded-full bg-white/90 shadow-[0_0_12px_rgba(163,191,223,0.45)]"
                        style={{ left: star.left, top: star.top, width: star.size, height: star.size }}
                        animate={reduceMotion ? undefined : { opacity: [0.25, 0.9, 0.3], scale: [1, 1.7, 1] }}
                        transition={reduceMotion ? undefined : { duration: 3.2, repeat: Infinity, delay: star.delay }}
                    />
                ))}
            </div>

            <AnimatePresence>
                {particles.map((particle) => (
                    <motion.span
                        key={particle.id}
                        className="pointer-events-none absolute rounded-full"
                        style={{
                            left: particle.x,
                            top: particle.y,
                            width: particle.size,
                            height: particle.size,
                            backgroundColor: `hsla(${particle.hue}, 96%, 68%, 1)`,
                            boxShadow: `0 0 14px hsla(${particle.hue}, 96%, 68%, 0.55)`,
                        }}
                        initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
                        animate={{ x: particle.dx, y: particle.dy, opacity: 0, scale: 0.25 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: particle.duration, ease: 'easeOut' }}
                    />
                ))}
            </AnimatePresence>

            <div className="page-container page-width py-10 sm:py-14">
                <AboutHero locale={locale} content={content.hero} />
                <AboutSkillRail locale={locale} content={content.skills} />
                <AboutLifeModules locale={locale} personality={content.personality} info={content.info} narrative={content.narrative} />
                <AboutSupportWall locale={locale} content={content.support} />
            </div>
        </div>
    );
}
