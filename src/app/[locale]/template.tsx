'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
            }}
            className="flex-1 flex flex-col"
        >
            {children}
        </motion.div>
    );
}
