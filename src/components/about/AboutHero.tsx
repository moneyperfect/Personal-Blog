'use client';

import { motion, useReducedMotion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useEffect } from 'react';
import type { AboutHeroContent } from './types'; // Although not fully used here anymore, kept for type safety

interface AboutHeroProps {
    locale: string;
    content: AboutHeroContent;
}

const BUBBLE_ITEMS_ZH = [
    { label: '艺术创作', x: -180, y: -80 },
    { label: '编程设计', x: -220, y: 30 },
    { label: '捕捉瞬间', x: -160, y: 140 },
    { label: '无限进步', x: 180, y: -60 },
    { label: '重拳出击', x: 220, y: 50 },
    { label: '唯唯诺诺', x: 150, y: 160 },
];

const BUBBLE_ITEMS_JA = [
    { label: 'クリエイティブ', x: -180, y: -80 },
    { label: 'コーディング', x: -220, y: 30 },
    { label: '瞬間を捉える', x: -160, y: 140 },
    { label: '無限の前進', x: 180, y: -60 },
    { label: 'ネットの力', x: 220, y: 50 },
    { label: 'オフは控えめ', x: 150, y: 160 },
];

export default function AboutHero({ locale }: AboutHeroProps) {
    const reduceMotion = useReducedMotion();
    const bubbles = locale === 'zh' ? BUBBLE_ITEMS_ZH : BUBBLE_ITEMS_JA;

    // Mouse tracking for parallax effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Subtle reverse parallax for avatar
    const avatarX = useTransform(springX, [-1, 1], [15, -15]);
    const avatarY = useTransform(springY, [-1, 1], [15, -15]);
    
    // Deeper parallax for bubbles
    const bubblesX = useTransform(springX, [-1, 1], [40, -40]);
    const bubblesY = useTransform(springY, [-1, 1], [40, -40]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const innerWidth = window.innerWidth;
            const innerHeight = window.innerHeight;
            const nX = (e.clientX / innerWidth) * 2 - 1;
            const nY = (e.clientY / innerHeight) * 2 - 1;
            mouseX.set(nX);
            mouseY.set(nY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <section className="relative w-full h-[400px] flex items-center justify-center mb-12">
            {/* Center Avatar Parallax Environment Only - No Background */}
            <motion.div 
                className="relative flex items-center justify-center"
                style={reduceMotion ? {} : { x: avatarX, y: avatarY }}
            >
                <motion.div 
                    className="about-avatar-ring cursor-pointer"
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <Image
                        src="/about/avatar-demo.svg"
                        alt="Avatar"
                        fill
                        className="object-cover"
                        sizes="180px"
                        priority
                    />
                </motion.div>
                <span className="about-avatar-online" />
            </motion.div>

            {/* Floating Bubbles */}
            <motion.div 
                style={reduceMotion ? {} : { x: bubblesX, y: bubblesY }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
                {bubbles.map((b) => (
                    <motion.div
                        key={b.label}
                        className="about-bubble-pill shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                        style={{ transform: `translate(${b.x}px, ${b.y}px)` }}
                        animate={{ y: [b.y, b.y - 8, b.y] }}
                        transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        {b.label}
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
