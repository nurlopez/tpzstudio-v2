'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useWorkspace } from './WorkspaceProvider'

/**
 * Dock
 * 
 * Persistent UI chrome (logo, contact hint, etc.).
 * 
 * Responsibilities:
 * - Renders workspace logo/title (always visible)
 * - Renders contact hint (small, unobtrusive)
 * - Handles logo click → navigates to /workspace
 * - Positions itself (top-left or top-right)
 * 
 * Does NOT:
 * - Manage workspace state
 * - Render navigation menu
 * - Handle object interactions
 * 
 * Props: Minimal or none (uses global state for visibility)
 */
export function Dock() {
  const router = useRouter()
  const { state } = useWorkspace()

  const handleLogoClick = () => {
    router.push('/workspace')
  }

  return (
    <div data-workspace-dock>
      {/* Logo/Title */}
      <button
        onClick={handleLogoClick}
        style={{
          padding: 'var(--space-sm) var(--space-md)',
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '4px',
          color: 'var(--ink-primary)',
          cursor: 'pointer',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-medium)',
          fontFamily: 'inherit',
          transition: `
            background-color var(--motion-fast) var(--ease-out),
            border-color var(--motion-fast) var(--ease-out)
          `,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--bg-surface)'
          e.currentTarget.style.borderColor = 'var(--border-visible)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'
          e.currentTarget.style.borderColor = 'var(--border-subtle)'
        }}
      >
        TPZ Studio
      </button>
    </div>
  )
}
