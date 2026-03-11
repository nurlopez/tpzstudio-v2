'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/app/_components/PortableTextComponents'
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

  // Fetch content when panel opens with a slug
  useEffect(() => {
    if (!isOpen || !slug || type !== 'service') {
      setContent(null)
      return
    }

    setLoading(true)
    getWorkspaceObject(slug)
      .then((data) => {
        setContent(data)
        setLoading(false)
      })
      .catch(() => {
        setContent(null)
        setLoading(false)
      })
  }, [isOpen, slug, type])

  if (!isOpen) return null

  // PERMANENT: Panel behavior
  // Desktop: Side panel that feels like expansion from workspace
  // Mobile: Full-screen for content focus (workspace context maintained via dimming)
  const isFullScreen = state.isMobile

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
        aria-label="Cerrar panel"
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
                    Cargando...
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
                        fontFamily: 'var(--font-lacquer), cursive',
                        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                        fontWeight: 400,
                        color: 'var(--paper-ink-primary)',
                        marginBottom: 'var(--space-sm)',
                        lineHeight: 1.2,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {content.title}
                    </h2>
                  )}

                  {/* Short intent */}
                  {content.shortIntent && (
                    <p 
                      style={{
                        fontSize: 'clamp(1.05rem, 2vw, 1.15rem)',
                        color: 'var(--paper-ink-secondary)',
                        lineHeight: '1.6',
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
                    className="portable-text-fab"
                    style={{
                      fontSize: 'var(--font-size-md)',
                      color: 'var(--paper-ink-primary)',
                      lineHeight: 'var(--line-height-relaxed)',
                      marginBottom: content.capabilities && content.capabilities.length > 0 ? 'var(--space-2xl)' : 0,
                    }}
                  >
                    <PortableText value={content.description} components={portableTextComponents} />
                  </div>
                )}

                {/* Proyectos relacionados */}
                {content.capabilities && content.capabilities.length > 0 && (
                  <nav
                    style={{
                      marginTop: 'var(--space-2xl)',
                      paddingTop: 'var(--space-xl)',
                    }}
                    aria-label="Proyectos relacionados"
                  >
                    <h3
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 500,
                        color: 'var(--paper-ink-muted)',
                        marginBottom: 'var(--space-md)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      Proyectos
                    </h3>
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: content.showThumbnails ? 'var(--space-xs)' : 'var(--space-sm)',
                      }}
                    >
                      {content.capabilities.map((capability) => (
                        <li key={capability._id}>
                          {content.showThumbnails ? (
                            <Link
                              href={`/proyectos/${capability.slug}`}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-sm)',
                                textDecoration: 'none',
                                color: 'inherit',
                                padding: 'var(--space-xs)',
                                borderRadius: '8px',
                                transition: 'background-color var(--motion-fast) var(--ease-out)',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)'
                                const title = e.currentTarget.querySelector('[data-thumb-title]') as HTMLElement
                                if (title) title.style.textDecoration = 'underline'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent'
                                const title = e.currentTarget.querySelector('[data-thumb-title]') as HTMLElement
                                if (title) title.style.textDecoration = 'none'
                              }}
                            >
                              {capability.coverImage?.url && (
                                <Image
                                  src={capability.coverImage.url}
                                  alt=""
                                  width={60}
                                  height={40}
                                  style={{
                                    borderRadius: '8px',
                                    border: '1px solid rgba(0,0,0,0.06)',
                                    objectFit: 'cover',
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                              <div style={{ minWidth: 0 }}>
                                <span
                                  data-thumb-title
                                  style={{
                                    fontSize: 'var(--font-size-sm)',
                                    color: 'var(--paper-ink-interactive)',
                                    display: 'block',
                                  }}
                                >
                                  {capability.title}
                                </span>
                                {capability.excerpt && (
                                  <span
                                    style={{
                                      fontSize: 'var(--font-size-xs)',
                                      color: 'var(--paper-ink-muted)',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden',
                                      lineHeight: '1.4',
                                    }}
                                  >
                                    {capability.excerpt}
                                  </span>
                                )}
                              </div>
                            </Link>
                          ) : (
                            <Link
                              href={`/proyectos/${capability.slug}`}
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
                          )}
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}

                {/* Artículos relacionados */}
                {content.relatedPosts && content.relatedPosts.length > 0 && (
                  <nav
                    style={{
                      marginTop: 'var(--space-xl)',
                      paddingTop: 'var(--space-xl)',
                    }}
                    aria-label="Artículos relacionados"
                  >
                    <h3
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 500,
                        color: 'var(--paper-ink-muted)',
                        marginBottom: 'var(--space-md)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      Blog
                    </h3>
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: content.showThumbnails ? 'var(--space-xs)' : 'var(--space-sm)',
                      }}
                    >
                      {content.relatedPosts.map((post) => (
                        <li key={post._id}>
                          {content.showThumbnails ? (
                            <Link
                              href={`/blog/${post.slug}`}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-sm)',
                                textDecoration: 'none',
                                color: 'inherit',
                                padding: 'var(--space-xs)',
                                borderRadius: '8px',
                                transition: 'background-color var(--motion-fast) var(--ease-out)',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)'
                                const title = e.currentTarget.querySelector('[data-thumb-title]') as HTMLElement
                                if (title) title.style.textDecoration = 'underline'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent'
                                const title = e.currentTarget.querySelector('[data-thumb-title]') as HTMLElement
                                if (title) title.style.textDecoration = 'none'
                              }}
                            >
                              {post.coverImage?.url && (
                                <Image
                                  src={post.coverImage.url}
                                  alt=""
                                  width={60}
                                  height={40}
                                  style={{
                                    borderRadius: '8px',
                                    border: '1px solid rgba(0,0,0,0.06)',
                                    objectFit: 'cover',
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                              <div style={{ minWidth: 0 }}>
                                <span
                                  data-thumb-title
                                  style={{
                                    fontSize: 'var(--font-size-sm)',
                                    color: 'var(--paper-ink-interactive)',
                                    display: 'block',
                                  }}
                                >
                                  {post.title}
                                </span>
                                {post.excerpt && (
                                  <span
                                    style={{
                                      fontSize: 'var(--font-size-xs)',
                                      color: 'var(--paper-ink-muted)',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden',
                                      lineHeight: '1.4',
                                    }}
                                  >
                                    {post.excerpt}
                                  </span>
                                )}
                              </div>
                            </Link>
                          ) : (
                            <Link
                              href={`/blog/${post.slug}`}
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
                              {post.title}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}

                    {/* Empty state */}
                    {!loading && !content && slug && (
                      <p
                        style={{
                          fontSize: 'var(--font-size-sm)',
                          color: 'var(--paper-ink-muted)',
                        }}
                      >
                        Sin contenido disponible
                      </p>
                    )}
                  </>
                )}
              </>
            )}

            {/* For contact, about, and archive panels: render children (server-rendered content) */}
            {(type === 'contact' || type === 'about' || type === 'archive') && (
              <div data-panel-children style={{ paddingBottom: 'var(--space-3xl)' }}>
                {children || (
                  <p 
                    style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--paper-ink-muted)',
                    }}
                  >
                    Cargando contenido... (no se recibió `children`)
                  </p>
                )}
              </div>
            )}
          </div>
      </div>
    </div>
  )
}
