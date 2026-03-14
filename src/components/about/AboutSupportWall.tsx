'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { AboutSupportContent } from './types';

interface AboutSupportWallProps {
    locale: string;
    content: AboutSupportContent;
}

export default function AboutSupportWall({ locale, content }: AboutSupportWallProps) {
    const reduceMotion = useReducedMotion();

    return (
        <section className="flex flex-col gap-6 w-full mt-4">
            {/* ── Support Wall ── */}
            <article className="about-bento-card about-hover-spring">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="about-eyebrow">{locale === 'zh' ? '致谢' : '感謝'}</span>
                        <h3 className="about-bento-title mt-2">{content.title}</h3>
                        <p className="about-bento-desc">{content.intro}</p>
                    </div>
                    {/* The donate wrapper containing the tooltip */}
                    <div className="relative about-donate-wrapper group">
                        <button 
                            type="button" 
                            className="flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white text-[15px] font-bold rounded-full transition-all duration-300 shadow-[0_4px_14px_0_rgba(225,29,72,0.39)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.23)]"
                        >
                            <span className="text-lg">❤️</span>
                            {locale === 'zh' ? '赞赏作者' : '応援する'}
                        </button>

                        {/* QR codes tooltip appearing on hover */}
                        <div className="about-donate-tooltip">
                            <div className="about-qr-placeholder">
                                <span>WeChat</span>
                                <span className="text-[10px] text-slate-400">QR Code</span>
                            </div>
                            <div className="about-qr-placeholder">
                                <span>AliPay</span>
                                <span className="text-[10px] text-slate-400">QR Code</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="about-support-grid">
                    {content.supporters.map((s) => (
                        <motion.div
                            key={`${s.name}-${s.amount}`}
                            whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="about-support-item hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow duration-300"
                        >
                            <p className="about-support-name">{s.name}</p>
                            <span className="about-support-amount">
                                💰 {s.amount}
                            </span>
                            <p className="about-support-msg">{s.note}</p>
                        </motion.div>
                    ))}
                </div>
            </article>

            {/* ── Footer CTAs & Signature ── */}
            <div className="flex justify-center gap-4 mt-8 mb-16">
                <Link 
                    href={`/${locale}/contact`} 
                    className="px-8 py-3 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300 shadow-md"
                >
                    {content.primaryCta}
                </Link>
                <Link 
                    href={`/${locale}/notes`} 
                    className="px-8 py-3 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold hover:bg-slate-50 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                >
                    {content.secondaryCta}
                </Link>
            </div>

            <div className="about-footer">
                <Image 
                    src="/about/avatar-demo.svg" 
                    alt="Author Signature" 
                    width={80} 
                    height={80} 
                    className="about-footer-avatar" 
                />
                <p className="font-medium text-slate-500 mb-1 tracking-wide">
                    {locale === 'zh' ? '这是我的客栈 / THIS IS MY TAVERN' : 'ココハワタシノサカバ'}
                </p>
                <p className="text-xl font-bold text-slate-800 tracking-tight my-2">NAS</p>
                <p className="text-sm italic text-slate-400">
                    {locale === 'zh'
                        ? '「只有迎风，风筝才能飞得更高。」'
                        : '「風に立ち向かえ。」'}
                </p>
            </div>
        </section>
    );
}
