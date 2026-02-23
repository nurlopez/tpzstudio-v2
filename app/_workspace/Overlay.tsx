'use client'

import React from 'react'
import { OverlayType } from './types'

/**
 * Overlay
 * 
 * Full-screen overlay for project details or other deep content.
 * 
 * Responsibilities:
 * - Renders full-screen overlay container
 * - Renders overlay content (project media, description, credits)
 * - Handles overlay open/close animations
 * - Manages overlay scroll
 * - Renders close button
 * - Handles ESC key (delegates to WorkspaceRoot)
 * 
 * Does NOT:
 * - Fetch overlay content (receives as prop or children)
 * - Manage overlay state (reads from global state)
 * - Handle navigation (delegates to router)
 * 
 * Props:
 * - isOpen: boolean - From global state
 * - type: 'project' | 'about' - Overlay type
 * - slug?: string - Project slug
 * - children: ReactNode - Overlay content (fetched by page component)
 * - onClose: () => void - Close handler (updates route)
 */
interface OverlayProps {
  isOpen: boolean
  type: OverlayType
  slug?: string
  children?: React.ReactNode
  onClose: () => void
}

export function Overlay({ isOpen, type, slug, children, onClose }: OverlayProps) {
  if (!isOpen) return null

  return (
    <div
      data-workspace-overlay
      data-overlay-type={type}
      data-overlay-slug={slug}
      className="fixed inset-0 w-screen h-screen z-[2000] overflow-y-auto"
      style={{
        backgroundColor: '#ffffff',
        color: 'var(--paper-ink-primary)',
        transition: 'opacity var(--motion-slow) var(--ease-out)',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute cursor-pointer font-inherit z-[2001]"
        aria-label="Cerrar ventana"
        style={{
          top: 'var(--space-lg)',
          right: 'var(--space-lg)',
          width: '32px',
          height: '32px',
          padding: 0,
          backgroundColor: 'transparent',
          border: 'none',
          color: 'var(--paper-ink-primary)',
          fontSize: '24px',
          lineHeight: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity var(--motion-fast) var(--ease-out), transform var(--motion-fast) var(--ease-out)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.6'
          e.currentTarget.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        ×
      </button>

      {/* Overlay content */}
      <div
        className="max-w-[900px] mx-auto"
        style={{
          padding: 'var(--space-3xl) var(--space-xl)',
        }}
      >
        {children || (
          <div>
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--paper-ink-muted)',
              }}
            >
              El contenido se mostrará aquí
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
