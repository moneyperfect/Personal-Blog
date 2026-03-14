'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { AboutHeroContent } from './types';

interface AboutHeroProps {
    locale: string;
    content: AboutHeroContent;
}

const FLOATING_POSITIONS = [
    'left-[-16px] top-[28px]',
    'right-[-12px] top-[48px]',
    'left-[6px] bottom-[58px]',
    'right-[10px] bottom-[16px]',
];

export default function AboutHero({ locale, content }: AboutHeroProps) {
    const reduceMotion = useReducedMotion();
    const statusLabel = locale === 'zh' ? '当前状态' : 'Status';
    const journeyNoteLabel = locale === 'zh' ? '模块说明' : 'Journey Note';
    const journeyNoteBody =
        locale === 'zh'
            ? '这一列先用来模拟参考页右侧的人生轨迹卡片，后面再替换成你的真实阶段信息。'
            : 'This column is here to mimic the right-side life trajectory card first, then swap in your real milestones.';

    return (
        <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
            <motion.article
                whileHover={reduceMotion ? undefined : { y: -6 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="rounded-[34px] border border-[#ebe4d8] bg-[linear-gradient(165deg,#fffdf8,#f8fbff)] p-6 shadow-[0_18px_46px_rgba(34,53,79,0.07)]"
            >
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7f8ca0]">
                    {content.introTitle}
                </div>
                <p className="mt-4 text-sm leading-7 text-[#54667f]">{content.introBody}</p>
                <div className="mt-5 space-y-3">
                    {content.introBullets.map((item) => (
                        <div
                            key={item}
                            className="rounded-[22px] border border-[#ece7dd] bg-white/92 px-4 py-3 text-sm leading-7 text-[#556880]"
                        >
                            {item}
                        </div>
                    ))}
                </div>
                <div className="mt-6 rounded-[24px] border border-[#dce8f3] bg-[#f8fbff] p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d8ea2]">{statusLabel}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full border border-[#d7e4f2] bg-white px-3 py-1.5 text-xs font-semibold text-[#587293]">
                            {content.status}
                        </span>
                        {content.profileSummary.map((item) => (
                            <span
                                key={item}
                                className="rounded-full border border-[#ebe6dd] bg-[#fffdf8] px-3 py-1.5 text-xs font-medium text-[#6a7485]"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.article>

            <div className="rounded-[38px] border border-[#e6e0d3] bg-white/88 px-6 py-8 shadow-[0_28px_74px_rgba(40,56,83,0.09)] backdrop-blur-sm sm:px-8">
                <div className="text-center">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d8ea2]">
                        {content.eyebrow}
                    </div>
                </div>

                <div className="mt-7 flex flex-col items-center">
                    <div className="relative w-full max-w-[300px]">
                        <motion.div
                            whileHover={reduceMotion ? undefined : { y: -8, rotate: -2, scale: 1.025 }}
                            transition={{ duration: 0.36, ease: 'easeOut' }}
                            className="relative"
                        >
                            <motion.div
                                aria-hidden="true"
                                className="absolute -inset-9 rounded-full bg-[radial-gradient(circle,rgba(126,180,243,0.28),transparent_68%)]"
                                animate={
                                    reduceMotion
                                        ? undefined
                                        : { scale: [1, 1.08, 1], opacity: [0.45, 0.85, 0.45] }
                                }
                                transition={
                                    reduceMotion
                                        ? undefined
                                        : { duration: 5.6, repeat: Infinity, ease: 'easeInOut' }
                                }
                            />

                            <div className="relative mx-auto h-60 w-60 overflow-hidden rounded-full border border-white/90 bg-[linear-gradient(160deg,#f9fcff,#eef5ff)] p-3 shadow-[0_24px_52px_rgba(94,125,162,0.18)]">
                                <div className="relative h-full w-full overflow-hidden rounded-full border border-[#d7e4f3] bg-[#edf5ff]">
                                    <Image
                                        src="/about/avatar-demo.svg"
                                        alt="Avatar demo"
                                        fill
                                        className="object-cover"
                                        sizes="240px"
                                    />
                                </div>
                            </div>

                            {content.floatingSkills.map((item, index) => (
                                <motion.div
                                    key={item}
                                    animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
                                    transition={
                                        reduceMotion
                                            ? undefined
                                            : { duration: 3.6, repeat: Infinity, delay: index * 0.32 }
                                    }
                                    className={`absolute ${FLOATING_POSITIONS[index % FLOATING_POSITIONS.length]} hidden rounded-full border border-[#d8e4f3] bg-white/94 px-3 py-1.5 text-xs font-semibold text-[#56708f] shadow-[0_14px_34px_rgba(108,135,167,0.16)] sm:block`}
                                >
                                    {item}
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    <h1 className="mt-8 text-center text-4xl font-semibold tracking-[-0.05em] text-[#203047] sm:text-5xl lg:text-[3.6rem]">
                        {content.name}
                    </h1>
                    <p className="mt-5 max-w-3xl text-center text-lg leading-8 text-[#52657f] sm:text-xl">
                        {content.tagline}
                    </p>

                    <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                        {content.profileSummary.map((item) => (
                            <span
                                key={item}
                                className="rounded-full border border-[#ece6dc] bg-[#fffdf8] px-4 py-2 text-sm font-medium text-[#687486]"
                            >
                                {item}
                            </span>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link
                            href={`/${locale}/contact`}
                            className="inline-flex items-center justify-center rounded-full bg-[#2151d2] px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#1d46b4]"
                        >
                            {content.primaryCta}
                        </Link>
                        <Link
                            href={`/${locale}/work-with-me`}
                            className="inline-flex items-center justify-center rounded-full border border-[#d8e4f1] bg-white px-6 py-3 text-sm font-semibold text-[#44627e] transition-colors duration-300 hover:border-[#b8d4f1] hover:bg-[#f8fbff]"
                        >
                            {content.secondaryCta}
                        </Link>
                    </div>
                </div>
            </div>

            <motion.article
                whileHover={reduceMotion ? undefined : { y: -6 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="rounded-[34px] border border-[#e2ebf4] bg-[linear-gradient(165deg,#f7fbff,#eef5ff)] p-6 shadow-[0_18px_46px_rgba(34,53,79,0.08)]"
            >
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7f8ca0]">
                    {content.journeyTitle}
                </div>
                <p className="mt-4 text-sm leading-7 text-[#54667f]">{content.journeyBody}</p>
                <div className="mt-6 space-y-4">
                    {content.journeyItems.map((item, index) => (
                        <div key={item} className="flex items-start gap-3">
                            <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border border-[#d3e1f0] bg-white text-[11px] font-semibold text-[#567391]">
                                {index + 1}
                            </div>
                            <div className="rounded-[20px] border border-white/70 bg-white/86 px-4 py-3 text-sm leading-7 text-[#54667f]">
                                {item}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 rounded-[24px] border border-[#d9e6f3] bg-white/86 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7c8ea4]">{journeyNoteLabel}</div>
                    <p className="mt-3 text-sm leading-7 text-[#556980]">{journeyNoteBody}</p>
                </div>
            </motion.article>
        </section>
    );
}
