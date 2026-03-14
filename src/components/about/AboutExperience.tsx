'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';

export interface AboutExperienceContent {
    hero: {
        eyebrow: string;
        name: string;
        headline: string;
        description: string;
        primaryCta: string;
        secondaryCta: string;
        status: string;
        location: string;
        motto: string;
    };
    labels: string[];
    facts: Array<{ label: string; value: string }>;
    about: {
        title: string;
        intro: string;
        paragraphs: string[];
        principles: Array<{ title: string; description: string }>;
    };
    skills: {
        title: string;
        intro: string;
        marquee: string[];
        groups: Array<{ title: string; items: string[]; accent: string }>;
    };
    journey: {
        title: string;
        intro: string;
        timeline: Array<{ year: string; title: string; description: string }>;
        snapshotTitle: string;
        snapshotBody: string;
        snapshotList: string[];
    };
    personality: {
        title: string;
        intro: string;
        traits: Array<{ title: string; description: string }>;
    };
    site: {
        title: string;
        intro: string;
        blocks: Array<{ title: string; description: string }>;
    };
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
    { left: '7%', top: '10%', size: 4, delay: 0.1 },
    { left: '18%', top: '24%', size: 2, delay: 0.7 },
    { left: '33%', top: '16%', size: 3, delay: 0.5 },
    { left: '48%', top: '28%', size: 4, delay: 1.0 },
    { left: '63%', top: '12%', size: 2, delay: 0.2 },
    { left: '78%', top: '19%', size: 5, delay: 0.9 },
    { left: '91%', top: '30%', size: 3, delay: 0.6 },
    { left: '12%', top: '68%', size: 2, delay: 0.8 },
    { left: '29%', top: '80%', size: 4, delay: 1.2 },
    { left: '57%', top: '74%', size: 3, delay: 0.4 },
    { left: '74%', top: '84%', size: 2, delay: 1.4 },
    { left: '88%', top: '66%', size: 4, delay: 0.3 },
];

const SECTION_KICKERS = {
    zh: {
        dossier: 'Personal Dossier',
        principles: '我的工作原则',
        matrix: 'Skill Matrix',
        stackRail: '常用栈与关注方向',
        workStyle: '工作方式与兴趣',
        siteTitle: '这个站点为什么存在',
        nextMove: 'Next move',
        snapshot: 'Current Snapshot',
        hoverHint: '悬停可感知层次',
        profileHint: '更像个人档案，而不是传统公司介绍。',
    },
    ja: {
        dossier: 'Personal Dossier',
        principles: 'Working Principles',
        matrix: 'Skill Matrix',
        stackRail: 'Current stack and active interests',
        workStyle: 'Work style and interests',
        siteTitle: 'Why this site exists',
        nextMove: 'Next move',
        snapshot: 'Current Snapshot',
        hoverHint: 'Hover to feel the depth',
        profileHint: 'More personal dossier than generic corporate profile.',
    },
} as const;

function sectionClass() {
    return 'rounded-[30px] border border-white/10 bg-white/6 p-6 backdrop-blur-sm sm:p-8';
}

