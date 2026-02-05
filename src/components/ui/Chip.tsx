'use client';

import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
    active?: boolean;
    muted?: boolean;
}

export function Chip({ active = false, muted = false, className = '', ...props }: ChipProps) {
    const classes = ['chip', active ? 'chip-active' : '', muted ? 'chip-muted' : '', className]
        .filter(Boolean)
        .join(' ');
    return <span className={classes} {...props} />;
}

interface ChipButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
    muted?: boolean;
}

export function ChipButton({ active = false, muted = false, className = '', ...props }: ChipButtonProps) {
    const classes = ['chip', active ? 'chip-active' : '', muted ? 'chip-muted' : '', className]
        .filter(Boolean)
        .join(' ');
    return <button className={classes} {...props} />;
}
