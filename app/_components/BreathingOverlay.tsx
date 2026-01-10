'use client'

import { motion, useReducedMotion } from 'framer-motion'

export function BreathingOverlay() {
    const reduce = useReducedMotion()

    if (reduce) {
        return (
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        'radial-gradient(1000px 600px at 20% 15%, rgba(255,255,255,0.10), transparent 60%), linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.92))',
                }}
            />
        )
    }

    return (
        <motion.div
            aria-hidden
            animate={{ opacity: [0.88, 0.96, 0.88] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
                position: 'absolute',
                inset: 0,
                background:
                    'radial-gradient(ellipse 1200px 800px at 30% 20%, rgba(255,240,200,0.08) 0%, transparent 65%), linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.88))',
                zIndex: 1,
            }}
        />
    )
}
