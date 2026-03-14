'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import type { AboutInfoContent, AboutNarrativeContent, AboutPersonalityContent } from './types';

interface AboutLifeModulesProps {
    locale: string;
    personality: AboutPersonalityContent;
    info: AboutInfoContent;
    narrative: AboutNarrativeContent;
}

export default function AboutLifeModules({ locale, personality, info, narrative }: AboutLifeModulesProps) {
    const reduceMotion = useReducedMotion();
    const [activeAnime, setActiveAnime] = useState<number>(0);

    return (
        <section className="flex flex-col gap-6 w-full">
            {/* ── First Grid: MBTI (8) + Photo (4) ── */}
            <div className="about-mixed-grid">
                <motion.article 
                    className="about-bento-card about-hover-spring ab-col-8 about-mbti-card"
                >
                    <div className="about-mbti-text">
                        <span className="about-eyebrow">{locale === 'zh' ? '性格探测' : '性格'}</span>
                        <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight mt-2 mb-1">
                            {locale === 'zh' ? '提倡者' : '提唱者'} (INFJ)
                        </h3>
                        <p className="text-slate-500 font-medium mb-6">
                            Introverted, Intuitive, Feeling, Judging
                        </p>
                        <p className="text-slate-600 leading-relaxed text-[15px] max-w-md">
                            {locale === 'zh' 
                                ? '喜欢深思细想，直觉敏锐，对世界怀有某种理想主义色彩。很少盲从主流节奏，更愿在角落里自己打磨发光的石头。' 
                                : '物事を深く考え、直感が鋭く、理想主義的な一面がある。主流には流されず、自分のペースで輝く石を磨きたい。'}
                        </p>
                    </div>
                    {/* The photo container */}
                    <Image
                        src="/about/portrait-demo.svg"
                        alt="Portrait"
                        width={200}
                        height={200}
                        className="about-mbti-photo hidden sm:block"
                    />
                </motion.article>

                <motion.article 
                    className="about-bento-card about-hover-spring ab-col-4 flex flex-col justify-end"
                    style={{ background: 'linear-gradient(145deg, #1a1a2e, #16213e)', color: '#fff' }}
                >
                    <span className="about-eyebrow" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 'auto' }}>
                        {locale === 'zh' ? '游戏品味' : 'Game Hobby'}
                    </span>
                    <h3 className="text-2xl font-bold tracking-tight mb-2">INSIDE</h3>
                    <p className="text-slate-400 text-sm">
                        {locale === 'zh' ? '深爱的一款神作，沉默且压抑的美学。' : '無言の圧迫感、沈黙の美。'}
                    </p>
                </motion.article>
            </div>

            {/* ── Second Grid: Anime Accordion (12) ── */}
            <div className="about-anime-container">
                {personality.posters.map((poster, idx) => {
                    const isActive = activeAnime === idx;
                    return (
                        <motion.div
                            key={poster.title}
                            className="about-anime-panel"
                            style={{ flex: isActive ? 3 : 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            onHoverStart={() => !reduceMotion && setActiveAnime(idx)}
                            onClick={() => setActiveAnime(idx)}
                        >
                            <div className="about-anime-bg" style={{ background: poster.gradient }} />
                            <div className="about-anime-gradient" />
                            <div className={`about-anime-text ${isActive ? 'active' : ''}`}>
                                <h4>{poster.title}</h4>
                                <p>{locale === 'zh' ? '经典神作' : 'Masterpiece'}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ── Third Grid: Data Panel (6) + Music (6) ── */}
            <div className="about-mixed-grid">
                <motion.article className="about-bento-card about-hover-spring ab-col-6 about-data-panel">
                    <span className="about-eyebrow">{info.statsTitle}</span>
                    <div className="about-data-grid">
                        {info.stats.slice(0, 2).map((s) => (
                            <div key={s.label}>
                                <div className="about-data-val">{s.value}</div>
                                <div className="about-data-label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.article>

                <motion.article className="about-bento-card about-hover-spring ab-col-6 about-music-card">
                    <span className="about-eyebrow">{personality.musicTitle}</span>
                    <h4 className="about-bento-title mt-2">
                        {locale === 'zh' ? '华语流行、独立民谣、Hiphop' : 'J-Pop, Indie Folk, HipHop'}
                    </h4>
                    <p className="about-bento-desc mt-2">{personality.musicBody}</p>
                </motion.article>
            </div>

            {/* ── Fourth Grid: Info (4) + Map (4) + Timeline (4) ── */}
            <div className="about-mixed-grid">
                {/* Personal Bio Data */}
                <motion.article className="about-bento-card about-hover-spring ab-col-4 flex flex-col gap-6 justify-center">
                    <div>
                        <span className="about-eyebrow block">{locale === 'zh' ? '生年' : '生年'}</span>
                        <span className="text-3xl font-extrabold text-blue-600">- 1999 -</span>
                    </div>
                    <div>
                        <span className="about-eyebrow block">EDU</span>
                        <span className="text-2xl font-bold text-purple-600">
                            {locale === 'zh' ? '计算机科学' : 'コンピュータ'}
                        </span>
                    </div>
                    <div>
                        <span className="about-eyebrow block">{locale === 'zh' ? '职业' : '現職'}</span>
                        <span className="text-2xl font-bold text-rose-500">
                            {locale === 'zh' ? '独立开发者' : 'ITエンジニア'}
                        </span>
                    </div>
                </motion.article>

                {/* Map Focus */}
                <motion.article className="about-bento-card about-hover-spring ab-col-4 p-0 flex flex-col">
                    <div className="h-40 relative w-full overflow-hidden">
                        <Image
                            src="/about/map-demo.svg"
                            alt="Map Location"
                            fill
                            className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                    </div>
                    <div className="p-6">
                        <span className="about-eyebrow">{info.mapTitle}</span>
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                            {locale === 'zh' ? '坐标在不断更新，但编码的锚点始终如一。' : '座標は更新されるが、コードのアンカーは変わらない。'}
                        </p>
                    </div>
                </motion.article>

                {/* Edu/Timeline */}
                <motion.article className="about-bento-card about-hover-spring ab-col-4 about-timeline-card">
                    <span className="about-eyebrow mb-6"> {locale === 'zh' ? '历程' : '経歴'} </span>
                    <div className="flex-1 flex flex-col justify-center border-l-2 border-slate-100 pl-4 py-2">
                        {info.educationItems.slice(0, 3).map((item, idx) => (
                            <div key={item} className="relative mb-5 last:mb-0 group">
                                <div className={`absolute -left-[23px] w-3 h-3 rounded-full border-2 border-white transition-colors duration-300
                                        ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                <span className="text-sm font-semibold text-slate-700 group-hover:text-black transition-colors">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.article>
            </div>

            {/* ── Fifth Grid: Narrative (6) + Ten-Year Pact (6) ── */}
            <div className="about-mixed-grid">
                <motion.article className="about-bento-card about-hover-spring ab-col-6">
                    <span className="about-eyebrow">{narrative.routeTitle}</span>
                    <h4 className="about-bento-title mt-4">
                        {locale === 'zh' ? '为何执笔写下这些？' : 'なぜ書き記すのか'}
                    </h4>
                    <p className="about-bento-desc mt-3">
                        {narrative.routeIntro}
                    </p>
                </motion.article>

                <motion.article className="about-bento-card about-hover-spring ab-col-6">
                    <span className="about-eyebrow">{narrative.pactTitle}</span>
                    <h4 className="text-xl font-bold text-slate-800 mt-2">
                        {locale === 'zh' ? '「一个人的寂寞，一群人的狂欢」' : '「一人の孤独、皆の祝祭」'}
                    </h4>
                    {/* The refined progress bar */}
                    <div className="w-full h-3 bg-slate-100 rounded-full mt-6 overflow-hidden shadow-inner">
                        <div className="h-full bg-slate-800 rounded-full w-1/3 relative transition-all duration-1000 ease-in-out" />
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-slate-400 mt-3 tracking-widest uppercase">
                        <span>2022.11</span>
                        <span className="text-slate-600">33.3%</span>
                        <span>2032.11</span>
                    </div>
                </motion.article>
            </div>
        </section>
    );
}
