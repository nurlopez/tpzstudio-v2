import { client } from '@/sanity/lib/client'
import { blogPostsQuery } from '@/sanity/lib/queries/blog'
import { siteSettingsQuery } from '@/sanity/lib/queries'
import Image from 'next/image'
import Link from 'next/link'

/**
 * Blog Listing Page
 *
 * Route: /blog
 *
 * Displays all blog posts in a listing format.
 * SEO-friendly with proper metadata.
 */
export async function generateMetadata() {
  const settings = await client.fetch(siteSettingsQuery)
  const title = settings?.pages?.blog?.metaTitle || 'Blog | tpz·studio'
  const description = settings?.pages?.blog?.metaDescription || settings?.seo?.metaDescription || ''

  return {
    title,
    description,
  }
}

export default async function BlogPage() {
  const posts = await client.fetch(blogPostsQuery)

  if (!posts || posts.length === 0) {
    return (
      <main style={{ padding: 'var(--space-3xl) var(--space-xl)', minHeight: '100vh', backgroundColor: 'var(--paper-bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1
            style={{
              fontFamily: 'var(--font-lacquer), cursive',
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 400,
              color: 'var(--paper-ink-primary)',
              marginBottom: 'var(--space-xl)',
            }}
          >
            Blog
          </h1>
          <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--paper-ink-secondary)' }}>
            Aún no hay publicaciones disponibles.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main style={{ padding: 'var(--space-3xl) var(--space-xl)', minHeight: '100vh', backgroundColor: 'var(--paper-bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Back to Workspace Button */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-xs)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--paper-ink-interactive)',
              textDecoration: 'none',
              padding: 'var(--space-sm) var(--space-md)',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '4px',
              backgroundColor: 'white',
              transition: 'background-color var(--motion-fast) var(--ease-out), border-color var(--motion-fast) var(--ease-out)',
            }}
            className="back-to-home-button"
          >
            ← Inicio
          </Link>
        </div>

        {/* Header */}
        <header style={{ marginBottom: 'var(--space-3xl)' }}>
          <h1
            style={{
              fontFamily: 'var(--font-lacquer), cursive',
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 400,
              color: 'var(--paper-ink-primary)',
              marginBottom: 'var(--space-md)',
            }}
          >
            Blog
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-md)',
              color: 'var(--paper-ink-secondary)',
              maxWidth: 600,
            }}
          >
            Noticias, reflexiones e ideas de TPZ Studio.
          </p>
        </header>

        {/* Blog Posts Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--space-xl)',
          }}
        >
          {posts.map((post: any) => (
            <article
              key={post._id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: 'white',
                transition: 'transform var(--motion-standard) var(--ease-out), box-shadow var(--motion-standard) var(--ease-out)',
              }}
            >
              <Link
                href={`/blog/${post.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {/* Cover Image */}
                {post.coverImage?.asset?.url && (
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '16 / 9',
                      overflow: 'hidden',
                      backgroundColor: 'rgba(0,0,0,0.03)',
                    }}
                  >
                    <Image
                      src={post.coverImage.asset.url}
                      alt={post.coverImage.alt || post.title || 'Portada del artículo'}
                      fill
                      style={{
                        objectFit: 'cover',
                      }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}

                {/* Content */}
                <div style={{ padding: 'var(--space-lg)' }}>
                  {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 'var(--space-xs)',
                        marginBottom: 'var(--space-sm)',
                      }}
                    >
                      {post.categories.slice(0, 2).map((category: string) => (
                        <span
                          key={category}
                          style={{
                            fontSize: 'var(--font-size-xs)',
                            padding: 'var(--space-xs) var(--space-sm)',
                            borderRadius: '4px',
                            border: '1px solid rgba(0,0,0,0.1)',
                            backgroundColor: 'rgba(0,0,0,0.03)',
                            color: 'var(--paper-ink-secondary)',
                            fontWeight: 'var(--font-weight-medium)',
                          }}
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h2
                    style={{
                      fontSize: 'var(--font-size-lg)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--paper-ink-primary)',
                      marginBottom: 'var(--space-sm)',
                      lineHeight: 'var(--line-height-tight)',
                    }}
                  >
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p
                      style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--paper-ink-secondary)',
                        lineHeight: 'var(--line-height-relaxed)',
                        marginBottom: 'var(--space-md)',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-md)',
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--paper-ink-muted)',
                    }}
                  >
                    {post.publishedAt && (
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    )}
                    {post.readingTime && (
                      <span>• {post.readingTime} min de lectura</span>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
