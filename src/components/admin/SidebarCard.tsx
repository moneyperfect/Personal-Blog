'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarCardProps {
    title: string;
    defaultExpanded?: boolean;
    children: ReactNode;
    extra?: ReactNode;
}

export default function SidebarCard({ title, defaultExpanded = true, children, extra }: SidebarCardProps) {
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
        <div className="admin-card overflow-hidden shadow-sm border border-surface-200 p-0">
            <button
                type="button"
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-surface-50 transition-colors focus:outline-none"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold tracking-wide text-surface-900">{title}</h3>
                </div>
                <div className="flex items-center gap-3">
                    <div onClick={(e) => e.stopPropagation()}>{extra}</div>
                    <svg
                        className={`w-4 h-4 text-surface-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>
            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                        <div className="p-4 pt-0 space-y-4 bg-white border-t border-surface-100">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
