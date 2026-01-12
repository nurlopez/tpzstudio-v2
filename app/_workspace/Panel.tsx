'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useWorkspace } from './WorkspaceProvider'
import { PanelType } from './types'
import { getWorkspaceObject, WorkspaceObjectContent } from './lib/getWorkspaceObject'

/**
 * Panel
 * 
 * Expandable side panel for service/archive/contact content.
 * 
 * Responsibilities:
 * - Renders panel container (slide-in animation)
 * - Renders panel content (service details, project list, contact form)
 * - Handles panel open/close animations
 * - Manages panel scroll (if content overflows)
 * - Renders close button
 * - Handles click-outside-to-close (delegates to canvas)
 * 
 * Does NOT:
 * - Fetch panel content (receives as prop or children)
 * - Manage panel state (reads from global state)
 * - Handle object interactions (objects are separate)
 * - Render project details (delegates to Overlay)
 * 
 * Props:
 * - isOpen: boolean - From global state
 * - type: 'service' | 'archive' | 'contact' - Panel type
 * - slug?: string - Object/project slug
 * - children: ReactNode - Panel content (fetched by page component)
 * - onClose: () => void - Close handler (updates route)
 * 
 * Variants:
 * - Desktop: Side panel (left or right)
 * - Mobile: Full-screen overlay
 */
interface PanelProps {
  isOpen: boolean
  type: PanelType
  slug?: string
  children?: React.ReactNode
  onClose: () => void
}

/**
 * Convert Sanity portable text blocks to plain text
 * Minimal implementation - just extracts text content
 */
function portableTextToPlainText(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''
  
  return blocks
    .map((block) => {
      if (block._type === 'block' && block.children) {
        return block.children
          .map((child: any) => child.text || '')
          .join('')
      }
      return ''
    })
    .join('\n\n')
    .trim()
}

