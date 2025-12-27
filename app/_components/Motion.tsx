'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type RevealProps = {
    children: ReactNode
    delay?: number
    y?: number
}

export function Reveal({ children, delay = 0, y = 12 }: RevealProps) {
    const reduce = useReducedMotion()

    if (reduce) return <>{children}</>

    return (
        <motion.div
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
        >
            {children}
        </motion.div>
    )
}

type HoverLiftProps = {
    children: ReactNode
}

export function HoverLift({ children }: HoverLiftProps) {
    const reduce = useReducedMotion()
    if (reduce) return <>{children}</>

    return (
        <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ willChange: 'transform' }}
        >
            {children}
        </motion.div>
    )
}
