import Link from 'next/link'
import Image from 'next/image'
import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PageFade } from '@/app/_components/PageFade'
import { Reveal, HoverLift } from '@/app/_components/Motion'
import { Metadata } from 'next'

const projectsIndexQuery = groq`
  *[_type == "project"] | order(featured desc, _createdAt desc){
    _id,
    title,
    slug,
    excerpt,
    coverImage,
    featured
  }
`

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Proyectos',
    description: 'Browse our portfolio of completed projects. Explore our work in film, branding, design, and creative production.',
    openGraph: {
      title: 'Proyectos | TPZ Studio',
      description: 'Browse our portfolio of completed projects. Explore our work in film, branding, design, and creative production.',
      url: '/proyectos',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Proyectos | TPZ Studio',
      description: 'Browse our portfolio of completed projects. Explore our work in film, branding, design, and creative production.',
    },
  }
}

export default async function ProjectsPage() {
    const projects = await client.fetch(projectsIndexQuery)

    return (
        <PageFade>
            <main style={{ padding: '48px 24px 96px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <Reveal y={16}>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            margin: 0,
                            letterSpacing: '-0.04em',
                            fontWeight: 400,
                            fontFamily: 'var(--font-serif), Georgia, serif',
                        }}>
                            Proyectos
                        </h1>
                    </Reveal>

                    <div style={{ marginTop: 40 }}>
                        <div className="featuredProjectsGrid">
                            {projects.map((p: any, i: number) => {
                                if (!p.slug?.current) return null
                                const href = `/proyectos/${p.slug.current}`
                                const img = p.coverImage
                                    ? urlFor(p.coverImage).width(1600).height(1000).quality(85).url()
                                    : null

                                // First item or featured item gets hero treatment on desktop
                                const isHero = i === 0 || p.featured

                                return (
                                    <Reveal key={p._id} delay={Math.min(i * 0.05, 0.25)} y={20}>
                                        <HoverLift>
                                            <Link
                                                href={href}
                                                className={`featuredProjectCard ${isHero ? 'featuredProjectCard--hero' : ''}`}
                                                style={{
                                                    display: 'block',
                                                    textDecoration: 'none',
                                                    color: 'inherit',
                                                    border: '1px solid rgba(255,255,255,0.12)',
                                                    borderRadius: 16,
                                                    overflow: 'hidden',
                                                    background: 'rgba(255,255,255,0.02)',
                                                    position: 'relative',
                                                }}
                                            >
                                                <div
                                                    className="featuredProjectCard__image"
                                                    style={{
                                                        position: 'relative',
                                                        aspectRatio: isHero ? '16 / 9' : '4 / 3',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {img ? (
                                                        <Image
                                                            src={img}
                                                            alt={p.title ?? ''}
                                                            fill
                                                            sizes={isHero
                                                                ? "(max-width: 1024px) 100vw, 66vw"
                                                                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                            }
                                                            style={{
                                                                objectFit: 'cover',
                                                                transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                                                                filter: 'saturate(0.9) contrast(1.05)',
                                                            }}
                                                        />
                                                    ) : (
                                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.04)' }} />
                                                    )}

                                                    {/* Gradient overlay */}
                                                    <div
                                                        className="featuredProjectCard__overlay"
                                                        aria-hidden
                                                        style={{
                                                            position: 'absolute',
                                                            inset: 0,
                                                            background:
                                                                'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 70%, transparent 100%)',
                                                            transition: 'opacity 0.4s ease',
                                                        }}
                                                    />
                                                </div>

                                                {/* Text content - below image on desktop hero, overlay on mobile and other cards */}
                                                <div className="featuredProjectCard__content">
                                                    <div style={{
                                                        fontWeight: 400,
                                                        letterSpacing: '-0.02em',
                                                        fontSize: isHero
                                                            ? 'clamp(22px, 2.5vw, 28px)'
                                                            : 'clamp(20px, 2.5vw, 22px)',
                                                        fontFamily: 'var(--font-serif), Georgia, serif',
                                                        lineHeight: 1.2,
                                                        marginBottom: 8,
                                                    }}>
                                                        {p.title}
                                                    </div>
                                                    {p.excerpt ? (
                                                        <div style={{
                                                            marginTop: 6,
                                                            opacity: 0.85,
                                                            lineHeight: 1.5,
                                                            fontSize: 14,
                                                            fontWeight: 300,
                                                        }}>
                                                            {p.excerpt}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </Link>
                                        </HoverLift>
                                    </Reveal>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </PageFade>
    )
}
