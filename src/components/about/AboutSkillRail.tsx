'use client';

import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { AboutSkillContent } from './types';

interface AboutSkillRailProps {
    content: AboutSkillContent;
    locale: string;
}

const SKILL_ICONS: Record<string, string> = {
    'Next.js': '▲',
    TypeScript: 'TS',
    'Framer Motion': '◎',
    'Tailwind CSS': '🌊',
    Supabase: '⚡',
    'Content Design': '✏️',
    Automation: '⚙️',
    'Prompt Systems': '🤖',
    'Landing Pages': '🖥️',
    'Admin Dashboard': '📊',
};

const TABS_ZH = ['视频剪辑', '前端设计', '编程', '系统工程'];
const TABS_JA = ['映像編集', 'フロントエンド', 'プログラミング', 'システム'];

export default function AboutSkillRail({ content, locale }: AboutSkillRailProps) {
    const reduceMotion = useReducedMotion();
    const [activeTab, setActiveTab] = useState(0);
    const tabs = locale === 'zh' ? TABS_ZH : TABS_JA;
    const sectionTitle = locale === 'zh' ? '创造力引擎' : 'Creative Engine';

    return (
        <section className="about-skills-wrapper">
            <div className="px-8 pb-4">
                <span className="about-eyebrow">{sectionTitle}</span>
            </div>

            {/* Infinite Marquee Strip */}
            <div className="relative w-full overflow-hidden">
                <div 
                    className={`about-skills-track ${reduceMotion ? 'about-marquee-track-static' : ''}`}
                >
                    {/* Double groups for seamless loop */}
                    {[0, 1].map((g) => (
                        <div key={g} className="flex gap-4" aria-hidden={g === 1}>
                            {content.marquee.map((item) => (
                                <div key={`${g}-${item}`} className="about-skill-pill">
                                    <span className="text-xl">
                                        {SKILL_ICONS[item] || item.charAt(0)}
                                    </span>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Optional Tabs for Interaction - subtle approach */}
            <div className="px-8 pt-8 flex gap-3 flex-wrap">
                {tabs.map((tab, i) => (
                    <button
                        key={tab}
                        type="button"
                        className={`
                            px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300
                            ${i === activeTab 
                                ? 'bg-slate-800 text-white shadow-md' 
                                : 'bg-slate-50 text-slate-500 hover:bg-white hover:shadow-sm hover:text-slate-800'}
                        `}
                        onClick={() => setActiveTab(i)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content for tabs - fading grid */}
            <div className="px-8 pt-6 flex gap-3 flex-wrap">
                {content.categories[activeTab % content.categories.length]?.items.map((item) => (
                    <div key={item} className="px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-sm font-medium text-slate-600 shadow-sm transition-transform hover:scale-105">
                        {item}
                    </div>
                ))}
            </div>
        </section>
    );
}
