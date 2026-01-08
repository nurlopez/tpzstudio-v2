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

  if (!isOpen) return null

  return (
    <div
      data-workspace-overlay
      data-overlay-type={type}
      data-overlay-slug={slug}
      className="fixed inset-0 w-screen h-screen z-[2000] overflow-y-auto"
      style={{
        backgroundColor: 'var(--bg-canvas)',
        transition: 'opacity var(--motion-slow) var(--ease-out)',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute rounded cursor-pointer text-sm font-inherit z-[2001]"
        style={{
          top: 'var(--space-lg)',
          right: 'var(--space-lg)',
          padding: 'var(--space-sm) var(--space-md)',
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--ink-primary)',
          transition: 'background-color var(--motion-fast) var(--ease-out), border-color var(--motion-fast) var(--ease-out)',
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
        Close
      </button>

      {/* Overlay content */}
      <div 
        className="max-w-[1200px] mx-auto"
        style={{
          padding: 'var(--space-3xl) var(--space-xl)',
        }}
      >
        {children || (
          <div>
            <h2 
              className="font-medium mb-md"
              style={{
                fontSize: 'var(--font-size-xl)',
                color: 'var(--ink-primary)',
              }}
            >
              Overlay: {type}
            </h2>
            {slug && (
              <p 
                className="mb-lg"
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--ink-secondary)',
                }}
              >
                Slug: {slug}
              </p>
            )}
            <p 
              style={{
                fontSize: 'var(--font-size-md)',
                color: 'var(--ink-primary)',
                lineHeight: 'var(--line-height-relaxed)',
              }}
            >
              Content will be rendered here
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
