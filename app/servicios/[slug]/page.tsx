import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { PageFade } from '@/app/_components/PageFade'
import { Reveal } from '@/app/_components/Motion'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { getIcon } from '@/app/_components/IconMap'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    icon,
    shortDescription,
    body,
    coverImage,
    cta{
      label,
      url
    }
  }
`

export default async function ServicePage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    if (!slug) {
        return <main style={{ padding: 24 }}>Missing slug.</main>
    }

    const service = await client.fetch(serviceBySlugQuery, { slug })

    if (!service) {
        return <main style={{ padding: 24 }}>No existe este servicio.</main>
    }

    const coverImage = service?.coverImage
        ? urlFor(service.coverImage).width(1600).height(900).quality(85).url()
        : null

    return (
        <PageFade>
            <main style={{ padding: '48px 24px 96px' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <Reveal y={16}>
                        <div style={{ marginBottom: 24 }}>
                            <Link 
                                href="/servicios" 
                                style={{ 
                                    color: 'rgba(255,255,255,0.75)', 
                                    textDecoration: 'none',
                                    fontSize: 14,
                                    fontWeight: 500,
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                ← Volver a servicios
                            </Link>
                        </div>
                    </Reveal>

                    <Reveal y={16}>
                        <div style={{ 
                            opacity: 0.65, 
                            fontSize: 12, 
                            letterSpacing: '0.1em', 
                            textTransform: 'uppercase',
                            fontWeight: 500,
                            marginBottom: 8,
                        }}>
                            Servicio
                        </div>
                    </Reveal>

                    <Reveal delay={0.06} y={16}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                            {service.icon && (
                                <div
                                    style={{
                                        width: 64,
                                        height: 64,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'rgba(255,255,255,0.9)',
                                        opacity: 0.95,
                                    }}
                                >
                                    {getIcon(service.icon)}
                                </div>
                            )}
                            <h1 style={{ 
                                fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
                                margin: 0, 
                                letterSpacing: '-0.04em',
                                fontWeight: 400,
                                fontFamily: 'var(--font-serif), Georgia, serif',
                            }}>
                                {service.title}
                            </h1>
                        </div>
                    </Reveal>

                    {service.shortDescription ? (
                        <Reveal delay={0.12} y={16}>
                            <p style={{ 
                                marginTop: 16, 
                                maxWidth: 800, 
                                opacity: 0.88, 
                                lineHeight: 1.75,
                                fontSize: 'clamp(16px, 1.8vw, 18px)',
                                fontWeight: 300,
                            }}>
                                {service.shortDescription}
                            </p>
                        </Reveal>
                    ) : null}

                    {coverImage ? (
                        <Reveal delay={0.18} y={16}>
                            <div
                                style={{
                                    marginTop: 32,
                                    borderRadius: 12,
                                    overflow: 'hidden',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    background: 'rgba(255,255,255,0.02)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                                    position: 'relative',
                                    aspectRatio: '16 / 9',
                                }}
                            >
                                <Image
                                    src={coverImage}
                                    alt={service.title ?? ''}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 1000px"
                                    style={{
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>
                        </Reveal>
                    ) : null}

                    {service.body && Array.isArray(service.body) && service.body.length > 0 ? (
                        <Reveal delay={0.24} y={16}>
                            <div style={{ 
                                marginTop: 32,
                                fontSize: 'clamp(16px, 1.8vw, 18px)',
                                lineHeight: 1.75,
                                opacity: 0.88,
                                fontWeight: 300,
                            }}>
                                <PortableText value={service.body} />
                            </div>
                        </Reveal>
                    ) : null}

                    {service.cta?.label && service.cta?.url ? (
                        <Reveal delay={0.3} y={16}>
                            <div style={{ marginTop: 40 }}>
                                <a
                                    href={service.cta.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        display: 'inline-block',
                                        padding: '14px 28px',
                                        borderRadius: 8,
                                        background: 'rgba(255,255,255,0.95)',
                                        color: '#0a0a0a',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        fontSize: 14,
                                        letterSpacing: '0.02em',
                                        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                                    }}
                                >
                                    {service.cta.label}
                                </a>
                            </div>
                        </Reveal>
                    ) : null}
                </div>
            </main>
        </PageFade>
    )
}

