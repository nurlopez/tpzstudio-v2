import { client } from '@/sanity/lib/client'
import { blogPostBySlugQuery } from '@/sanity/lib/queries/blog'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

/**
 * Blog Post Detail Page
 * 
 * Route: /blog/[slug]
 * 
 * Displays a single blog post with full content.
 * SEO-optimized with proper metadata.
 */

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await client.fetch(blogPostBySlugQuery, { slug })

  if (!post) {
    return {
      title: 'Post Not Found | TPZ Studio Blog',
    }
  }

  const metaTitle = post.seo?.metaTitle || post.title
  const metaDescription = post.seo?.metaDescription || post.excerpt
  const ogImage = post.seo?.ogImage?.asset?.url || post.coverImage?.asset?.url

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [{ url: ogImage, alt: post.coverImage?.alt || post.title }] : [],
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author?.name ? [post.author.name] : [],
      tags: post.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [ogImage] : [],
    },
    keywords: post.seo?.keywords || post.tags || [],
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await client.fetch(blogPostBySlugQuery, { slug })

  if (!post) {
    notFound()
  }

  return (
    <main style={{ padding: 'var(--space-3xl) var(--space-xl)', minHeight: '100vh' }}>
      <article style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Back Links */}
        <div style={{ marginBottom: 'var(--space-xl)', display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <Link
            href="/workspace"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-xs)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--ink-interactive)',
              textDecoration: 'none',
              padding: 'var(--space-sm) var(--space-md)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-elevated)',
              transition: 'background-color var(--motion-fast) var(--ease-out), border-color var(--motion-fast) var(--ease-out)',
            }}
            className="back-to-workspace-button"
          >
            ← Workspace
          </Link>
          <Link
            href="/blog"
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--ink-interactive)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-xs)',
              padding: 'var(--space-sm) var(--space-md)',
            }}
            className="hover:underline"
          >
            ← Back to Blog
          </Link>
        </div>

        {/* Header */}
        <header style={{ marginBottom: 'var(--space-2xl)' }}>
          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-xs)',
                marginBottom: 'var(--space-md)',
              }}
            >
              {post.categories.map((category: string) => (
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
                  }}
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--ink-primary)',
              marginBottom: 'var(--space-md)',
              lineHeight: 'var(--line-height-tight)',
            }}
          >
            {post.title}
          </h1>

          {/* Meta */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 'var(--space-md)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--ink-secondary)',
              marginBottom: 'var(--space-xl)',
            }}
          >
            {post.author?.name && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                {post.author.image?.asset?.url && (
                  <Image
                    src={post.author.image.asset.url}
                    alt={post.author.name}
                    width={24}
                    height={24}
                    style={{
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                )}
                <span>{post.author.name}</span>
              </div>
            )}
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
            {post.readingTime && <span>• {post.readingTime} min read</span>}
            {post.updatedAt && post.updatedAt !== post.publishedAt && (
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--ink-muted)' }}>
                (Updated {new Date(post.updatedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })})
              </span>
            )}
          </div>

          {/* Cover Image */}
          {post.coverImage?.asset?.url && (
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
                src={post.coverImage.asset.url}
                alt={post.coverImage.alt || post.title || 'Blog post cover'}
                width={1200}
                height={675}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <p
              style={{
                fontSize: 'var(--font-size-lg)',
                color: 'var(--ink-primary)',
                lineHeight: 'var(--line-height-relaxed)',
                fontWeight: 'var(--font-weight-regular)',
                marginBottom: 0,
              }}
            >
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Body Content */}
        {post.body && Array.isArray(post.body) && post.body.length > 0 && (
          <div
            style={{
              fontSize: 'var(--font-size-md)',
              color: 'var(--ink-primary)',
              lineHeight: 'var(--line-height-relaxed)',
              marginBottom: 'var(--space-3xl)',
            }}
          >
            <PortableText value={post.body} />
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div
            style={{
              marginTop: 'var(--space-2xl)',
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
              Tags
            </h3>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-sm)',
              }}
            >
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    padding: 'var(--space-xs) var(--space-sm)',
                    borderRadius: '4px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-elevated)',
                    color: 'var(--ink-secondary)',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <div
            style={{
              marginTop: 'var(--space-3xl)',
              paddingTop: 'var(--space-xl)',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--ink-primary)',
                marginBottom: 'var(--space-lg)',
              }}
            >
              Related Posts
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-md)',
              }}
            >
              {post.relatedPosts.map((relatedPost: any) => (
                <Link
                  key={relatedPost._id}
                  href={`/blog/${relatedPost.slug}`}
                  style={{
                    display: 'block',
                    padding: 'var(--space-md)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-elevated)',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'border-color var(--motion-fast) var(--ease-out)',
                  }}
                  className="blog-related-post-link"
                >
                  <h4
                    style={{
                      fontSize: 'var(--font-size-md)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--ink-primary)',
                      marginBottom: 'var(--space-xs)',
                    }}
                  >
                    {relatedPost.title}
                  </h4>
                  {relatedPost.excerpt && (
                    <p
                      style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--ink-secondary)',
                        marginBottom: 0,
                      }}
                    >
                      {relatedPost.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  )
}