export function Panel({ isOpen, type, slug, children, onClose }: PanelProps) {
  const { state } = useWorkspace()
  const [content, setContent] = useState<WorkspaceObjectContent | null>(null)
  const [loading, setLoading] = useState(false)

  // Debug logging
  console.log('[Panel] Render:', { isOpen, type, slug, hasChildren: !!children })

  // Fetch content when panel opens with a slug
  useEffect(() => {
    console.log('[Panel] useEffect triggered:', { isOpen, slug, type })
    
    if (!isOpen || !slug || type !== 'service') {
      console.log('[Panel] Skipping fetch - conditions not met:', { isOpen, slug, type })
      setContent(null)
      return
    }

    console.log('[Panel] Fetching content for slug:', slug)
    setLoading(true)
    getWorkspaceObject(slug)
      .then((data) => {
        console.log('[Panel] Content fetched successfully:', data)
        console.log('[Panel] Content type:', typeof data)
        console.log('[Panel] Content.title:', data?.title)
        console.log('[Panel] Content.title truthy?', !!data?.title)
        console.log('[Panel] Content.visual:', data?.visual)
        console.log('[Panel] Content.visual?.url:', data?.visual?.url)
        setContent(data)
        setLoading(false)
        // Force a re-render check
        setTimeout(() => {
          console.log('[Panel] State after setContent - content:', data)
          console.log('[Panel] State after setContent - visual:', data?.visual)
        }, 100)
      })
      .catch((error) => {
        console.error('[Panel] Error fetching content:', error)
        setContent(null)
        setLoading(false)
      })
  }, [isOpen, slug, type])

  if (!isOpen) return null

  // PERMANENT: Panel behavior
  // Desktop: Side panel that feels like expansion from workspace
  // Mobile: Full-screen for content focus (workspace context maintained via dimming)
  const isFullScreen = state.isMobile

  console.log('[Panel] Rendering panel:', { isOpen, type, slug, loading })
  console.log('[Panel] Content state:', content)
  console.log('[Panel] Content object (stringified):', JSON.stringify(content, null, 2))
  console.log('[Panel] Content.visual:', content?.visual)
  console.log('[Panel] Content.visual?.url:', content?.visual?.url)
  console.log('[Panel] Will render visual?', !!(content && content.visual && content.visual.url))
  console.log('[Panel] Content.title value:', content?.title)
  console.log('[Panel] Content.title type:', typeof content?.title)
  console.log('[Panel] Content.title truthy check:', !!content?.title)
  console.log('[Panel] Will render title?', !!(content && content.title))

  return (
    <div
      data-workspace-panel
      data-panel-type={type}
      data-panel-slug={slug}
      className="fixed top-0 right-0 w-[400px] h-screen z-[1000] overflow-y-auto translate-x-0 md:w-[400px] max-md:w-screen max-md:border-l-0"
      style={{
        transition: 'transform var(--motion-slow) var(--ease-out)',
      }}
      // PERMANENT: Panel feels like workspace expansion, not page navigation
      // Canvas remains visible (dimmed) to maintain spatial context
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute cursor-pointer font-inherit"
        aria-label="Close panel"
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

      {/* Panel content */}
      <div
        className="max-w-full"
        style={{
          padding: 'var(--space-3xl) var(--space-xl)',
        }}
        data-content-source="sanity"
      >
        {/* Render content based on panel type */}
        <div data-panel-content>
            {/* For service panels: fetch and render workspace object content */}
            {type === 'service' && (
              <>
                {/* Loading state - show while fetching */}
                {loading && slug && (
                  <p 
                    style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--paper-ink-muted)',
                      marginBottom: 'var(--space-md)',
                    }}
                  >
                    Loading...
                  </p>
                )}

                {/* Content - only render when not loading and content exists */}
                {!loading && content && (
                  <>
                    {/* Panel Header - visual, title, intent grouped as single unit */}
                <header
                  style={{
                    marginBottom: 'var(--space-2xl)',
                  }}
                >
                  {/* Object visual - icon-size visual label */}
                  {content.visual?.url && (
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        marginBottom: 'var(--space-md)',
                      }}
                      aria-hidden={content.visual.alt ? undefined : 'true'}
                    >
                      <Image
                        src={content.visual.url}
                        alt={content.visual.alt || ''}
                        width={40}
                        height={40}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                        sizes="40px"
                        unoptimized={content.visual.url.endsWith('.svg')}
                      />
                    </div>
                  )}

                  {/* Object title */}
                  {content.title && (
                    <h2 
                      style={{
                        fontSize: 'var(--font-size-xl)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--paper-ink-primary)',
                        marginBottom: 'var(--space-sm)',
                        lineHeight: 'var(--line-height-tight)',
                      }}
                    >
                      {content.title}
                    </h2>
                  )}

                  {/* Short intent */}
                  {content.shortIntent && (
                    <p 
                      style={{
                        fontSize: 'var(--font-size-md)',
                        color: 'var(--paper-ink-primary)',
                        lineHeight: 'var(--line-height-relaxed)',
                        marginBottom: 0,
                      }}
                    >
                      {content.shortIntent}
                    </p>
                  )}
                </header>

                {/* Body Content - description, rich text */}
                {content.description && (
                  <div 
                    style={{
                      fontSize: 'var(--font-size-md)',
                      color: 'var(--paper-ink-primary)',
                      lineHeight: 'var(--line-height-relaxed)',
                      marginBottom: content.capabilities && content.capabilities.length > 0 ? 'var(--space-2xl)' : 0,
                    }}
                  >
                    {portableTextToPlainText(content.description).split('\n\n').map((paragraph, index, array) => (
                      <p
                        key={index}
                        style={{
                          marginTop: 0,
                          marginBottom: index < array.length - 1 ? 'var(--space-md)' : 0,
                        }}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

                {/* Exit Points - capabilities links */}
                {content.capabilities && content.capabilities.length > 0 && (
                  <nav
                    style={{
                      marginTop: 'var(--space-2xl)',
                      paddingTop: 'var(--space-xl)',
                    }}
                    aria-label="Related projects"
                  >
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-sm)',
                      }}
                    >
                      {content.capabilities.map((capability) => (
                        <li key={capability._id}>
                          <Link
                            href={`/workspace/projects/${capability.slug}`}
                            style={{
                              fontSize: 'var(--font-size-sm)',
                              color: 'var(--paper-ink-interactive)',
                              textDecoration: 'none',
                              display: 'inline-block',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.textDecoration = 'underline'
                              e.currentTarget.style.color = '#c14444'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.textDecoration = 'none'
                              e.currentTarget.style.color = 'var(--paper-ink-interactive)'
                            }}
                          >
                            {capability.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}

                    {/* Empty state - show if not loading and no content */}
                    {!loading && !content && slug && (
                      <p 
                        style={{
                          fontSize: 'var(--font-size-sm)',
                          color: 'var(--paper-ink-muted)',
                        }}
                      >
                        No content available
                      </p>
                    )}
                  </>
                )}
              </>
            )}

            {/* For contact, about, and archive panels: render children (server-rendered content) */}
            {(type === 'contact' || type === 'about' || type === 'archive') && (
              <div data-panel-children>
                {children || (
                  <p 
                    style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--paper-ink-muted)',
                    }}
                  >
                    Content loading... (No children prop received)
                  </p>
                )}
              </div>
            )}
          </div>
      </div>
    </div>
  )
}
