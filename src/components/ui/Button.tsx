'use client';

import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'tonal' | 'text' | 'success';

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'btn btn-primary',
    tonal: 'btn btn-tonal',
    text: 'btn btn-text',
    success: 'btn btn-success',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
    const classes = [variantClasses[variant], className].filter(Boolean).join(' ');
    return <button className={classes} {...props} />;
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    variant?: ButtonVariant;
}

export function ButtonLink({ variant = 'primary', className = '', ...props }: ButtonLinkProps) {
    const classes = [variantClasses[variant], className].filter(Boolean).join(' ');
    return <a className={classes} {...props} />;
}
