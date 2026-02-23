import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import { projectBySlugQuery, relatedProjectsQuery } from '@/sanity/lib/queries'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

/**
 * Project Detail Page
 * 
 * Route: /proyectos/[slug]
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
      title: 'Proyecto no encontrado',
    }
  }

  const title = project.seo?.metaTitle || project.title
  const description = project.seo?.metaDescription || project.excerpt || `Detalles y caso de estudio del proyecto ${project.title}.`
  const ogImage = project.seo?.ogImage?.asset?.url || project.coverImage?.asset?.url

  return {
    title,
    description,
    openGraph: {
      title: `${title} | tpz·studio`,
      description,
      url: `/proyectos/${slug}`,
      type: 'article',
      images: ogImage ? [{ url: ogImage, alt: project.coverImage?.alt || project.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | tpz·studio`,
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
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--paper-ink-muted)' }}>
          Slug no encontrado.
        </p>
      </div>
    )
  }

  const project = await client.fetch(projectBySlugQuery, { slug })

  if (!project) {
    return (
      <div style={{ padding: 'var(--space-xl)' }}>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--paper-ink-muted)' }}>
          Proyecto no encontrado.
        </p>
      </div>
    )
  }

  const videoUrl: string | undefined = project?.video?.url
  const embedUrl = videoUrl && !isMp4(videoUrl) ? toEmbedUrl(videoUrl) : null

  // Fetch related projects by shared categories
  const normalizedCategories = Array.isArray(project.categories)
    ? project.categories
        .map((category: string) => category.trim().toLowerCase())
        .filter(Boolean)
    : []
  const relatedProjects = Array.isArray(project.categories) && project.categories.length > 0
    ? await client.fetch(relatedProjectsQuery, {
        currentSlug: slug,
        categoriesLower: normalizedCategories,
      })
    : []

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
              fontFamily: 'var(--font-lacquer), cursive',
              fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
              fontWeight: 400,
              color: 'var(--paper-ink-primary)',
              marginBottom: project.excerpt ? 'var(--space-md)' : 0,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
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
              color: 'var(--paper-ink-secondary)',
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
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(0, 0, 0, 0.08)',
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
                title={project.title ?? 'Vídeo'}
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
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(0, 0, 0, 0.08)',
          }}
        >
          <Image
            src={project.coverImage.asset.url}
            alt={project.coverImage.alt || project.title || 'Portada del proyecto'}
            width={1200}
            height={675}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
            sizes="(max-width: 768px) 100vw, 900px"
          />
        </div>
      ) : null}

      {/* Body Content - Rich Text */}
      {project.body && Array.isArray(project.body) && project.body.length > 0 && (
        <div
          className="portable-text-fab"
          style={{
            fontSize: 'var(--font-size-md)',
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
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  backgroundColor: 'rgba(0, 0, 0, 0.03)',
                  color: 'var(--paper-ink-secondary)',
                  fontWeight: 500,
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
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          }}
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
            Créditos
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
                    color: 'var(--paper-ink-primary)',
                    lineHeight: 'var(--line-height-relaxed)',
                  }}
                >
                  {credit.role && (
                    <span
                      style={{
                        fontWeight: 500,
                        marginRight: 'var(--space-xs)',
                      }}
                    >
                      {credit.role}:
                    </span>
                  )}
                  {credit.name && <span style={{ color: 'var(--paper-ink-secondary)' }}>{credit.name}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Related Projects Carousel */}
      {Array.isArray(relatedProjects) && relatedProjects.length > 0 && (
        <nav
          style={{
            marginTop: 'var(--space-2xl)',
            paddingTop: 'var(--space-xl)',
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
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
            Proyectos relacionados
          </h3>
          <div
            className="scrollbar-hide"
            style={{
              display: 'flex',
              gap: 'var(--space-md)',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              paddingBottom: 'var(--space-sm)',
            }}
          >
            {relatedProjects.map((related: any) => (
              <Link
                key={related._id}
                href={`/proyectos/${related.slug}`}
                style={{
                  flex: '0 0 220px',
                  scrollSnapAlign: 'start',
                  textDecoration: 'none',
                  color: 'inherit',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  transition: 'opacity var(--motion-fast) var(--ease-out)',
                }}
                className="hover:opacity-80"
              >
                <div style={{ display: 'flex', gap: 'var(--space-sm)', padding: 'var(--space-sm)' }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      flex: '0 0 auto',
                    }}
                  >
                    {related.coverImage?.asset?.url ? (
                      <Image
                        src={related.coverImage.asset.url}
                        alt={related.coverImage.alt || related.title || ''}
                        width={72}
                        height={72}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.04)' }} />
                    )}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span
                      style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 500,
                        color: 'var(--paper-ink-primary)',
                        lineHeight: 1.3,
                      }}
                    >
                      {related.title}
                    </span>
                    {related.excerpt && (
                      <span
                        style={{
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--paper-ink-muted)',
                          lineHeight: 1.4,
                          marginTop: 'var(--space-xs)',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {related.excerpt}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </nav>
      )}
      <div style={{ marginTop: 'var(--space-xl)', textAlign: 'center' }}>
        <Link
          href="/proyectos"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-xs)',
            padding: 'var(--space-sm) var(--space-md)',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'var(--paper-ink-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 600,
            transition: 'all var(--motion-standard) var(--ease-out)',
          }}
          className="hover:opacity-80"
        >
          Más proyectos
        </Link>
      </div>
    </div>
  )
}
