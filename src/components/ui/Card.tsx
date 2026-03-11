'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import type { HTMLAttributes } from 'react';

type MotionDivProps = HTMLMotionProps<"div">;
interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, keyof MotionDivProps>, MotionDivProps {
    hover?: boolean;
}

export function Card({ hover = true, className = '', ...props }: CardProps) {
    const classes = ['card', hover ? 'card-hover' : '', className].filter(Boolean).join(' ');
    
    // Add motion attributes conditionally based on hover prop
    const motionProps = hover ? {
        whileHover: { scale: 1.02, y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' },
        whileTap: { scale: 0.98 },
        transition: { duration: 0.15 }
    } : {};

    return <motion.div className={classes} {...motionProps} {...props} />;
}
