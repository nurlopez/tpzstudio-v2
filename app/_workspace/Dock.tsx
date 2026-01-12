'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useWorkspace } from './WorkspaceProvider'
import { Logo } from './Logo'

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
      {/* Logo */}
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
        aria-label="Go to workspace home"
      >
        <Logo
          style={{
            height: '32px',
            width: 'auto',
          }}
        />
      </button>
    </div>
  )
}
