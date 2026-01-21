import { client } from '@/sanity/lib/client'
import { aboutPageWorkspaceQuery } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { Metadata } from 'next'

/**
 * About Page (Sobre mí)
 * 
 * Route: /workspace/sobre-mi
 * 
 * This page is rendered when the about panel is open.
 * The Panel component is rendered by WorkspaceRoot based on workspace state.
 * 
 * Fetches about data from Sanity and renders it within the panel.
 */
export async function generateMetadata(): Promise<Metadata> {
  const about = await client.fetch(aboutPageWorkspaceQuery)
  
  const title = about?.seo?.metaTitle || about?.title || 'Sobre mí'
  const description = about?.seo?.metaDescription || 'Learn more about TPZ Studio, our mission, values, and creative approach.'
  const ogImage = about?.image?.asset?.url

  return {
    title,
    description,
    openGraph: {
      title: `${title} | TPZ Studio`,
      description,
      url: '/workspace/sobre-mi',
      images: ogImage ? [{ url: ogImage, alt: about?.image?.alt || about?.title || 'About TPZ Studio' }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | TPZ Studio`,
      description,
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function AboutPage() {
  try {
    const about = await client.fetch(aboutPageWorkspaceQuery)

    if (!about) {
      return (
        <div data-about-content style={{ padding: 'var(--space-xl)' }}>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--ink-muted)' }}>
            About content not available. Please check Sanity Studio.
          </p>
        </div>
      )
    }

    return (
      <div data-about-content>
      {/* Header */}
      {about.title && (
        <header
          style={{
            marginBottom: 'var(--space-2xl)',
          }}
        >
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--ink-primary)',
              marginBottom: 0,
              lineHeight: 'var(--line-height-tight)',
            }}
          >
            {about.title}
          </h2>
        </header>
      )}

      {/* Image */}
      {about.image?.asset?.url && (
        <div
          style={{
            marginBottom: 'var(--space-2xl)',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-elevated)',
          }}
        >
          <Image
            src={about.image.asset.url}
            alt={about.image.alt || about.title || 'About'}
            width={800}
            height={600}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      )}

      {/* Body Content - Rich Text */}
      {about.body && Array.isArray(about.body) && about.body.length > 0 && (
        <div
          style={{
            fontSize: 'var(--font-size-md)',
            color: 'var(--ink-primary)',
            lineHeight: 'var(--line-height-relaxed)',
            marginBottom: about.cta ? 'var(--space-2xl)' : 0,
          }}
        >
          <PortableText value={about.body} />
        </div>
      )}

      {/* CTA */}
      {about.cta?.text && about.cta?.url && (
        <div
          style={{
            marginTop: 'var(--space-2xl)',
            paddingTop: 'var(--space-xl)',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <a
            href={about.cta.url}
            style={{
              display: 'inline-block',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--ink-interactive)',
              textDecoration: 'none',
              padding: 'var(--space-sm) var(--space-md)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-elevated)',
              transition: 'background-color var(--motion-fast) var(--ease-out), border-color var(--motion-fast) var(--ease-out)',
            }}
            className="cta-button"
          >
            {about.cta.text}
          </a>
        </div>
      )}
      </div>
    )
  } catch (error) {
    console.error('[AboutPage] Error fetching about data:', error)
    return (
      <div style={{ padding: 'var(--space-xl)' }}>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--ink-muted)' }}>
          Error loading about content. Please try again later.
        </p>
      </div>
    )
  }
}
