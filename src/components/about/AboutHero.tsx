'use client';

import { motion, useReducedMotion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import type { AboutHeroContent } from './types';
import { useEffect } from 'react';

interface AboutHeroProps {
    locale: string;
    content: AboutHeroContent;
}

const BUBBLE_ITEMS_ZH = [
    { label: '艺术创作', x: -160, y: -60 },
    { label: '编程设计', x: -180, y: 30 },
    { label: '捕捉瞬间', x: -140, y: 120 },
    { label: '无限进步', x: 160, y: -40 },
    { label: '重拳出击', x: 180, y: 50 },
    { label: '唯唯诺诺', x: 130, y: 140 },
];

const BUBBLE_ITEMS_JA = [
    { label: 'クリエイティブ', x: -160, y: -60 },
    { label: 'コーディング', x: -180, y: 30 },
    { label: '瞬間を捉える', x: -140, y: 120 },
    { label: '無限の前進', x: 160, y: -40 },
    { label: 'ネットの力', x: 180, y: 50 },
    { label: 'オフは控えめ', x: 130, y: 140 },
];

export default function AboutHero({ locale, content }: AboutHeroProps) {
    const reduceMotion = useReducedMotion();
    const bubbles = locale === 'zh' ? BUBBLE_ITEMS_ZH : BUBBLE_ITEMS_JA;

    // Mouse tracking for parallax effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Subtle reverse parallax
    const avatarX = useTransform(springX, [-1, 1], [15, -15]);
    const avatarY = useTransform(springY, [-1, 1], [15, -15]);
    
    // Deeper parallax for bubbles
    const bubblesX = useTransform(springX, [-1, 1], [30, -30]);
    const bubblesY = useTransform(springY, [-1, 1], [30, -30]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const innerWidth = window.innerWidth;
            const innerHeight = window.innerHeight;
            // Normalize mouse position between -1 and 1
            const nX = (e.clientX / innerWidth) * 2 - 1;
            const nY = (e.clientY / innerHeight) * 2 - 1;
            mouseX.set(nX);
            mouseY.set(nY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <section className="about-hero-grid">
            {/* Left Card - Deep Dark Panel */}
            <motion.article 
                className="about-bento-card about-hover-spring about-hero-dark"
            >
                <div className="about-eyebrow">
                    {locale === 'zh' ? '座右铭' : '座右銘'}
                </div>
                <h2>{content.name}</h2>
                <p className="tagline">
                    {locale === 'zh' 
                        ? '倘若生活太苦，我便往里加点糖。\n热爱一切未知的创造力与审美。' 
                        : '人生が苦いなら、砂糖を足せばいい。\n未知の表現と美を愛する。'}
                </p>
            </motion.article>

            {/* Center Card - Avatar Parallax Environment */}
            <motion.article className="about-bento-card about-hover-spring about-hero-avatar-card">
                <motion.div 
                    className="about-avatar-wrapper"
                    style={reduceMotion ? {} : { x: avatarX, y: avatarY }}
                >
                    <div className="about-avatar-ring">
                        <Image
                            src="/about/avatar-demo.svg"
                            alt="Avatar"
                            fill
                            className="object-cover"
                            sizes="180px"
                            priority
                        />
                    </div>
                    <span className="about-avatar-online" />
                </motion.div>

                <motion.div 
                    style={reduceMotion ? {} : { x: bubblesX, y: bubblesY }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    {bubbles.map((b) => (
                        <div
                            key={b.label}
                            className="about-bubble-pill"
                            style={{ transform: `translate(${b.x}px, ${b.y}px)` }}
                        >
                            {b.label}
                        </div>
                    ))}
                </motion.div>
            </motion.article>

            {/* Right Card - Ideal Text Group */}
            <motion.article className="about-bento-card about-hover-spring about-hero-ideal">
                <div className="about-eyebrow">
                    {locale === 'zh' ? '极客精神' : 'Geek Spirit'}
                </div>
                <div className="about-ideal-text-group">
                    <h3>{locale === 'zh' ? '源于' : '始まりは'}</h3>
                    <h3>
                        {locale === 'zh' ? '热爱而去 ' : '愛するために '}
                        <span className="text-slate-400 font-normal">
                             {locale === 'zh' ? '努力' : '努力'}
                        </span>
                    </h3>
                    <h3>
                        <span className="accent">{locale === 'zh' ? '创作' : '創作'}</span>
                    </h3>
                </div>
            </motion.article>
        </section>
    );
}
