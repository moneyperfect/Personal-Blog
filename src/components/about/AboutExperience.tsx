'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';

export interface AboutExperienceContent {
    hero: {
        eyebrow: string;
        title: string;
        subtitle: string;
        description: string;
        primaryCta: string;
        secondaryCta: string;
        status: string;
    };
    labels: string[];
    stats: Array<{ value: string; label: string }>;
    timelineTitle: string;
    timelineIntro: string;
    timeline: Array<{ year: string; title: string; description: string }>;
    capabilityTitle: string;
    capabilityIntro: string;
    capabilities: Array<{ title: string; description: string; accent: string }>;
    fragmentsTitle: string;
    fragmentsIntro: string;
    fragments: Array<{ title: string; description: string }>;
    cta: {
        title: string;
        description: string;
        primary: string;
        secondary: string;
    };
}

interface AboutExperienceProps {
    locale: string;
    content: AboutExperienceContent;
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
    { left: '18%', top: '28%', size: 3, delay: 0.6 },
    { left: '31%', top: '16%', size: 2, delay: 0.3 },
    { left: '44%', top: '34%', size: 4, delay: 0.8 },
    { left: '57%', top: '8%', size: 3, delay: 0.4 },
    { left: '68%', top: '24%', size: 2, delay: 1.1 },
    { left: '79%', top: '18%', size: 5, delay: 0.7 },
    { left: '91%', top: '30%', size: 3, delay: 0.9 },
    { left: '13%', top: '72%', size: 2, delay: 0.5 },
    { left: '27%', top: '82%', size: 4, delay: 1.2 },
    { left: '61%', top: '78%', size: 3, delay: 0.2 },
    { left: '84%', top: '70%', size: 2, delay: 1.4 },
];

function joinClasses(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ');
}

