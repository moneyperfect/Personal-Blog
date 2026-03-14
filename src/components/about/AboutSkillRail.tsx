'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { AboutSkillContent } from './types';

interface AboutSkillRailProps {
    content: AboutSkillContent;
    locale: string;
}

export default function AboutSkillRail({ content, locale }: AboutSkillRailProps) {
    const reduceMotion = useReducedMotion();
    const sectionTitle = locale === 'zh' ? '开启创造' : 'Creative Engine';

    return (
        <section className="mt-10 rounded-[34px] border border-[#ebe4d8] bg-white/86 p-6 shadow-[0_20px_54px_rgba(34,53,79,0.07)] backdrop-blur-sm sm:p-8">
            <div className="section-header mb-7">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a8aa0]">{sectionTitle}</p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#203047] sm:text-4xl">
                        {content.title}
                    </h2>
                    <p className="mt-4 max-w-3xl text-base leading-8 text-[#52657f]">{content.intro}</p>
                </div>
            </div>

            <div className="about-marquee overflow-hidden rounded-[28px] border border-[#e8eef5] bg-[linear-gradient(160deg,#f8fbff,#fffdfa)] px-4 py-5 sm:px-5">
                <div
                    className={`about-marquee-track ${reduceMotion ? 'about-marquee-track-static' : ''}`}
                    aria-label={sectionTitle}
                >
                    {[0, 1].map((groupIndex) => (
                        <div
                            key={groupIndex}
                            aria-hidden={groupIndex === 1}
                            className="about-marquee-group"
                        >
                            {content.marquee.map((item, index) => (
                                <span
                                    key={`${groupIndex}-${item}`}
                                    className="inline-flex items-center gap-2 rounded-full border border-[#dce6f1] bg-white/96 px-4 py-2.5 text-sm font-medium text-[#56718d] shadow-[0_10px_22px_rgba(90,120,160,0.08)]"
                                >
                                    <span
                                        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[linear-gradient(160deg,#dcecff,#f5f8ff)] text-[10px] font-bold uppercase text-[#54708f]"
                                    >
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    {item}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {content.categories.map((group, index) => (
                    <motion.article
                        key={group.title}
                        whileHover={reduceMotion ? undefined : { y: -8, scale: 1.012 }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                        className="group relative overflow-hidden rounded-[28px] border border-[#ebe4d8] bg-[linear-gradient(160deg,#ffffff,#fcfbf8)] p-5 shadow-[0_12px_30px_rgba(36,55,80,0.05)]"
                    >
                        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1" style={{ background: group.accent }} />
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b96a8]">
                            0{index + 1}
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-[#203047]">{group.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-[#566980]">{group.summary}</p>
                        <div className="mt-5 flex flex-wrap gap-2">
                            {group.items.map((item) => (
                                <span
                                    key={item}
                                    className="rounded-full border border-[#e7edf4] bg-[#f8fbff] px-3 py-1.5 text-xs font-medium text-[#5d7390]"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                        <div className="mt-6 flex items-center gap-2 text-xs font-medium text-[#5d86b0] opacity-70 transition-opacity duration-300 group-hover:opacity-100">
                            {locale === 'zh' ? '鼠标移上去会停下，方便你看清模块节奏' : 'Hover pauses the flow so each block is easier to inspect'}
                            <span className="h-px flex-1 bg-gradient-to-r from-[#b9d6f4] to-transparent" />
                        </div>
                    </motion.article>
                ))}
            </div>
        </section>
    );
}
