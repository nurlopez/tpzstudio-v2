import Image from 'next/image'
import Link from 'next/link'
import { Reveal, HoverLift } from './Motion'

import { urlFor } from '@/sanity/lib/image'

type Project = {
    _id: string
    title?: string
    excerpt?: string
    slug?: { current?: string }
    coverImage?: any
}

export function FeaturedProjects({ title, items }: { title?: string; items: Project[] }) {

    return (
        <section style={{ padding: '48px 24px 96px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <Reveal y={16}>
                    <h2 style={{ 
                        fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', 
                        margin: 0, 
                        letterSpacing: '-0.03em',
                        fontWeight: 400,
                        fontFamily: 'var(--font-serif), Georgia, serif',
                        marginBottom: 8,
                    }}>
                        {title}
                    </h2>
                </Reveal>

                <div style={{ marginTop: 32 }}>
                    <div className="featuredProjectsGrid">
                        {items.map((p, index) => {
                            if (!p.slug?.current) return null
                            const href = `/proyectos/${p.slug.current}`
                            const img = p.coverImage
                                ? urlFor(p.coverImage).width(1600).height(1000).quality(85).url()
                                : null
                            
                            // First item gets hero treatment on desktop
                            const isHero = index === 0

                            return (
                                <Reveal key={p._id} delay={Math.min(index * 0.05, 0.2)} y={20}>
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

                                            {/* Gradient overlay - only on mobile/tablet for hero, always for others */}
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
        </section>
    )
}
