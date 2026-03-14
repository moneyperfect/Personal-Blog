'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import type { AboutInfoContent, AboutNarrativeContent, AboutPersonalityContent } from './types';

interface AboutLifeModulesProps {
    locale: string;
    personality: AboutPersonalityContent;
    info: AboutInfoContent;
    narrative: AboutNarrativeContent;
}

export default function AboutLifeModules({ locale, personality, info, narrative }: AboutLifeModulesProps) {
    const reduceMotion = useReducedMotion();
    const sectionLabel = locale === 'zh' ? '关于我是谁' : 'Who I Am';
    const hobbyLabel = locale === 'zh' ? '爱好与偏好' : 'Hobbies & Tastes';
    const infoLabel = locale === 'zh' ? '独立模块' : 'Independent Modules';
    const routeLabel = locale === 'zh' ? '系列路程' : 'Series Route';
    const personalityBadge = locale === 'zh' ? `性格 ${personality.mbti}` : `Personality ${personality.mbti}`;
    const portraitLabel = locale === 'zh' ? '个人照片位' : 'Portrait';
    const animeLabel = locale === 'zh' ? '动漫 / 视觉卡片' : 'Anime / Visual Cards';
    const hoverLabel = locale === 'zh' ? '悬停' : 'Hover';

    return (
        <>
            <section className="mt-10 grid gap-6 xl:grid-cols-[1.08fr_340px_340px]">
                <motion.article
                    whileHover={reduceMotion ? undefined : { y: -6 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="rounded-[34px] border border-[#ebe4d8] bg-white/88 p-6 shadow-[0_20px_54px_rgba(34,53,79,0.07)] backdrop-blur-sm sm:p-8"
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a8aa0]">{sectionLabel}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-[#d7e6f3] bg-[#f8fbff] px-4 py-2 text-sm font-semibold text-[#4f6f90]">
                            {personalityBadge}
                        </span>
                        <span className="rounded-full border border-[#efe6d7] bg-[#fffaf2] px-4 py-2 text-sm text-[#8d7b62]">
                            {personality.spotlightTitle}
                        </span>
                    </div>
                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#203047] sm:text-4xl">
                        {personality.title}
                    </h2>
                    <p className="mt-4 text-base leading-8 text-[#52657f]">{personality.intro}</p>
                    <div className="mt-5 rounded-[26px] border border-[#e5edf5] bg-[#f8fbff] px-5 py-4">
                        <p className="text-sm leading-7 text-[#55708b]">{personality.mbtiSummary}</p>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {personality.highlights.map((item) => (
                            <div
                                key={item}
                                className="rounded-[22px] border border-[#ece7dd] bg-[#fffdfa] px-4 py-3 text-sm leading-7 text-[#556980]"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {personality.traits.map((item, index) => (
                            <div key={item.title} className="rounded-[24px] border border-[#e7edf4] bg-white p-4">
                                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8d97a8]">
                                    0{index + 1}
                                </div>
                                <h3 className="mt-3 text-lg font-semibold text-[#203047]">{item.title}</h3>
                                <p className="mt-2 text-sm leading-7 text-[#5b6e85]">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </motion.article>

                <motion.article
                    whileHover={reduceMotion ? undefined : { y: -8, scale: 1.01 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="overflow-hidden rounded-[34px] border border-[#eadfd3] bg-[linear-gradient(160deg,#fffaf2,#ffffff)] shadow-[0_20px_54px_rgba(34,53,79,0.07)]"
                >
                    <div className="relative aspect-[4/5]">
                        <Image
                            src="/about/portrait-demo.svg"
                            alt="Portrait demo"
                            fill
                            className="object-cover"
                            sizes="340px"
                        />
                    </div>
                    <div className="border-t border-[#ebe4d8] p-5">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8d97a8]">
                            {portraitLabel}
                        </div>
                        <p className="mt-3 text-sm leading-7 text-[#566980]">{personality.spotlightBody}</p>
                    </div>
                </motion.article>

                <div className="grid gap-6">
                    <motion.article
                        whileHover={reduceMotion ? undefined : { y: -6 }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                        className="rounded-[30px] border border-[#ebe4d8] bg-[linear-gradient(165deg,#fffdfa,#f8fbff)] p-6 shadow-[0_14px_38px_rgba(40,53,77,0.06)]"
                    >
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a8aa0]">
                            {personality.musicTitle}
                        </div>
                        <p className="mt-4 text-sm leading-7 text-[#556980]">{personality.musicBody}</p>
                    </motion.article>

                    <motion.article
                        whileHover={reduceMotion ? undefined : { y: -6 }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                        className="rounded-[30px] border border-[#ebe4d8] bg-[linear-gradient(165deg,#fffdfa,#f8fbff)] p-6 shadow-[0_14px_38px_rgba(40,53,77,0.06)]"
                    >
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a8aa0]">
                            {personality.focusTitle}
                        </div>
                        <p className="mt-4 text-sm leading-7 text-[#556980]">{personality.focusBody}</p>
                    </motion.article>

                    <motion.article
                        whileHover={reduceMotion ? undefined : { y: -6 }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                        className="rounded-[30px] border border-[#ebe4d8] bg-[linear-gradient(165deg,#f8fbff,#fffdfa)] p-6 shadow-[0_14px_38px_rgba(40,53,77,0.06)]"
                    >
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a8aa0]">
                            {info.currentTitle}
                        </div>
                        <div className="mt-4 space-y-3">
                            {info.currentItems.map((item) => (
                                <div
                                    key={item}
                                    className="rounded-[18px] border border-[#ece7dd] bg-white px-4 py-3 text-sm text-[#556980]"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </motion.article>
                </div>
            </section>

            <section className="mt-10 rounded-[34px] border border-[#ebe4d8] bg-white/88 p-6 shadow-[0_20px_54px_rgba(34,53,79,0.07)] backdrop-blur-sm sm:p-8">
                <div className="section-header mb-7">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a8aa0]">{hobbyLabel}</p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#203047] sm:text-4xl">
                            {personality.galleryTitle}
                        </h2>
                        <p className="mt-4 max-w-3xl text-base leading-8 text-[#52657f]">{personality.galleryIntro}</p>
                    </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                    <motion.article
                        whileHover={reduceMotion ? undefined : { y: -6 }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                        className="rounded-[28px] border border-[#ebe4d8] bg-[linear-gradient(160deg,#fffdfa,#f8fbff)] p-5 shadow-[0_12px_30px_rgba(36,55,80,0.05)]"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b96a8]">
                                    {animeLabel}
                                </div>
                                <h3 className="mt-3 text-2xl font-semibold text-[#203047]">
                                    {locale === 'zh' ? '喜欢的动漫与视觉偏好' : 'Anime and visual references'}
                                </h3>
                            </div>
                            <span className="rounded-full border border-[#d9e6f3] bg-white px-3 py-1.5 text-xs font-semibold text-[#55718e]">
                                {hoverLabel}
                            </span>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {personality.posters.map((item) => (
                                <motion.article
                                    key={item.title}
                                    whileHover={reduceMotion ? undefined : { y: -10, scale: 1.04 }}
                                    transition={{ duration: 0.28, ease: 'easeOut' }}
                                    className="group overflow-hidden rounded-[24px] border border-[#ebe4d8] bg-white shadow-[0_10px_28px_rgba(40,53,77,0.06)]"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <div
                                            className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                                            style={{ background: item.gradient }}
                                        />
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent_55%)]" />
                                    </div>
                                    <div className="p-4">
                                        <h4 className="text-base font-semibold text-[#203047]">{item.title}</h4>
                                        <p className="mt-2 text-sm leading-7 text-[#5a6d85]">{item.caption}</p>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </motion.article>

                    <div className="grid gap-4">
                        <motion.article
                            whileHover={reduceMotion ? undefined : { y: -6 }}
                            transition={{ duration: 0.28, ease: 'easeOut' }}
                            className="rounded-[28px] border border-[#ebe4d8] bg-[linear-gradient(160deg,#f8fbff,#fffdfa)] p-5 shadow-[0_12px_30px_rgba(36,55,80,0.05)]"
                        >
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b96a8]">
                                {locale === 'zh' ? '特长与习惯' : 'Strengths and habits'}
                            </div>
                            <div className="mt-4 space-y-3">
                                {personality.highlights.slice(0, 3).map((item) => (
                                    <div
                                        key={item}
                                        className="rounded-[18px] border border-[#e7edf4] bg-white px-4 py-3 text-sm text-[#556980]"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </motion.article>

                        <motion.article
                            whileHover={reduceMotion ? undefined : { y: -6 }}
                            transition={{ duration: 0.28, ease: 'easeOut' }}
                            className="rounded-[28px] border border-[#ebe4d8] bg-[linear-gradient(160deg,#fffdfa,#f8fbff)] p-5 shadow-[0_12px_30px_rgba(36,55,80,0.05)]"
                        >
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b96a8]">
                                {locale === 'zh' ? '关注与小宇宙' : 'Personal focus map'}
                            </div>
                            <p className="mt-4 text-sm leading-7 text-[#5a6d85]">
                                {personality.focusBody}
                            </p>
                            <div className="mt-5 grid grid-cols-2 gap-3">
                                {personality.traits.slice(0, 4).map((item) => (
                                    <div
                                        key={item.title}
                                        className="rounded-[18px] border border-[#ece7dd] bg-white px-4 py-3 text-sm font-medium text-[#556980]"
                                    >
                                        {item.title}
                                    </div>
                                ))}
                            </div>
                        </motion.article>
                    </div>
                </div>
            </section>

            <section className="mt-10">
                <div className="section-header mb-7">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a8aa0]">{infoLabel}</p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#203047] sm:text-4xl">
                            {info.title}
                        </h2>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
                    <div className="grid gap-6">
                        <article className="rounded-[34px] border border-[#ebe4d8] bg-white/88 p-6 shadow-[0_20px_54px_rgba(34,53,79,0.07)] backdrop-blur-sm sm:p-8">
                            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a8aa0]">
                                {info.statsTitle}
                            </div>
                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                {info.stats.map((item) => (
                                    <div key={item.label} className="rounded-[24px] border border-[#e5edf5] bg-[#f8fbff] p-5">
                                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a97a9]">
                                            {item.label}
                                        </div>
                                        <div className="mt-3 text-2xl font-semibold text-[#203047]">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </article>

                        <article className="rounded-[34px] border border-[#ebe4d8] bg-white/88 p-6 shadow-[0_20px_54px_rgba(34,53,79,0.07)] backdrop-blur-sm sm:p-8">
                            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a8aa0]">
                                {info.identityTitle}
                            </div>
                            <p className="mt-4 text-base leading-8 text-[#52657f]">{info.identityBody}</p>
                        </article>

                        <article className="rounded-[34px] border border-[#ebe4d8] bg-white/88 p-6 shadow-[0_20px_54px_rgba(34,53,79,0.07)] backdrop-blur-sm sm:p-8">
                            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a8aa0]">
                                {info.educationTitle}
                            </div>
                            <div className="mt-5 space-y-3">
                                {info.educationItems.map((item) => (
                                    <div
                                        key={item}
                                        className="rounded-[20px] border border-[#ece7dd] bg-[#fffdfa] px-4 py-3 text-sm text-[#556980]"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </article>
                    </div>

                    <div className="grid gap-6">
                        <article className="overflow-hidden rounded-[34px] border border-[#e5edf5] bg-white/88 shadow-[0_20px_54px_rgba(34,53,79,0.07)] backdrop-blur-sm">
                            <div className="relative aspect-[4/3]">
                                <Image
                                    src="/about/map-demo.svg"
                                    alt="Map demo"
                                    fill
                                    className="object-cover"
                                    sizes="480px"
                                />
                            </div>
                            <div className="border-t border-[#e5edf5] p-6">
                                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a8aa0]">
                                    {info.mapTitle}
                                </div>
                                <p className="mt-4 text-sm leading-7 text-[#5a6d85]">{info.mapBody}</p>
                            </div>
                        </article>

                        <article className="rounded-[34px] border border-[#ebe4d8] bg-white/88 p-6 shadow-[0_20px_54px_rgba(34,53,79,0.07)] backdrop-blur-sm">
                            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a8aa0]">
                                {info.currentTitle}
                            </div>
                            <div className="mt-5 space-y-3">
                                {info.currentItems.map((item) => (
                                    <div
                                        key={item}
                                        className="rounded-[20px] border border-[#ece7dd] bg-[#fffdfa] px-4 py-3 text-sm text-[#556980]"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            <section className="mt-10 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
                <article className="rounded-[34px] border border-[#ebe4d8] bg-white/88 p-6 shadow-[0_20px_54px_rgba(34,53,79,0.07)] backdrop-blur-sm sm:p-8">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a8aa0]">{routeLabel}</div>
                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#203047] sm:text-4xl">
                        {narrative.routeTitle}
                    </h2>
                    <p className="mt-4 text-base leading-8 text-[#52657f]">{narrative.routeIntro}</p>
                    <div className="relative mt-6 space-y-4 border-l border-[#dfe6ef] pl-6">
                        {narrative.routeItems.map((item) => (
                            <motion.div
                                key={`${item.stage}-${item.title}`}
                                whileHover={reduceMotion ? undefined : { x: 4 }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                                className="relative rounded-[22px] border border-[#ece7dd] bg-[#fffdfa] p-4"
                            >
                                <span className="absolute -left-[33px] top-5 h-3.5 w-3.5 rounded-full border border-[#c6d8ea] bg-white shadow-[0_0_0_4px_rgba(247,251,255,1)]" />
                                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8d97a8]">{item.stage}</div>
                                <h3 className="mt-3 text-lg font-semibold text-[#203047]">{item.title}</h3>
                                <p className="mt-2 text-sm leading-7 text-[#5b6e85]">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </article>

                <article className="rounded-[34px] border border-[#ebe4d8] bg-[linear-gradient(160deg,#fffdfa,#f8fbff)] p-6 shadow-[0_20px_54px_rgba(34,53,79,0.07)] sm:p-8">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a8aa0]">
                        {narrative.pactTitle}
                    </div>
                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#203047] sm:text-4xl">
                        {narrative.pactIntro}
                    </h2>
                    <div className="mt-6 space-y-3">
                        {narrative.pactItems.map((item) => (
                            <div
                                key={item}
                                className="rounded-[20px] border border-[#ece7dd] bg-white px-4 py-3 text-sm leading-7 text-[#556980]"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </article>
            </section>
        </>
    );
}
