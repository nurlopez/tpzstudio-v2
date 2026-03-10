'use client'

import React, { useEffect, useRef, useCallback } from 'react'

/**
 * FABDrawer
 *
 * Drawer container with escape handler and focus trapping.
 * Renders as a floating panel on desktop, bottom sheet on mobile.
 */
interface FABDrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  id: string
}

export function FABDrawer({ isOpen, onClose, title, children, id }: FABDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)

  // Focus trap
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
      return
    }

    if (e.key === 'Tab' && drawerRef.current) {
      const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }, [onClose])

  // Set up keyboard handler
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    } else {
      document.removeEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      ref={drawerRef}
      data-fab-drawer
      data-open={isOpen ? '' : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      id={id}
      className="fixed z-[1100] bg-white shadow-2xl overflow-hidden
        md:right-20 md:bottom-6 md:w-[360px] md:max-h-[80vh] md:rounded-xl
        right-0 bottom-0 w-full max-h-[90vh] rounded-t-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-black/10">
        <h2
          id={`${id}-title`}
          className="text-lg text-black/85"
          style={{ fontFamily: 'var(--font-lacquer), cursive' }}
        >
          {title}
        </h2>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="p-1 flex items-center justify-center text-black hover:opacity-60 transition-opacity duration-150 focus:outline-none"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 60px)' }}>
        {children}
      </div>
    </div>
  )
}
