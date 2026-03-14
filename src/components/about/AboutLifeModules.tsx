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

    return (
        <>
            {/* ═══════════════════════════════════════════
                Skills + Career  (two-column)
            ═══════════════════════════════════════════ */}
            <div className="about-two-col">
                {/* Career progress card (left slot used by SkillRail above, this is right slot) */}
                <article className="about-career-card">
                    <p className="about-card__eyebrow">
                        {locale === 'zh' ? '生涯' : '生涯'}
                    </p>
                    <h3 className="about-skills-header__title" style={{ marginTop: 8 }}>
                        {locale === 'zh' ? '无限进步' : '無限に前へ'}
                    </h3>
                    <div style={{ marginTop: 16 }}>
                        {info.educationItems.map((item, i) => (
                            <div key={item} className="about-edu-item">
                                <span
                                    className="about-edu-dot"
                                    style={{ background: ['#4285f4', '#fbbc04', '#34a853'][i % 3] }}
                                />
                                <span className="about-edu-text">{item}</span>
                            </div>
                        ))}
                    </div>
                    {/* Career color bar */}
                    <div style={{ marginTop: 20 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#e74c3c', letterSpacing: '0.08em' }}>EDU</p>
                        <div className="about-career-bar">
                            <div className="about-career-bar__seg" style={{ width: '40%', background: '#4285f4' }} />
                            <div className="about-career-bar__seg" style={{ width: '25%', background: '#fbbc04' }} />
                            <div className="about-career-bar__seg" style={{ width: '35%', background: '#34a853' }} />
                        </div>
                        <div className="about-career-bar__label">
                            <span>2017</span>
                            <span>{locale === 'zh' ? '现在' : '現在'}</span>
                        </div>
                    </div>
                </article>

                {/* This column is only shown on desktop to pair with SkillRail; on mobile it flows naturally */}
            </div>

            {/* ═══════════════════════════════════════════
                Personality (MBTI) + Photo
            ═══════════════════════════════════════════ */}
            <div className="about-personality-grid">
                <article className="about-mbti-card">
                    <p className="about-mbti-card__badge">
                        {locale === 'zh' ? '性格' : '性格'}
                    </p>
                    <h3 className="about-mbti-card__type-name">
                        {locale === 'zh' ? '提倡者' : '提唱者'}
                    </h3>
                    <p className="about-mbti-card__type-code">{personality.mbti}-T</p>
                    <p className="about-mbti-card__note">
                        {locale === 'zh' ? '在 ' : ''}
                        <a href="https://www.16personalities.com/" target="_blank" rel="noreferrer">16personalities</a>
                        {locale === 'zh'
                            ? ` 了解更多关于 逻辑学家`
                            : ' でもっと知る'}
                    </p>
                </article>

                <article className="about-photo-card">
                    <Image
                        src="/about/portrait-demo.svg"
                        alt="Portrait"
                        width={400}
                        height={320}
                        className="about-photo-card__img"
                    />
                </article>
            </div>

            {/* ═══════════════════════════════════════════
                Motto + Talent
            ═══════════════════════════════════════════ */}
            <div className="about-motto-talent-grid">
                <article className="about-motto-card">
                    <p className="about-motto-card__label">
                        {locale === 'zh' ? '座右铭' : '座右銘'}
                    </p>
                    <p className="about-motto-card__text">
                        {locale === 'zh' ? '但行好事，\n莫问前程。' : '善行を続けよ、\n先を問うな。'}
                    </p>
                </article>

                <motion.article
                    whileHover={reduceMotion ? undefined : { y: -4 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="about-talent-card"
                >
                    <p className="about-talent-card__label">
                        {locale === 'zh' ? '特长' : '特技'}
                    </p>
                    <p className="about-talent-card__text">
                        {locale === 'zh'
                            ? '脑洞大开 厕所战神\n写日记技能MAX'
                            : 'アイデア爆発 トイレの王\n日記スキルMAX'}
                    </p>
                </motion.article>
            </div>

            {/* ═══════════════════════════════════════════
                Game Hobby — 2 poster cards
            ═══════════════════════════════════════════ */}
            <div className="about-game-grid">
                {[
                    {
                        label: locale === 'zh' ? '游戏爱好' : 'ゲーム',
                        title: 'INSIDE',
                        subtitle: locale === 'zh' ? '最爱的一款游戏' : '一番好きなゲーム',
                        gradient: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 100%)',
                    },
                    {
                        label: locale === 'zh' ? '游戏爱好' : 'ゲーム',
                        title: locale === 'zh' ? '黑神话：悟空' : 'Black Myth: Wukong',
                        subtitle: locale === 'zh' ? '国产动作天花板' : '国産アクションの頂点',
                        gradient: 'linear-gradient(160deg, #2c1810 0%, #3d2214 100%)',
                    },
                ].map((game) => (
                    <motion.article
                        key={game.title}
                        whileHover={reduceMotion ? undefined : { y: -4 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="about-game-card"
                    >
                        <div className="about-game-card__bg" style={{ background: game.gradient }} />
                        <div className="about-game-card__overlay" />
                        <div className="about-game-card__content">
                            <p className="about-game-card__label">{game.label}</p>
                            <h4 className="about-game-card__title">{game.title}</h4>
                            <p className="about-game-card__subtitle">{game.subtitle}</p>
                        </div>
                    </motion.article>
                ))}
            </div>

            {/* ═══════════════════════════════════════════
                Anime Accordion
            ═══════════════════════════════════════════ */}
            <div className="about-anime-section">
                <div className="about-anime-header">
                    <p className="about-anime-header__label">
                        {locale === 'zh' ? '爱好番剧' : 'アニメ'}
                    </p>
                    <h3 className="about-anime-header__title">
                        {locale === 'zh' ? '追番 · 科幻、动漫、推理' : '追番 · SF・アニメ・推理'}
                    </h3>
                </div>
                <div className="about-anime-row">
                    {personality.posters.map((poster) => (
                        <div key={poster.title} className="about-anime-card">
                            <div className="about-anime-card__bg" style={{ background: poster.gradient }} />
                            <div className="about-anime-card__overlay" />
                            <div className="about-anime-card__title">{poster.title}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                Music + Focus Preference
            ═══════════════════════════════════════════ */}
            <div className="about-pref-grid">
                <motion.article
                    whileHover={reduceMotion ? undefined : { y: -3 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="about-pref-card"
                >
                    <p className="about-pref-card__label">{personality.musicTitle}</p>
                    <p className="about-pref-card__title">
                        {locale === 'zh' ? '周杰伦、Hiphop、民谣、华语流行' : 'J-Pop, HipHop, Folk'}
                    </p>
                    <p className="about-pref-card__body">{personality.musicBody}</p>
                </motion.article>

                <motion.article
                    whileHover={reduceMotion ? undefined : { y: -3 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="about-pref-card"
                >
                    <p className="about-pref-card__label">{personality.focusTitle}</p>
                    <p className="about-pref-card__title">
                        {locale === 'zh' ? '数码科技、人工智能' : 'テック・AI'}
                    </p>
                    <p className="about-pref-card__body">{personality.focusBody}</p>
                </motion.article>
            </div>

            {/* ═══════════════════════════════════════════
                Stats (dark) + Personal Info
            ═══════════════════════════════════════════ */}
            <div className="about-stats-grid">
                {/* Dark stats card */}
                <article className="about-stats-dark">
                    <p className="about-stats-dark__label">{info.statsTitle}</p>
                    <div className="about-stats-dark__row">
                        {info.stats.slice(0, 2).map((s) => (
                            <div key={s.label}>
                                <p className="about-stats-dark__item-label">{s.label}</p>
                                <p className="about-stats-dark__item-value">{s.value}</p>
                            </div>
                        ))}
                    </div>
                    <p className="about-stats-dark__footer">
                        {locale === 'zh' ? '本站采用 51LA 网站统计' : 'Powered by 51LA Analytics'}
                    </p>
                </article>

                {/* Personal info card */}
                <article className="about-info-card">
                    <div className="about-info-item">
                        <p className="about-info-item__label">{locale === 'zh' ? '生于' : '生年'}</p>
                        <p className="about-info-item__value about-info-item__value--blue">1999</p>
                    </div>
                    <div className="about-info-item">
                        <p className="about-info-item__label">EDU</p>
                        <p className="about-info-item__value about-info-item__value--purple">
                            {locale === 'zh' ? '计算机专业' : 'コンピュータ'}
                        </p>
                    </div>
                    <div className="about-info-item">
                        <p className="about-info-item__label">{locale === 'zh' ? '现在职业' : '現職'}</p>
                        <p className="about-info-item__value about-info-item__value--red">
                            {locale === 'zh' ? '互联网' : 'IT業界'}
                        </p>
                    </div>
                </article>
            </div>

            {/* ═══════════════════════════════════════════
                Map
            ═══════════════════════════════════════════ */}
            <article className="about-map-card">
                <div style={{ position: 'relative', width: '100%', height: 240 }}>
                    <Image
                        src="/about/map-demo.svg"
                        alt="Map"
                        fill
                        className="about-map-card__img"
                        style={{ objectFit: 'cover' }}
                    />
                </div>
                <div className="about-map-card__body">
                    <p className="about-map-card__label">{info.mapTitle}</p>
                    <p className="about-map-card__text">{info.mapBody}</p>
                </div>
            </article>

            {/* ═══════════════════════════════════════════
                Journey — "Why I started"
            ═══════════════════════════════════════════ */}
            <article className="about-journey-card">
                <p className="about-journey-card__label">
                    {locale === 'zh' ? '心路历程' : '起源'}
                </p>
                <h3 className="about-journey-card__title">{narrative.routeTitle}</h3>
                <p className="about-journey-card__body">{narrative.routeIntro}</p>
            </article>

            {/* ═══════════════════════════════════════════
                Ten-Year Pact — progress bar
            ═══════════════════════════════════════════ */}
            <article className="about-pact-card">
                <p className="about-pact-card__label">{narrative.pactTitle}</p>
                <h3 className="about-pact-card__quote">
                    {locale === 'zh'
                        ? '一个人的寂寞，一群人的狂欢。'
                        : '一人の孤独、皆の祝祭。'}
                </h3>
                <div className="about-pact-progress">
                    <div className="about-pact-progress__fill" style={{ width: '33%' }}>
                        33%
                    </div>
                </div>
                <div className="about-pact-progress__dates">
                    <span>11/21/2022</span>
                    <span>11/21/2032</span>
                </div>
            </article>
        </>
    );
}
