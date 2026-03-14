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
        <section className="flex flex-col gap-[32px] w-full mt-4">

            {/* ── Row 0: About Me & Motto & Career (Restored from Hero) ── */}
            <div className="about-mixed-grid">
                {/* About Me */}
                <motion.article 
                    className="about-bento-card about-hover-spring ab-col-4 flex flex-col justify-end bg-slate-900 text-white"
                >
                    <span className="about-eyebrow" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 'auto' }}>
                        {locale === 'zh' ? '关于我' : 'About Me'}
                    </span>
                    <h2 className="text-3xl font-bold mb-2">NAS</h2>
                    <p className="text-sm leading-relaxed text-slate-300">
                        {locale === 'zh' 
                            ? '倘若生活太苦，我便往里加点糖。\n热爱一切未知的创造力与审美。' 
                            : '人生が苦いなら、砂糖を足せばいい。\n未知の表現と美を愛する。'}
                    </p>
                </motion.article>

                {/* Geek Spirit / Motto */}
                <motion.article className="about-bento-card about-hover-spring ab-col-4">
                    <span className="about-eyebrow mb-auto block">
                        {locale === 'zh' ? '座右铭' : 'Geek Spirit'}
                    </span>
                    <div className="mt-12 flex flex-col gap-2">
                        <h3 className="text-2xl font-extrabold text-slate-800">
                            {locale === 'zh' ? '源于' : '始まりは'}
                        </h3>
                        <h3 className="text-2xl font-extrabold text-slate-800">
                            {locale === 'zh' ? '热爱而去 ' : '愛するために '}
                            <span className="text-slate-400 font-normal">
                                 {locale === 'zh' ? '努力' : '努力'}
                            </span>
                        </h3>
                        <h3 className="text-2xl font-extrabold text-blue-600">
                            {locale === 'zh' ? '创作' : '創作'}
                        </h3>
                    </div>
                </motion.article>

                {/* Career Progress restored */}
                <motion.article className="about-bento-card about-hover-spring ab-col-4">
                    <span className="about-eyebrow mb-2 block">{locale === 'zh' ? '无限进步' : '無限に前へ'}</span>
                    <h4 className="text-xl font-bold text-slate-800 mb-6">
                        {locale === 'zh' ? '生涯与求学' : 'Career & Edu'}
                    </h4>
                    
                    <div className="flex flex-col gap-3 mb-6">
                        {info.educationItems.slice(0, 3).map((item, idx) => (
                            <div key={item} className="flex items-center gap-3">
                                <span className={`w-2.5 h-2.5 rounded-full ring-4 shadow-sm
                                    ${idx === 0 ? 'bg-blue-500 ring-blue-50' : 
                                      idx === 1 ? 'bg-amber-400 ring-amber-50' : 
                                      'bg-emerald-500 ring-emerald-50'}`} 
                                />
                                <span className="text-sm font-semibold text-slate-700">{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="about-career-bar">
                        <div className="about-career-bar__seg" style={{ width: '40%', background: '#3b82f6' }} />
                        <div className="about-career-bar__seg" style={{ width: '25%', background: '#fbbf24' }} />
                        <div className="about-career-bar__seg" style={{ width: '35%', background: '#10b981' }} />
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
                        <span>2017</span>
                        <span>{locale === 'zh' ? '现在' : '現在'}</span>
                    </div>
                </motion.article>
            </div>

            {/* ── First Grid: MBTI (8) + Photo (4) ── */}
            <div className="about-mixed-grid">
                <motion.article 
                    className="about-bento-card about-hover-spring ab-col-8 about-mbti-card"
                >
                    <div className="about-mbti-text pr-6">
                        <span className="about-eyebrow">{locale === 'zh' ? '性格探测' : '性格'}</span>
                        <h3 className="text-4xl font-extrabold text-slate-800 tracking-tight mt-2 mb-1">
                            {locale === 'zh' ? '提倡者' : '提唱者'} <span className="text-emerald-500 text-3xl">INFJ</span>
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
                    {/* The photo container with official floating animation */}
                    <div className="about-mbti-photo-wrapper hidden sm:block">
                        <motion.div
                            animate={reduceMotion ? {} : { y: [-6, 6, -6], rotateZ: [-1, 1, -1] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <Image
                                src="/about/portrait-demo.svg"
                                alt="Portrait"
                                width={220}
                                height={220}
                                className="about-mbti-photo drop-shadow-2xl"
                            />
                        </motion.div>
                    </div>
                </motion.article>

                <motion.article 
                    className="about-bento-card about-hover-spring ab-col-4 flex flex-col justify-end"
                    style={{ background: 'linear-gradient(145deg, #2c1810 0%, #3d2214 100%)', color: '#fff' }}
                >
                    <span className="about-eyebrow" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 'auto' }}>
                        {locale === 'zh' ? '最爱游戏' : 'Game Hobby'}
                    </span>
                    <h3 className="text-3xl font-extrabold tracking-tight mb-2">黑神话</h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                        {locale === 'zh' ? '国产动作天花板，无可挑剔的东方美学。' : '国産アクションの頂点。'}
                    </p>
                </motion.article>
            </div>

            {/* ── Second Grid: Anime Accordion (12) ── */}
            <div className="about-anime-container">
                {personality.posters.map((poster, idx) => {
                    const isActive = activeAnime === idx;
                    return (
                        <div
                            key={poster.title}
                            className={`about-anime-panel ${isActive ? 'active' : ''}`}
                            onMouseEnter={() => !reduceMotion && setActiveAnime(idx)}
                            onClick={() => setActiveAnime(idx)}
                        >
                            <div className="about-anime-bg" style={{ background: poster.gradient }} />
                            <div className="about-anime-gradient" />
                            <div className="about-anime-text">
                                <h4>{poster.title}</h4>
                                <p>{locale === 'zh' ? '神作必看' : 'Masterpiece'}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Third Grid: Music (6) + Focus (6) (Larger areas for readability) ── */}
            <div className="about-mixed-grid">
                <motion.article className="about-bento-card about-hover-spring ab-col-6 about-music-card min-h-[220px]">
                    <span className="about-eyebrow">{personality.musicTitle}</span>
                    <h4 className="text-2xl font-bold text-slate-800 mt-2">
                        {locale === 'zh' ? '华语流行、独立民谣、Hiphop' : 'J-Pop, Indie Folk, HipHop'}
                    </h4>
                    <p className="about-bento-desc mt-4 leading-loose">{personality.musicBody}</p>
                </motion.article>

                <motion.article className="about-bento-card about-hover-spring ab-col-6 min-h-[220px]">
                    <span className="about-eyebrow">{personality.focusTitle}</span>
                    <h4 className="text-2xl font-bold text-slate-800 mt-2">
                        {locale === 'zh' ? '数码科技、人工智能' : 'テック・AI'}
                    </h4>
                    <p className="about-bento-desc mt-4 leading-loose">{personality.focusBody}</p>
                </motion.article>
            </div>

            {/* ── Fourth Grid: Data Panel (4) + Map (4) + Info (4) ── */}
            <div className="about-mixed-grid">
                <motion.article className="about-bento-card about-hover-spring ab-col-4 about-data-panel">
                    <span className="about-eyebrow">{info.statsTitle}</span>
                    <div className="about-data-grid" style={{ gridTemplateColumns: '1fr', gap: '32px' }}>
                        {info.stats.slice(0, 2).map((s) => (
                            <div key={s.label}>
                                <div className="about-data-val text-blue-400">{s.value}</div>
                                <div className="about-data-label text-white/50">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.article>

                {/* Map Focus */}
                <motion.article className="about-bento-card about-hover-spring ab-col-4 p-0 flex flex-col">
                    <div className="flex-1 relative w-full overflow-hidden">
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

                {/* Personal Bio Data */}
                <motion.article className="about-bento-card about-hover-spring ab-col-4 flex flex-col gap-6 justify-center">
                    <div>
                        <span className="about-eyebrow block mb-1">{locale === 'zh' ? '生年' : '生年'}</span>
                        <span className="text-3xl font-extrabold text-blue-600">- 1999 -</span>
                    </div>
                    <div>
                        <span className="about-eyebrow block mb-1">EDU</span>
                        <span className="text-2xl font-bold text-purple-600">
                            {locale === 'zh' ? '计算机科学' : 'コンピュータ'}
                        </span>
                    </div>
                    <div>
                        <span className="about-eyebrow block mb-1">{locale === 'zh' ? '职业' : '現職'}</span>
                        <span className="text-2xl font-bold text-rose-500">
                            {locale === 'zh' ? '独立开发者' : 'ITエンジニア'}
                        </span>
                    </div>
                </motion.article>
            </div>

            {/* ── Fifth Grid: Narrative (6) + Ten-Year Pact (6) ── */}
            <div className="about-mixed-grid">
                <motion.article className="about-bento-card about-hover-spring ab-col-6">
                    <span className="about-eyebrow">{narrative.routeTitle}</span>
                    <h4 className="text-2xl font-bold text-slate-800 mt-4">
                        {locale === 'zh' ? '为何执笔写下这些？' : 'なぜ書き記すのか'}
                    </h4>
                    <p className="about-bento-desc mt-4 leading-loose text-[15px]">
                        {narrative.routeIntro}
                    </p>
                </motion.article>

                <motion.article className="about-bento-card about-hover-spring ab-col-6">
                    <span className="about-eyebrow">{narrative.pactTitle}</span>
                    <h4 className="text-2xl font-extrabold text-slate-800 mt-2">
                        {locale === 'zh' ? '「一个人的寂寞，一群人的狂欢」' : '「一人の孤独、皆の祝祭」'}
                    </h4>
                    {/* The refined progress bar */}
                    <div className="w-full h-4 bg-slate-100 rounded-full mt-10 overflow-hidden shadow-inner p-1">
                        <div className="h-full bg-gradient-to-r from-slate-700 to-slate-900 rounded-full w-1/3 relative transition-all duration-1000 ease-in-out shadow-sm" />
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-400 mt-4 tracking-widest uppercase">
                        <span>2022.11</span>
                        <span className="text-slate-600 bg-slate-100 px-3 py-1 rounded-full">33.3% Progress</span>
                        <span>2032.11</span>
                    </div>
                </motion.article>
            </div>
        </section>
    );
}