export default function AboutExperience({ locale, content }: AboutExperienceProps) {
    const reduceMotion = useReducedMotion();
    const rootRef = useRef<HTMLDivElement>(null);
    const [pointer, setPointer] = useState({ x: 0, y: 0 });
    const [particles, setParticles] = useState<Particle[]>([]);
    const { scrollYProgress } = useScroll({ target: rootRef, offset: ['start start', 'end end'] });
    const heroGlowY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
    const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 28]);
    const copy = SECTION_KICKERS[locale === 'zh' ? 'zh' : 'ja'];
    const marqueeItems = [...content.skills.marquee, ...content.skills.marquee];

    const handlePointerMove = (event: React.MouseEvent<HTMLElement>) => {
        if (reduceMotion) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setPointer({
            x: (event.clientX - rect.left) / rect.width - 0.5,
            y: (event.clientY - rect.top) / rect.height - 0.5,
        });
    };

    const spawnParticles = (event: React.PointerEvent<HTMLDivElement>) => {
        if (reduceMotion || !rootRef.current || event.pointerType === 'touch') return;
        const rect = rootRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const burst = Array.from({ length: 10 }).map((_, index) => {
            const angle = (Math.PI * 2 * index) / 10;
            return {
                id: `${Date.now()}-${index}`,
                x,
                y,
                dx: Math.cos(angle) * (24 + index * 4),
                dy: Math.sin(angle) * (24 + index * 4),
                size: 4 + (index % 3),
                hue: 188 + index * 12,
                duration: 0.5 + index * 0.03,
            };
        });
        setParticles((current) => [...current, ...burst].slice(-80));
        window.setTimeout(() => {
            setParticles((current) => current.filter((particle) => !burst.some((item) => item.id === particle.id)));
        }, 900);
    };

    return (
        <div ref={rootRef} className="relative overflow-hidden bg-[#040814] text-slate-100" onPointerDown={spawnParticles}>
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-80"
                style={{ backgroundImage: 'radial-gradient(circle at 14% 14%, rgba(56,189,248,0.2), transparent 26%),radial-gradient(circle at 82% 20%, rgba(168,85,247,0.18), transparent 24%),radial-gradient(circle at 56% 56%, rgba(244,114,182,0.10), transparent 26%),linear-gradient(180deg, rgba(4,8,20,0.15) 0%, rgba(4,8,20,0.94) 100%)' }}
            />
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-80"
                style={{ y: heroGlowY, background: `radial-gradient(520px circle at ${52 + pointer.x * 18}% ${22 + pointer.y * 10}%, rgba(96,165,250,0.18), transparent 58%)` }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-25"
                style={{ backgroundImage: 'linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px),linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)', backgroundSize: '72px 72px', maskImage: 'radial-gradient(circle at center, black 36%, transparent 92%)', WebkitMaskImage: 'radial-gradient(circle at center, black 36%, transparent 92%)' }}
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                {STAR_FIELD.map((star) => (
                    <motion.span key={`${star.left}-${star.top}`} className="absolute rounded-full bg-white/90" style={{ left: star.left, top: star.top, width: star.size, height: star.size }} animate={reduceMotion ? undefined : { opacity: [0.25, 1, 0.35], scale: [1, 1.8, 1] }} transition={reduceMotion ? undefined : { duration: 3.4, repeat: Infinity, delay: star.delay }} />
                ))}
            </div>
            <AnimatePresence>
                {particles.map((particle) => (
                    <motion.span key={particle.id} className="pointer-events-none absolute rounded-full" style={{ left: particle.x, top: particle.y, width: particle.size, height: particle.size, backgroundColor: `hsla(${particle.hue}, 96%, 72%, 1)`, boxShadow: `0 0 16px hsla(${particle.hue}, 96%, 72%, 0.7)` }} initial={{ x: 0, y: 0, opacity: 0.95, scale: 1 }} animate={{ x: particle.dx, y: particle.dy, opacity: 0, scale: 0.3 }} exit={{ opacity: 0 }} transition={{ duration: particle.duration, ease: 'easeOut' }} />
                ))}
            </AnimatePresence>
            <div className="page-container page-width pt-10 pb-20 sm:pt-14 sm:pb-24">
                <section className="relative" onMouseMove={handlePointerMove} onMouseLeave={() => setPointer({ x: 0, y: 0 })}>
                    <div className="relative overflow-hidden rounded-[38px] border border-white/10 bg-white/6 px-6 py-8 shadow-[0_30px_90px_rgba(5,10,25,0.56)] backdrop-blur-xl sm:px-10 sm:py-10 lg:px-14 lg:py-14">
                        <motion.div aria-hidden="true" className="pointer-events-none absolute -left-20 top-8 h-40 w-40 rounded-full bg-cyan-400/18 blur-3xl" animate={reduceMotion ? undefined : { x: pointer.x * 28, y: pointer.y * 18 }} transition={{ type: 'spring', stiffness: 88, damping: 18 }} />
                        <motion.div aria-hidden="true" className="pointer-events-none absolute -right-10 bottom-0 h-52 w-52 rounded-full bg-fuchsia-400/16 blur-3xl" animate={reduceMotion ? undefined : { x: pointer.x * -24, y: pointer.y * -18 }} transition={{ type: 'spring', stiffness: 88, damping: 18 }} />
                        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_420px]">
                            <div>
                                <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/18 bg-cyan-300/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100"><span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.9)]" />{content.hero.eyebrow}</div>
                                <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl"><span className="block">{content.hero.name}</span><span className="mt-3 block bg-gradient-to-r from-cyan-300 via-sky-100 to-fuchsia-300 bg-clip-text text-transparent">{content.hero.headline}</span></h1>
                                <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">{content.hero.description}</p>
                                <div className="mt-8 flex flex-wrap gap-3">
                                    <Link href={`/${locale}/work-with-me`} className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_35px_rgba(255,255,255,0.18)]">{content.hero.primaryCta}</Link>
                                    <Link href={`/${locale}/contact`} className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/6 px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:border-cyan-300/40 hover:bg-cyan-300/10">{content.hero.secondaryCta}</Link>
                                </div>
                                <div className="mt-10 flex flex-wrap gap-3">{content.labels.map((label) => <span key={label} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200">{label}</span>)}</div>
                            </div>
                            <div className="relative">
                                <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/72 p-6 shadow-[0_24px_60px_rgba(5,10,25,0.5)]">
                                    <motion.div aria-hidden="true" className="absolute right-[-50px] top-[-60px] h-36 w-36 rounded-full border border-cyan-300/20" style={{ rotate: ringRotate }} />
                                    <div className="flex items-center gap-4">
                                        <div className="relative flex h-20 w-20 items-center justify-center rounded-[26px] bg-[linear-gradient(135deg,rgba(103,232,249,0.18),rgba(168,85,247,0.24),rgba(15,23,42,0.9))] text-2xl font-semibold text-white shadow-[0_12px_30px_rgba(14,165,233,0.18)]">N<span className="absolute inset-2 rounded-[20px] border border-white/10" /></div>
                                        <div><div className="text-xs uppercase tracking-[0.22em] text-cyan-200/75">{copy.dossier}</div><div className="mt-2 text-2xl font-semibold text-white">{content.hero.status}</div><div className="mt-2 text-sm text-slate-300">{content.hero.location}</div></div>
                                    </div>
                                    <p className="mt-6 rounded-[24px] border border-white/8 bg-white/5 px-4 py-4 text-sm leading-7 text-slate-200">{content.hero.motto}</p>
                                    <div className="mt-6 grid grid-cols-2 gap-3">{content.facts.map((fact) => <div key={fact.label} className="rounded-[22px] border border-white/8 bg-white/5 p-4"><div className="text-xs uppercase tracking-[0.18em] text-slate-400">{fact.label}</div><div className="mt-3 text-sm font-medium leading-6 text-white">{fact.value}</div></div>)}</div>
                                    <div className="mt-6 rounded-[24px] border border-cyan-300/12 bg-[linear-gradient(145deg,rgba(34,211,238,0.1),rgba(15,23,42,0.24))] p-4 text-sm leading-7 text-slate-300">{copy.profileHint}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_420px]">
                    <div className={sectionClass()}>
                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/75">{content.about.title}</p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{content.about.intro}</h2>
                        <div className="mt-6 space-y-4">
                            {content.about.paragraphs.map((paragraph) => (
                                <p key={paragraph} className="text-base leading-8 text-slate-300">{paragraph}</p>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(160deg,rgba(20,30,56,0.92),rgba(9,14,29,0.92))] p-6">
                        <p className="text-xs uppercase tracking-[0.24em] text-fuchsia-200/75">{copy.principles}</p>
                        <div className="mt-5 space-y-4">
                            {content.about.principles.map((item) => (
                                <div key={item.title} className="rounded-[24px] border border-white/8 bg-white/5 p-4">
                                    <div className="text-sm font-semibold text-white">{item.title}</div>
                                    <p className="mt-2 text-sm leading-7 text-slate-300">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mt-10">
                    <div className="section-header mb-8">
                        <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/75">{copy.matrix}</p>
                            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{content.skills.title}</h2>
                            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">{content.skills.intro}</p>
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/6 py-4 backdrop-blur-sm">
                        <div className="px-5 text-xs uppercase tracking-[0.2em] text-slate-400">{copy.stackRail}</div>
                        <motion.div className="mt-4 flex gap-3 whitespace-nowrap px-5" animate={reduceMotion ? undefined : { x: ['0%', '-50%'] }} transition={reduceMotion ? undefined : { duration: 18, repeat: Infinity, ease: 'linear' }}>
                            {marqueeItems.map((item, index) => (
                                <span key={`${item}-${index}`} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">{item}</span>
                            ))}
                        </motion.div>
                    </div>
                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {content.skills.groups.map((group, index) => (
                            <motion.article key={group.title} whileHover={reduceMotion ? undefined : { y: -8, rotateX: -4, rotateY: 4 }} className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1" style={{ background: group.accent }} />
                                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">0{index + 1}</div>
                                <h3 className="mt-4 text-xl font-semibold text-white">{group.title}</h3>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {group.items.map((item) => (
                                        <span key={item} className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-medium text-slate-200">{item}</span>
                                    ))}
                                </div>
                                <div className="mt-6 flex items-center gap-2 text-xs font-medium text-cyan-200 opacity-70 transition-opacity duration-300 group-hover:opacity-100">
                                    {copy.hoverHint}
                                    <span className="h-px flex-1 bg-gradient-to-r from-cyan-300/50 to-transparent" />
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </section>

                <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_400px]">
                    <div className={sectionClass()}>
                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/75">{content.journey.title}</p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{content.journey.intro}</h2>
                        <div className="relative mt-8 space-y-5 border-l border-white/10 pl-6">
                            {content.journey.timeline.map((item) => (
                                <article key={`${item.year}-${item.title}`} className="relative overflow-hidden rounded-[24px] border border-white/8 bg-black/20 p-4">
                                    <span className="absolute -left-[33px] top-6 h-3.5 w-3.5 rounded-full border border-cyan-300/40 bg-[#040814] shadow-[0_0_18px_rgba(103,232,249,0.55)]" />
                                    <div className="text-xs uppercase tracking-[0.18em] text-cyan-200/75">{item.year}</div>
                                    <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-[30px] border border-cyan-300/12 bg-[linear-gradient(160deg,rgba(34,211,238,0.1),rgba(15,23,42,0.92),rgba(168,85,247,0.12))] p-6">
                        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <div className="text-xs uppercase tracking-[0.22em] text-cyan-100/75">{copy.snapshot}</div>
                                    <div className="mt-2 text-2xl font-semibold text-white">{content.journey.snapshotTitle}</div>
                                </div>
                                <motion.div className="flex h-16 w-16 items-center justify-center rounded-[24px] border border-white/10 bg-white/5 text-lg font-semibold text-white" style={{ rotate: ringRotate }}>
                                    N
                                </motion.div>
                            </div>
                            <p className="mt-5 text-sm leading-7 text-slate-300">{content.journey.snapshotBody}</p>
                            <div className="mt-5 space-y-3">
                                {content.journey.snapshotList.map((item) => (
                                    <div key={item} className="rounded-[20px] border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-200">{item}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-10">
                    <div className="section-header mb-8">
                        <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-fuchsia-200/75">{copy.workStyle}</p>
                            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{content.personality.title}</h2>
                            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">{content.personality.intro}</p>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {content.personality.traits.map((item, index) => (
                            <article key={item.title} className="rounded-[26px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">0{index + 1}</div>
                                <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_400px]">
                    <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.92),rgba(9,14,29,0.88))] p-6 shadow-[0_24px_70px_rgba(5,10,25,0.46)]">
                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/75">{copy.siteTitle}</p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{content.site.title}</h2>
                        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">{content.site.intro}</p>
                        <div className="mt-8 grid gap-4 md:grid-cols-2">
                            {content.site.blocks.map((item) => (
                                <div key={item.title} className="rounded-[24px] border border-white/8 bg-white/5 p-4">
                                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={sectionClass()}>
                        <div className="rounded-[24px] border border-white/8 bg-black/20 p-5">
                            <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/75">Signal</div>
                            <div className="mt-3 text-2xl font-semibold text-white">Human + System</div>
                            <p className="mt-3 text-sm leading-7 text-slate-300">
                                I want this site to feel personal, useful, and alive at the same time. Not just a profile, not just a storefront.
                            </p>
                        </div>
                        <div className="mt-5 space-y-3">
                            {content.labels.slice(0, 4).map((item) => (
                                <div key={item} className="rounded-[20px] border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-200">{item}</div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mt-10">
                    <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(8,14,30,0.95),rgba(34,211,238,0.10))] px-6 py-8 shadow-[0_24px_70px_rgba(5,10,25,0.46)] sm:px-10 sm:py-10">
                        <div className="relative max-w-3xl">
                            <p className="text-xs uppercase tracking-[0.24em] text-fuchsia-200/75">{copy.nextMove}</p>
                            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{content.cta.title}</h2>
                            <p className="mt-4 text-base leading-8 text-slate-300">{content.cta.description}</p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link href={`/${locale}/contact`} className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-transform duration-300 hover:-translate-y-0.5">{content.cta.primary}</Link>
                                <Link href={`/${locale}/notes`} className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/6 px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:border-fuchsia-300/40 hover:bg-fuchsia-300/10">{content.cta.secondary}</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
