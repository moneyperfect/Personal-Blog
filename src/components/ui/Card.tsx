'use client';

import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
}

export function Card({ hover = true, className = '', ...props }: CardProps) {
    const classes = ['card', hover ? 'card-hover' : '', className].filter(Boolean).join(' ');
    return <div className={classes} {...props} />;
}
