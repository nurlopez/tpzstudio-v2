import Image from 'next/image'
import Link from 'next/link'
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
        <section style={{ padding: '28px 24px 72px' }}>
            <div style={{ maxWidth: 980, margin: '0 auto' }}>
                <h2 style={{ fontSize: 22, margin: 0, letterSpacing: '-0.01em' }}>{title}</h2>

                <div style={{ marginTop: 16 }}>
                    <div className="carousel">
                        {items.map((p) => {
                            if (!p.slug?.current) return null
                            const href = `/proyectos/${p.slug.current}`
                            const img = p.coverImage
                                ? urlFor(p.coverImage).width(1600).height(900).quality(80).url()
                                : null

                            return (
                                <Link
                                    key={p._id}
                                    href={href}
                                    className="projectCard carouselItem"
                                    style={{
                                        display: 'block',
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        borderRadius: 18,
                                        overflow: 'hidden',
                                        background: 'rgba(255,255,255,0.03)',
                                    }}
                                >
                                    {/* card content stays the same */}
                                    <div style={{ position: 'relative', aspectRatio: '16 / 9' }}>
                                        {img ? (
                                            <Image
                                                src={img}
                                                alt={p.title ?? ''}
                                                fill
                                                sizes="(max-width: 768px) 85vw, 420px"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.06)' }} />
                                        )}

                                        <div
                                            aria-hidden
                                            style={{
                                                position: 'absolute',
                                                inset: 0,
                                                background:
                                                    'linear-gradient(to top, rgba(0,0,0,0.78), rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.06))',
                                            }}
                                        />

                                        <div style={{ position: 'absolute', left: 14, right: 14, bottom: 12 }}>
                                            <div style={{ fontWeight: 760, letterSpacing: '-0.01em', fontSize: 18 }}>
                                                {p.title}
                                            </div>
                                            {p.excerpt ? (
                                                <div style={{ marginTop: 6, opacity: 0.88, lineHeight: 1.55 }}>
                                                    {p.excerpt}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
