import { client } from '@/sanity/lib/client'
import { projectsArchiveQuery } from '@/sanity/lib/queries'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'

/**
 * Project Archive Page
 * 
 * Route: /proyectos
 * 
 * This page is rendered when the project archive panel is open.
 * The Panel component is rendered by WorkspaceRoot based on workspace state.
 * 
 * Fetches project list from Sanity and renders it within the panel.
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Proyectos',
    description: 'Explora nuestro portafolio de proyectos. Descubre nuestro trabajo en cine, branding, diseño y producción creativa.',
    openGraph: {
      title: 'Proyectos | tpz·studio',
      description: 'Explora nuestro portafolio de proyectos. Descubre nuestro trabajo en cine, branding, diseño y producción creativa.',
      url: '/proyectos',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Proyectos | tpz·studio',
      description: 'Explora nuestro portafolio de proyectos. Descubre nuestro trabajo en cine, branding, diseño y producción creativa.',
    },
  }
}

export default async function ProjectsPage() {
  try {
    const projects = await client.fetch(projectsArchiveQuery)

    if (!projects || projects.length === 0) {
      return (
        <div data-projects-archive style={{ padding: 'var(--space-xl)' }}>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--paper-ink-muted)' }}>
            No hay proyectos disponibles.
          </p>
        </div>
      )
    }

    return (
      <div data-projects-archive>
        {/* Project List */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-xl)',
          }}
        >
          {projects.map((project: any) => (
            <Link
              key={project._id}
              href={`/proyectos/${project.slug}`}
              style={{
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'opacity var(--motion-fast) var(--ease-out)',
              }}
              className="hover:opacity-80"
            >
              <article
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-sm)',
                }}
              >
                {/* Cover Image */}
                {project.coverImage?.asset?.url && (
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '16/9',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      marginBottom: 'var(--space-sm)',
                    }}
                  >
                    <Image
                      src={project.coverImage.asset.url}
                      alt={project.coverImage.alt || project.title || 'Portada del proyecto'}
                      width={400}
                      height={225}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      sizes="(max-width: 400px) 100vw, 400px"
                    />
                  </div>
                )}

                {/* Title */}
                {project.title && (
                  <h3
                    style={{
                      fontSize: 'var(--font-size-md)',
                      fontWeight: 400,
                      fontFamily: 'var(--font-lacquer), cursive',
                      color: 'var(--paper-ink-primary)',
                      marginBottom: 0,
                      lineHeight: 'var(--line-height-tight)',
                    }}
                  >
                    {project.title}
                  </h3>
                )}

                {/* Excerpt */}
                {project.excerpt && (
                  <p
                    style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--paper-ink-secondary)',
                      lineHeight: 'var(--line-height-relaxed)',
                      marginBottom: 0,
                    }}
                  >
                    {project.excerpt}
                  </p>
                )}
              </article>
            </Link>
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error('[ProjectsPage] Error al obtener proyectos:', error)
    return (
      <div style={{ padding: 'var(--space-xl)' }}>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--paper-ink-muted)' }}>
          Error al cargar los proyectos. Inténtalo de nuevo más tarde.
        </p>
      </div>
    )
  }
}
