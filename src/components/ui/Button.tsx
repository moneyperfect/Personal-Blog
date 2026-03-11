'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'tonal' | 'text' | 'success';

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'btn btn-primary',
    tonal: 'btn btn-tonal',
    text: 'btn btn-text',
    success: 'btn btn-success',
};

// motion props omit issue workaround
type MotionButtonProps = HTMLMotionProps<"button">;
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionButtonProps>, MotionButtonProps {
    variant?: ButtonVariant;
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
    const classes = [variantClasses[variant], className].filter(Boolean).join(' ');
    return (
        <motion.button 
            className={classes} 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
            {...props} 
        />
    );
}

type MotionAnchorProps = HTMLMotionProps<"a">;
interface ButtonLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof MotionAnchorProps>, MotionAnchorProps {
    variant?: ButtonVariant;
}

export function ButtonLink({ variant = 'primary', className = '', ...props }: ButtonLinkProps) {
    const classes = [variantClasses[variant], className].filter(Boolean).join(' ');
    // using motion.a requires forwardRef for Next.js Link but usually it's fine as a child if passHref is used, or in Next 13+ Link wraps a directly
    return (
        <motion.a 
            className={classes} 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
            {...props} 
        />
    );
}
