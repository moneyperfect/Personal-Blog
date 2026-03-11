'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';

interface RevealProps {
    children: React.ReactNode;
    width?: 'fit-content' | '100%';
    delay?: number;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function Reveal({ children, width = '100%', delay = 0, className = '', direction = 'up' }: RevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const getInitialProps = () => {
        switch (direction) {
            case 'up': return { opacity: 0, y: 30 };
            case 'down': return { opacity: 0, y: -30 };
            case 'left': return { opacity: 0, x: 30 };
            case 'right': return { opacity: 0, x: -30 };
            case 'none': return { opacity: 0 };
            default: return { opacity: 0, y: 30 };
        }
    };

    const getAnimateProps = () => {
        switch (direction) {
            case 'up': case 'down': return { opacity: 1, y: 0 };
            case 'left': case 'right': return { opacity: 1, x: 0 };
            case 'none': return { opacity: 1 };
            default: return { opacity: 1, y: 0 };
        }
    };

    return (
        <div ref={ref} style={{ width }} className={className}>
            <motion.div
                initial={getInitialProps()}
                animate={isInView ? getAnimateProps() : getInitialProps()}
                transition={{ duration: 0.5, delay: delay, ease: 'easeOut' }}
            >
                {children}
            </motion.div>
        </div>
    );
}

// 供列表使用的 Stagger Group
interface StaggerGroupProps {
    children: React.ReactNode;
    className?: string;
    delayOrder?: number;
}

export function StaggerGroup({ children, className = '', delayOrder = 0 }: StaggerGroupProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: delayOrder * 0.1
            }
        }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// 供列表项引用的 item variants
export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

interface StaggerItemProps {
    children: React.ReactNode;
    className?: string;
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
    return (
        <motion.div variants={staggerItem} className={className}>
            {children}
        </motion.div>
    );
}