export default function AboutExperience({ locale, content }: AboutExperienceProps) {
    const reduceMotion = useReducedMotion();
    const rootRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const [pointer, setPointer] = useState({ x: 0, y: 0 });
    const [particles, setParticles] = useState<Particle[]>([]);
    const { scrollYProgress } = useScroll({
        target: rootRef,
        offset: ['start start', 'end end'],
    });

    const heroGlowY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
    const orbitY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
    const orbitRotate = useTransform(scrollYProgress, [0, 1], [0, 24]);

    const labelCards = useMemo(
        () => content.labels.map((label, index) => ({ id: `${label}-${index}`, label })),
        [content.labels]
    );
    const chromeCopy = locale === 'zh'
        ? {
            identity: '个人信号',
            profileTitle: '高动态个人档案',
            profileSubtitle: '视差、光晕、分层 reveal 与细腻的交互反馈。',
            hover: '悬停反馈',
            interactive: '交互层',
            motionTitle: '动效要有层次，而不是噪音。',
            motionBody: '这个页面使用了鼠标视差、分层光效、卡片浮起、滚动 reveal 和点击粒子，同时依然保持轻量 DOM 与移动端可用性。',
            stack: ['动态渐变背景', 'Hover 深度反馈', '身份信息信号卡', 'Reduced Motion 降级'],
        }
        : {
            identity: 'Identity Signal',
            profileTitle: 'Motion-rich profile',
            profileSubtitle: 'Parallax, glow, layered reveal, and tactile feedback.',
            hover: 'Hover signal',
            interactive: 'Interactive Layer',
            motionTitle: 'Motion with depth, not noise.',
            motionBody: 'This page uses pointer parallax, layered glow, hover lift, scroll reveal, and click particles, while still keeping the DOM light enough for mobile.',
            stack: ['Dynamic gradients', 'Depth on hover', 'Identity signal card', 'Reduced-motion fallback'],
        };

    const handleHeroMove = (event: React.MouseEvent<HTMLElement>) => {
        if (reduceMotion) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        setPointer({ x, y });
    };

    const resetPointer = () => {
        setPointer({ x: 0, y: 0 });
    };

    const spawnParticles = (event: React.PointerEvent<HTMLDivElement>) => {
        if (reduceMotion || !rootRef.current || event.pointerType === 'touch') return;

        const rect = rootRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const burst = Array.from({ length: 10 }).map((_, index) => {
            const angle = (Math.PI * 2 * index) / 10;
            const distance = 28 + index * 3;
            const id = `${Date.now()}-${index}`;

            return {
                id,
                x,
                y,
                dx: Math.cos(angle) * distance,
                dy: Math.sin(angle) * distance,
                size: 4 + (index % 3),
                hue: 190 + index * 12,
                duration: 0.55 + index * 0.02,
            };
        });

        setParticles((current) => [...current, ...burst].slice(-80));
        window.setTimeout(() => {
            setParticles((current) => current.filter((particle) => !burst.some((item) => item.id === particle.id)));
        }, 900);
    };

    return (
        <div
            ref={rootRef}
            className="relative overflow-hidden bg-[#040814] text-slate-100"
            onPointerDown={spawnParticles}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                    backgroundImage: [
                        'radial-gradient(circle at 20% 20%, rgba(56,189,248,0.18), transparent 28%)',
                        'radial-gradient(circle at 80% 18%, rgba(168,85,247,0.18), transparent 24%)',
                        'radial-gradient(circle at 55% 52%, rgba(244,114,182,0.10), transparent 26%)',
                        'linear-gradient(180deg, rgba(4,8,20,0.3) 0%, rgba(4,8,20,0.92) 100%)',
                    ].join(','),
                }}
            />

            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                    y: heroGlowY,
                    background: `radial-gradient(500px circle at ${50 + pointer.x * 20}% ${24 + pointer.y * 12}%, rgba(96,165,250,0.20), transparent 58%)`,
                }}
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                    backgroundImage: [
                        'linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px)',
                        'linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)',
                    ].join(','),
                    backgroundSize: '72px 72px',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 92%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 92%)',
                }}
            />

            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                {STAR_FIELD.map((star) => (
                    <motion.span
                        key={`${star.left}-${star.top}`}
                        className="absolute rounded-full bg-white/90"
                        style={{
                            left: star.left,
                            top: star.top,
                            width: star.size,
                            height: star.size,
                        }}
                        animate={reduceMotion ? undefined : { opacity: [0.25, 0.95, 0.35], scale: [1, 1.8, 1] }}
                        transition={reduceMotion ? undefined : { duration: 3.6, repeat: Infinity, delay: star.delay }}
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
                            backgroundColor: `hsla(${particle.hue}, 95%, 72%, 1)`,
                            boxShadow: `0 0 16px hsla(${particle.hue}, 95%, 72%, 0.7)`,
                        }}
                        initial={{ x: 0, y: 0, opacity: 0.95, scale: 1 }}
                        animate={{ x: particle.dx, y: particle.dy, opacity: 0, scale: 0.3 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: particle.duration, ease: 'easeOut' }}
                    />
                ))}
            </AnimatePresence>

            <section
                ref={heroRef}
                className="relative"
                onMouseMove={handleHeroMove}
                onMouseLeave={resetPointer}
            >
                <div className="page-container page-width pt-10 pb-16 sm:pt-14 sm:pb-24">
                    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/6 px-6 py-8 shadow-[0_30px_80px_rgba(5,10,25,0.55)] backdrop-blur-xl sm:px-10 sm:py-12 lg:px-14 lg:py-16">
                        <motion.div
                            aria-hidden="true"
                            className="pointer-events-none absolute -left-24 top-10 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl"
                            animate={reduceMotion ? undefined : { x: pointer.x * 30, y: pointer.y * 18 }}
                            transition={{ type: 'spring', stiffness: 90, damping: 18 }}
                        />
                        <motion.div
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-8 bottom-6 h-52 w-52 rounded-full bg-fuchsia-400/20 blur-3xl"
                            style={{ y: orbitY, rotate: orbitRotate }}
                            animate={reduceMotion ? undefined : { x: pointer.x * -24, y: pointer.y * -16 }}
                            transition={{ type: 'spring', stiffness: 90, damping: 18 }}
                        />

                        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_420px] lg:items-center">
                            <div>
                                <motion.div
                                    initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7, ease: 'easeOut' }}
                                    className="inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100"
                                >
                                    <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.9)]" />
                                    {content.hero.eyebrow}
                                </motion.div>

                                <motion.h1
                                    initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                                    transition={{ duration: 0.85, delay: 0.1, ease: 'easeOut' }}
                                    className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl"
                                >
                                    {content.hero.title}
                                    <span className="mt-3 block bg-gradient-to-r from-cyan-300 via-sky-200 to-fuchsia-300 bg-clip-text text-transparent">
                                        {content.hero.subtitle}
                                    </span>
                                </motion.h1>

                                <motion.p
                                    initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                                    className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg"
                                >
                                    {content.hero.description}
                                </motion.p>

                                <motion.div
                                    initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.28, ease: 'easeOut' }}
                                    className="mt-8 flex flex-wrap gap-3"
                                >
                                    <Link
                                        href={`/${locale}/work-with-me`}
                                        className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_35px_rgba(255,255,255,0.18)]"
                                    >
                                        {content.hero.primaryCta}
                                    </Link>
                                    <Link
                                        href={`/${locale}/contact`}
                                        className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/6 px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:border-cyan-300/40 hover:bg-cyan-300/10"
                                    >
                                        {content.hero.secondaryCta}
                                    </Link>
                                </motion.div>

                                <motion.div
                                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.36, ease: 'easeOut' }}
                                    className="mt-10 flex flex-wrap gap-3"
                                >
                                    {labelCards.map((item) => (
                                        <span
                                            key={item.id}
                                            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 backdrop-blur"
                                        >
                                            {item.label}
                                        </span>
                                    ))}
                                </motion.div>
                            </div>

                            <motion.div
                                className="relative"
                                animate={reduceMotion ? undefined : { y: pointer.y * -18, x: pointer.x * -12 }}
                                transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                            >
                                <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_25px_60px_rgba(5,10,25,0.48)] backdrop-blur-xl">
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/75">{chromeCopy.identity}</p>
                                            <p className="mt-2 text-2xl font-semibold text-white">NAS</p>
                                        </div>
                                        <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
                                            {content.hero.status}
                                        </div>
                                    </div>

                                    <div className="mt-8 grid grid-cols-2 gap-3">
                                        {content.stats.map((stat) => (
                                            <motion.div
                                                key={stat.label}
                                                whileHover={reduceMotion ? undefined : { y: -4, scale: 1.02 }}
                                                transition={{ duration: 0.25 }}
                                                className="rounded-[24px] border border-white/8 bg-white/5 p-4"
                                            >
                                                <div className="text-2xl font-semibold text-white">{stat.value}</div>
                                                <div className="mt-2 text-sm leading-6 text-slate-300">{stat.label}</div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <motion.div
                                        aria-hidden="true"
                                        className="mt-8 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(34,211,238,0.16),rgba(168,85,247,0.08),rgba(15,23,42,0.4))] p-5"
                                        style={{ rotate: orbitRotate }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-2xl bg-white/10" />
                                            <div>
                                                <div className="text-sm font-medium text-white">{chromeCopy.profileTitle}</div>
                                                <div className="text-xs text-slate-300">{chromeCopy.profileSubtitle}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-container page-width py-16 sm:py-20">
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 26 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]"
                >
                    <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/75">{content.timelineTitle}</p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                            {content.timelineIntro}
                        </h2>
                    </div>
                    <div className="relative space-y-5 border-l border-white/10 pl-6">
                        {content.timeline.map((item, index) => (
                            <motion.article
                                key={`${item.year}-${item.title}`}
                                initial={reduceMotion ? false : { opacity: 0, x: 22 }}
                                whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.55, delay: index * 0.08 }}
                                className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm"
                            >
                                <span className="absolute -left-[33px] top-6 h-3.5 w-3.5 rounded-full border border-cyan-300/40 bg-[#040814] shadow-[0_0_18px_rgba(103,232,249,0.55)]" />
                                <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/75">{item.year}</div>
                                <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
                            </motion.article>
                        ))}
                    </div>
                </motion.div>
            </section>

            <section className="page-container page-width py-10 sm:py-16">
                <div className="section-header mb-8">
                    <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-fuchsia-200/75">{content.capabilityTitle}</p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{content.capabilityIntro}</h2>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {content.capabilities.map((item, index) => (
                        <motion.article
                            key={item.title}
                            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.55, delay: index * 0.06 }}
                            whileHover={reduceMotion ? undefined : { y: -8, rotateX: -4, rotateY: 3 }}
                            className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm"
                        >
                            <div
                                aria-hidden="true"
                                className="absolute inset-x-0 top-0 h-1"
                                style={{ background: item.accent }}
                            />
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">0{index + 1}</div>
                            <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                            <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
                            <div className="mt-6 flex items-center gap-2 text-xs font-medium text-cyan-200 opacity-70 transition-opacity duration-300 group-hover:opacity-100">
                                {chromeCopy.hover}
                                <span className="h-px flex-1 bg-gradient-to-r from-cyan-300/50 to-transparent" />
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>

            <section className="page-container page-width py-12 sm:py-16">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_420px]">
                    <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6 }}
                        className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.92),rgba(9,14,29,0.88))] p-6 shadow-[0_24px_70px_rgba(5,10,25,0.5)]"
                    >
                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/75">{content.fragmentsTitle}</p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{content.fragmentsIntro}</h2>
                        <div className="mt-8 grid gap-4 md:grid-cols-2">
                            {content.fragments.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.5, delay: index * 0.08 }}
                                    className="rounded-[24px] border border-white/8 bg-white/5 p-4"
                                >
                                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: 0.08 }}
                        className="overflow-hidden rounded-[30px] border border-cyan-300/15 bg-[linear-gradient(160deg,rgba(34,211,238,0.12),rgba(15,23,42,0.92),rgba(168,85,247,0.12))] p-6 shadow-[0_24px_70px_rgba(8,15,35,0.52)]"
                    >
                        <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                            <div className="text-xs uppercase tracking-[0.24em] text-cyan-100/75">{chromeCopy.interactive}</div>
                            <p className="mt-4 text-2xl font-semibold text-white">{chromeCopy.motionTitle}</p>
                            <p className="mt-3 text-sm leading-7 text-slate-300">
                                {chromeCopy.motionBody}
                            </p>
                        </div>

                        <div className="mt-6 grid gap-3">
                            {chromeCopy.stack.map((item, index) => (
                                <div
                                    key={item}
                                    className={joinClasses(
                                        'rounded-[22px] border border-white/10 px-4 py-3 text-sm text-slate-200',
                                        index % 2 === 0 ? 'bg-white/6' : 'bg-black/20'
                                    )}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="page-container page-width pt-8 pb-20 sm:pb-24">
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.65 }}
                    className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(8,14,30,0.95),rgba(34,211,238,0.10))] px-6 py-8 shadow-[0_24px_70px_rgba(5,10,25,0.46)] sm:px-10 sm:py-10"
                >
                    <div className="relative max-w-3xl">
                        <p className="text-xs uppercase tracking-[0.24em] text-fuchsia-200/75">Next move</p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{content.cta.title}</h2>
                        <p className="mt-4 text-base leading-8 text-slate-300">{content.cta.description}</p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href={`/${locale}/contact`}
                                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-transform duration-300 hover:-translate-y-0.5"
                            >
                                {content.cta.primary}
                            </Link>
                            <Link
                                href={`/${locale}/notes`}
                                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/6 px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:border-fuchsia-300/40 hover:bg-fuchsia-300/10"
                            >
                                {content.cta.secondary}
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
