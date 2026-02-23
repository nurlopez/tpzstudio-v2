'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useWorkspace } from './WorkspaceProvider'
import { Logo } from './Logo'

/**
 * Dock
 *
 * Persistent UI chrome — logo with entrance animation.
 */
export function Dock() {
  const router = useRouter()
  const { state } = useWorkspace()

  const handleLogoClick = () => {
    router.push('/')
  }

  return (
    <motion.div
      data-workspace-dock
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        onClick={handleLogoClick}
        style={{
          padding: 'var(--space-sm)',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity var(--motion-fast) var(--ease-out)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.7'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1'
        }}
        aria-label="Ir al inicio del workspace"
      >
        <Logo
          style={{
            height: '32px',
            width: 'auto',
          }}
        />
      </button>
    </motion.div>
  )
}
