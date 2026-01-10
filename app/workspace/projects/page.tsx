import { client } from '@/sanity/lib/client'
import { projectsArchiveQuery } from '@/sanity/lib/queries'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'

/**
 * Project Archive Page
 * 
 * Route: /workspace/projects
 * 
 * This page is rendered when the project archive panel is open.
 * The Panel component is rendered by WorkspaceRoot based on workspace state.
 * 
 * Fetches project list from Sanity and renders it within the panel.
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Projects',
    description: 'Browse our portfolio of completed projects. Explore our work in film, branding, design, and creative production.',
    openGraph: {
      title: 'Projects | TPZ Studio',
      description: 'Browse our portfolio of completed projects. Explore our work in film, branding, design, and creative production.',
      url: '/workspace/projects',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Projects | TPZ Studio',
      description: 'Browse our portfolio of completed projects. Explore our work in film, branding, design, and creative production.',
    },
  }
}

export default async function ProjectsPage() {
  try {
    const projects = await client.fetch(projectsArchiveQuery)

    if (!projects || projects.length === 0) {
      return (
        <div data-projects-archive style={{ padding: 'var(--space-xl)' }}>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--ink-muted)' }}>
            No projects available.
          </p>
        </div>
      )
    }

    return (
      <div data-projects-archive>
        {/* Header */}
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
              marginBottom: 'var(--space-sm)',
              lineHeight: 'var(--line-height-tight)',
            }}
          >
            Projects
          </h2>
          <p
            style={{
              fontSize: 'var(--font-size-md)',
              color: 'var(--ink-primary)',
              lineHeight: 'var(--line-height-relaxed)',
              marginBottom: 0,
            }}
          >
            Explore completed work
          </p>
        </header>

        {/* Project List */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-xl)',
          }}
        >
          {projects.map((project: any) => (
            <Link
              key={project._id}
              href={`/workspace/projects/${project.slug}`}
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
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-elevated)',
                      marginBottom: 'var(--space-sm)',
                    }}
                  >
                    <Image
                      src={project.coverImage.asset.url}
                      alt={project.coverImage.alt || project.title || 'Project cover'}
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
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--ink-primary)',
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
                      color: 'var(--ink-secondary)',
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
    console.error('[ProjectsPage] Error fetching projects:', error)
    return (
      <div style={{ padding: 'var(--space-xl)' }}>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--ink-muted)' }}>
          Error loading projects. Please try again later.
        </p>
      </div>
    )
  }
}
