'use client';

import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { AboutSkillContent } from './types';

interface AboutSkillRailProps {
    content: AboutSkillContent;
    locale: string;
}

/* Skill items with placeholder emoji icons */
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
    const sectionLabel = locale === 'zh' ? '技能' : 'Skills';
    const sectionTitle = locale === 'zh' ? '开启创造力' : 'Creative Engine';

    return (
        <section className="about-skills-section">
            <div className="about-skills-card">
                <div className="about-skills-header">
                    <p className="about-skills-header__label">{sectionLabel}</p>
                    <h2 className="about-skills-header__title">{sectionTitle}</h2>
                </div>

                {/* Marquee — icon cards */}
                <div className="about-skills-marquee">
                    <div className={`about-skills-marquee-track ${reduceMotion ? 'about-marquee-track-static' : ''}`}>
                        {[0, 1].map((g) => (
                            <div key={g} className="about-skills-marquee-group" aria-hidden={g === 1}>
                                {content.marquee.map((item) => (
                                    <div key={`${g}-${item}`} className="about-skill-icon-card">
                                        <span className="about-skill-icon-card__icon">
                                            {SKILL_ICONS[item] || item.charAt(0)}
                                        </span>
                                        <span className="about-skill-icon-card__name">{item}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category tabs */}
                <div className="about-skills-tabs">
                    {tabs.map((tab, i) => (
                        <button
                            key={tab}
                            type="button"
                            className={`about-skills-tab ${i === activeTab ? 'about-skills-tab--active' : ''}`}
                            onClick={() => setActiveTab(i)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Grid for active tab's skills */}
                <div className="about-skills-grid">
                    {content.categories[activeTab % content.categories.length]?.items.map((item) => (
                        <div key={item} className="about-skill-icon-card">
                            <span className="about-skill-icon-card__icon">{item.charAt(0)}</span>
                            <span className="about-skill-icon-card__name">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
