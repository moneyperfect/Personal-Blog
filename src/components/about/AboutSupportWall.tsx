'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import type { AboutSupportContent } from './types';

interface AboutSupportWallProps {
    locale: string;
    content: AboutSupportContent;
}

export default function AboutSupportWall({ locale, content }: AboutSupportWallProps) {
    const reduceMotion = useReducedMotion();
    const sectionLabel = locale === 'zh' ? '致谢赞赏名单' : 'Support Wall';
    const demoNote =
        locale === 'zh'
            ? '这一块目前先是结构示意，先对齐主题和模块布局。'
            : 'This block is a structure demo first, so the theme and layout match before final content.';
    const replaceNote =
        locale === 'zh'
            ? '后面可以把名字、留言、金额和支持方式换成你的真实信息。'
            : 'You can later replace names, notes, amounts, and supporter details with real data.';

    return (
        <section className="mt-10 grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
            <div className="rounded-[34px] border border-[#ebe4d8] bg-white/88 p-6 shadow-[0_20px_54px_rgba(34,53,79,0.07)] backdrop-blur-sm sm:p-8">
                <div className="section-header mb-7">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a8aa0]">{sectionLabel}</p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#203047] sm:text-4xl">
                            {content.title}
                        </h2>
                        <p className="mt-4 max-w-3xl text-base leading-8 text-[#52657f]">{content.intro}</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {content.supporters.map((item) => (
                        <motion.article
                            key={`${item.name}-${item.amount}`}
                            whileHover={reduceMotion ? undefined : { y: -6 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="rounded-[26px] border border-[#ece7dd] bg-[linear-gradient(160deg,#fffdfa,#f8fbff)] p-5 shadow-[0_10px_24px_rgba(40,53,77,0.05)]"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-lg font-semibold text-[#203047]">{item.name}</div>
                                    <div className="mt-2 text-sm leading-7 text-[#5b6e85]">{item.note}</div>
                                </div>
                                <div className="rounded-full border border-[#d7e6f2] bg-white px-3 py-1 text-xs font-semibold text-[#55718e]">
                                    {item.amount}
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>

            <div className="rounded-[34px] border border-[#e5edf5] bg-[linear-gradient(160deg,#f7fbff,#fffdfa)] p-6 shadow-[0_20px_54px_rgba(34,53,79,0.07)] sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a8aa0]">
                    {locale === 'zh' ? '下一步' : 'Next Step'}
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#203047] sm:text-4xl">
                    {content.ctaTitle}
                </h2>
                <p className="mt-4 text-base leading-8 text-[#52657f]">{content.ctaBody}</p>

                <div className="mt-6 grid gap-3">
                    <div className="rounded-[22px] border border-[#dbe7f2] bg-white/90 px-4 py-3 text-sm text-[#5b7190]">
                        {demoNote}
                    </div>
                    <div className="rounded-[22px] border border-[#efe6d7] bg-[#fffaf2] px-4 py-3 text-sm text-[#7f6c57]">
                        {replaceNote}
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                        href={`/${locale}/contact`}
                        className="inline-flex items-center justify-center rounded-full bg-[#1f4ed8] px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#1d43b7]"
                    >
                        {content.primaryCta}
                    </Link>
                    <Link
                        href={`/${locale}/notes`}
                        className="inline-flex items-center justify-center rounded-full border border-[#dce5f2] bg-white px-6 py-3 text-sm font-semibold text-[#45617f] transition-colors duration-300 hover:border-[#b8d4f1] hover:bg-[#f7fbff]"
                    >
                        {content.secondaryCta}
                    </Link>
                </div>
            </div>
        </section>
    );
}
