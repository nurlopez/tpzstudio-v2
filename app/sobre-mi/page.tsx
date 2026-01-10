import { client } from '@/sanity/lib/client'
import { aboutPageQuery } from '@/sanity/lib/queries'
import { PageFade } from '@/app/_components/PageFade'
import { Reveal } from '@/app/_components/Motion'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const about = await client.fetch(aboutPageQuery)
  
  const title = about?.seo?.metaTitle || about?.title || 'Sobre mí'
  const description = about?.seo?.metaDescription || 'Learn more about TPZ Studio, our mission, values, and creative approach.'
  const ogImage = about?.image?.asset?.url

  return {
    title,
    description,
    openGraph: {
      title: `${title} | TPZ Studio`,
      description,
      url: '/sobre-mi',
      images: ogImage ? [{ url: ogImage, alt: about?.image?.alt || about?.title || 'About TPZ Studio' }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | TPZ Studio`,
      description,
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function AboutPage() {
    const about = await client.fetch(aboutPageQuery)

    if (!about) {
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
                                Sobre mí
                            </h1>
                        </Reveal>
                        <Reveal delay={0.1} y={16}>
                            <p style={{ marginTop: 48, opacity: 0.75 }}>
                                Contenido no disponible. Por favor, configura la página en Sanity Studio.
                            </p>
                        </Reveal>
                    </div>
                </main>
            </PageFade>
        )
    }

    const imageUrl = about.image
        ? urlFor(about.image).width(1200).height(800).quality(90).url()
        : null

    return (
        <PageFade>
            <main style={{ padding: '0 0 96px' }}>
                {/* Hero Image Section */}
                {imageUrl && (
                    <Reveal y={0}>
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            aspectRatio: '16 / 9',
                            marginBottom: 64,
                        }}>
                            <Image
                                src={imageUrl}
                                alt={about.title || 'Sobre mí'}
                                fill
                                sizes="100vw"
                                style={{
                                    objectFit: 'cover',
                                }}
                                priority
                            />
                            <div
                                aria-hidden
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
                                }}
                            />
                        </div>
                    </Reveal>
                )}

                <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>
                    {/* Title */}
                    <Reveal y={16}>
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                            margin: '0 0 32px',
                            letterSpacing: '-0.04em',
                            fontWeight: 400,
                            fontFamily: 'var(--font-serif), Georgia, serif',
                            lineHeight: 1.2,
                        }}>
                            {about.title}
                        </h1>
                    </Reveal>

                    {/* Content */}
                    {about.body && (
                        <Reveal delay={0.1} y={16}>
                            <div 
                                className="portable-text-content"
                                style={{
                                    fontSize: 'clamp(16px, 1.8vw, 18px)',
                                    lineHeight: 1.75,
                                    opacity: 0.88,
                                    fontWeight: 300,
                                    letterSpacing: '0.01em',
                                }}
                            >
                                <PortableText value={about.body} />
                            </div>
                        </Reveal>
                    )}

                    {/* CTA Footer */}
                    {about.cta?.text && about.cta?.url && (
                        <Reveal delay={0.2} y={16}>
                            <div style={{
                                marginTop: 80,
                                padding: '48px 32px',
                                border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: 16,
                                background: 'rgba(255,255,255,0.02)',
                                textAlign: 'center',
                            }}>
                                <Link
                                    href={about.cta.url}
                                    className="about-cta-link"
                                    style={{
                                        display: 'inline-block',
                                        padding: '16px 32px',
                                        borderRadius: 8,
                                        background: 'rgba(255,255,255,0.95)',
                                        color: '#0a0a0a',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        fontSize: 16,
                                        letterSpacing: '0.02em',
                                        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                    }}
                                >
                                    {about.cta.text}
                                </Link>
                            </div>
                        </Reveal>
                    )}
                </div>
            </main>
        </PageFade>
    )
}
