import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import { projectBySlugQuery } from '@/sanity/lib/queries'
import Image from 'next/image'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

/**
 * Project Detail Page
 * 
 * Route: /workspace/projects/[slug]
 * 
 * This page is rendered when a project detail overlay is open.
 * The Overlay component is rendered by WorkspaceRoot based on workspace state.
 * 
 * Fetches project data from Sanity and renders it within the overlay.
 */
interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await client.fetch(projectBySlugQuery, { slug })

  if (!project) {
    return {
      title: 'Project Not Found | TPZ Studio',
    }
  }

  const title = project.seo?.metaTitle || project.title
  const description = project.seo?.metaDescription || project.excerpt || `View ${project.title} project details and case study.`
  const ogImage = project.seo?.ogImage?.asset?.url || project.coverImage?.asset?.url

  return {
    title,
    description,
    openGraph: {
      title: `${title} | TPZ Studio`,
      description,
      url: `/workspace/projects/${slug}`,
      type: 'article',
      images: ogImage ? [{ url: ogImage, alt: project.coverImage?.alt || project.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | TPZ Studio`,
      description,
      images: ogImage ? [ogImage] : [],
    },
  }
}

/**
 * Video URL utilities - reused from old project page
 */
function isYouTube(url: string) {
  return /youtube\.com|youtu\.be/.test(url)
}

function isVimeo(url: string) {
  return /vimeo\.com/.test(url)
}

function isMp4(url: string) {
  return /\.mp4(\?.*)?$/i.test(url)
}

function toEmbedUrl(url: string) {
  if (isYouTube(url)) {
    const m = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]v=([a-zA-Z0-9_-]+)/)
    const id = m?.[1]
    return id
      ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&mute=0&controls=1&playsinline=1`
      : url
  }
  if (isVimeo(url)) {
    const m = url.match(/vimeo\.com\/(\d+)/)
    const id = m?.[1]
    return id ? `https://player.vimeo.com/video/${id}` : url
  }
  return url
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params

  if (!slug) {
    return (
      <div style={{ padding: 'var(--space-xl)' }}>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--ink-muted)' }}>
          Missing slug.
        </p>
      </div>
    )
  }

  const project = await client.fetch(projectBySlugQuery, { slug })

  if (!project) {
    return (
      <div style={{ padding: 'var(--space-xl)' }}>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--ink-muted)' }}>
          Project not found.
        </p>
      </div>
    )
  }

  const videoUrl: string | undefined = project?.video?.url
  const embedUrl = videoUrl && !isMp4(videoUrl) ? toEmbedUrl(videoUrl) : null

  return (
    <div data-project-content>
      {/* Project Header */}
      <header
        style={{
          marginBottom: 'var(--space-2xl)',
        }}
      >
        {/* Project Title */}
        {project.title && (
          <h1
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--ink-primary)',
              marginBottom: project.excerpt ? 'var(--space-md)' : 0,
              lineHeight: 'var(--line-height-tight)',
            }}
          >
            {project.title}
          </h1>
        )}

        {/* Excerpt */}
        {project.excerpt && (
          <p
            style={{
              fontSize: 'var(--font-size-md)',
              color: 'var(--ink-primary)',
              lineHeight: 'var(--line-height-relaxed)',
              marginBottom: 0,
            }}
          >
            {project.excerpt}
          </p>
        )}
      </header>

      {/* Video or Cover Image */}
      {videoUrl ? (
        <div
          style={{
            marginBottom: 'var(--space-2xl)',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-elevated)',
          }}
        >
          <div style={{ position: 'relative', aspectRatio: '16 / 9' }}>
            {isMp4(videoUrl) ? (
              <video
                controls
                playsInline
                preload="metadata"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
            ) : (
              <iframe
                src={embedUrl ?? videoUrl}
                title={project.title ?? 'Video'}
                allow="autoplay; fullscreen; picture-in-picture"
                style={{ width: '100%', height: '100%', border: 0 }}
              />
            )}
          </div>
        </div>
      ) : project.coverImage?.asset?.url ? (
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
            src={project.coverImage.asset.url}
            alt={project.coverImage.alt || project.title || 'Project cover'}
            width={1200}
            height={675}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </div>
      ) : null}

      {/* Body Content - Rich Text */}
      {project.body && Array.isArray(project.body) && project.body.length > 0 && (
        <div
          style={{
            fontSize: 'var(--font-size-md)',
            color: 'var(--ink-primary)',
            lineHeight: 'var(--line-height-relaxed)',
            marginBottom: (project.categories?.length > 0 || project.credits?.length > 0)
              ? 'var(--space-2xl)'
              : 0,
          }}
        >
          <PortableText value={project.body} />
        </div>
      )}

      {/* Categories */}
      {Array.isArray(project.categories) && project.categories.length > 0 && (
        <div
          style={{
            marginBottom: project.credits?.length > 0 ? 'var(--space-xl)' : 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-sm)',
            }}
          >
            {project.categories.map((category: string) => (
              <span
                key={category}
                style={{
                  fontSize: 'var(--font-size-xs)',
                  padding: 'var(--space-xs) var(--space-sm)',
                  borderRadius: '4px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-elevated)',
                  color: 'var(--ink-secondary)',
                  fontWeight: 'var(--font-weight-medium)',
                  letterSpacing: '0.02em',
                }}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Credits */}
      {Array.isArray(project.credits) && project.credits.length > 0 && (
        <div
          style={{
            marginTop: 'var(--space-xl)',
            paddingTop: 'var(--space-xl)',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <h3
            style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--ink-secondary)',
              marginBottom: 'var(--space-md)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Credits
          </h3>
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
            {project.credits.map((credit: { role?: string; name?: string }, index: number) => (
              <li key={index}>
                <div
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--ink-primary)',
                    lineHeight: 'var(--line-height-relaxed)',
                  }}
                >
                  {credit.role && (
                    <span
                      style={{
                        fontWeight: 'var(--font-weight-medium)',
                        marginRight: 'var(--space-xs)',
                      }}
                    >
                      {credit.role}:
                    </span>
                  )}
                  {credit.name && <span>{credit.name}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
