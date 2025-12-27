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
            animate={{ opacity: [0.92, 1, 0.92] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
                position: 'absolute',
                inset: 0,
                background:
                    'radial-gradient(1000px 600px at 20% 15%, rgba(255,255,255,0.10), transparent 60%), linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.92))',
            }}
        />
    )
}
