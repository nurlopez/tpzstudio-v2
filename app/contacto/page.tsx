import { client } from '@/sanity/lib/client'
import { contactPageQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import { PageFade } from '@/app/_components/PageFade'
import { Reveal } from '@/app/_components/Motion'
import { getSocialIcon } from '@/app/_components/IconMap'
import Link from 'next/link'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const [contact, settings] = await Promise.all([
    client.fetch(contactPageQuery),
    client.fetch(siteSettingsQuery),
  ])
  
  const title = contact?.seo?.metaTitle || contact?.title || 'Contacto'
  const description = contact?.seo?.metaDescription || contact?.introText || settings?.seo?.metaDescription || ''

  return {
    title,
    description,
    openGraph: {
      title: `${title} | tpz·studio`,
      description,
      url: '/contacto',
    },
    twitter: {
      card: 'summary',
      title: `${title} | tpz·studio`,
      description,
    },
  }
}

export default async function ContactPage() {
    const contact = await client.fetch(contactPageQuery)

    if (!contact) {
        return (
            <PageFade>
                <main style={{ padding: 'var(--space-2xl) var(--space-lg) var(--space-4xl)' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                        <Reveal y={16}>
                            <h1 style={{
                                fontSize: 'clamp(2rem, 5vw, 3rem)',
                                margin: 0,
                                letterSpacing: '-0.02em',
                                fontWeight: 400,
                                fontFamily: 'var(--font-lacquer), cursive',
                            }}>
                                Contacto
                            </h1>
                        </Reveal>
                        <Reveal delay={0.1} y={16}>
                            <p style={{ marginTop: 48, opacity: 0.75 }}>
                                Contenido no disponible. Por favor, configura la página de contacto en Sanity Studio.
                            </p>
                        </Reveal>
                    </div>
                </main>
            </PageFade>
        )
    }

    const socialLinks = contact.socialMedia ? [
        { name: 'instagram', url: contact.socialMedia.instagram },
        { name: 'vimeo', url: contact.socialMedia.vimeo },
        { name: 'youtube', url: contact.socialMedia.youtube },
        { name: 'tiktok', url: contact.socialMedia.tiktok },
        { name: 'linkedin', url: contact.socialMedia.linkedin },
    ].filter(link => link.url) : []

    return (
        <PageFade>
                <main style={{ padding: 'var(--space-2xl) var(--space-lg) var(--space-4xl)' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <Reveal y={16}>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            margin: 0,
                            letterSpacing: '-0.02em',
                            fontWeight: 400,
                            fontFamily: 'var(--font-lacquer), cursive',
                        }}>
                            {contact.title || 'Contacto'}
                        </h1>
                    </Reveal>

                    {contact.introText && (
                        <Reveal delay={0.1} y={16}>
                            <p style={{
                                marginTop: 32,
                                fontSize: 'clamp(16px, 1.8vw, 18px)',
                                lineHeight: 1.75,
                                opacity: 0.88,
                                fontWeight: 300,
                                maxWidth: 800,
                            }}>
                                {contact.introText}
                            </p>
                        </Reveal>
                    )}

                    <div style={{ marginTop: 'var(--space-2xl)', display: 'grid', gap: 'var(--space-xl)' }}>
                        {/* Phone */}
                        {contact.phone?.number && (
                            <Reveal delay={0.2} y={16}>
                                <div style={{
                                    padding: 'var(--space-xl)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: 12,
                                    background: 'rgba(255,255,255,0.02)',
                                }}>
                                    <div style={{
                                        fontSize: 'var(--font-size-xs)',
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        opacity: 0.65,
                                        marginBottom: 'var(--space-xs)',
                                        fontWeight: 500,
                                    }}>
                                        Teléfono
                                    </div>
                                    {contact.phone.url ? (
                                        <Link
                                            href={contact.phone.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                fontSize: 'clamp(18px, 2vw, 22px)',
                                                color: 'inherit',
                                                textDecoration: 'none',
                                                fontWeight: 400,
                                                transition: 'opacity var(--motion-standard) var(--ease-out)',
                                                display: 'inline-block',
                                            }}
                                            className="contact-link"
                                        >
                                            {contact.phone.number}
                                        </Link>
                                    ) : (
                                        <div style={{
                                            fontSize: 'clamp(18px, 2vw, 22px)',
                                            fontWeight: 400,
                                        }}>
                                            {contact.phone.number}
                                        </div>
                                    )}
                                </div>
                            </Reveal>
                        )}

                        {/* Email */}
                        {contact.email?.address && (
                            <Reveal delay={0.3} y={16}>
                                <div style={{
                                    padding: 'var(--space-xl)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: 12,
                                    background: 'rgba(255,255,255,0.02)',
                                }}>
                                    <div style={{
                                        fontSize: 'var(--font-size-xs)',
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        opacity: 0.65,
                                        marginBottom: 'var(--space-xs)',
                                        fontWeight: 500,
                                    }}>
                                        {contact.email.label || 'Correo'}
                                    </div>
                                    <Link
                                        href={`mailto:${contact.email.address}`}
                                        style={{
                                            fontSize: 'clamp(18px, 2vw, 22px)',
                                            color: 'inherit',
                                            textDecoration: 'none',
                                            fontWeight: 400,
                                            transition: 'opacity var(--motion-standard) var(--ease-out)',
                                            display: 'inline-block',
                                        }}
                                        className="contact-link"
                                    >
                                        {contact.email.address}
                                    </Link>
                                </div>
                            </Reveal>
                        )}

                        {/* Social Media */}
                        {socialLinks.length > 0 && (
                            <Reveal delay={0.4} y={16}>
                                <div style={{
                                    padding: 'var(--space-xl)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: 12,
                                    background: 'rgba(255,255,255,0.02)',
                                }}>
                                    <div style={{
                                        fontSize: 'var(--font-size-xs)',
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        opacity: 0.65,
                                        marginBottom: 'var(--space-md)',
                                        fontWeight: 500,
                                    }}>
                                        Síguenos en nuestras redes sociales
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        gap: 'var(--space-md)',
                                        flexWrap: 'wrap',
                                    }}>
                                        {socialLinks.map((social) => (
                                            <Link
                                                key={social.name}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="contact-social-link"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 8,
                                                    border: '1px solid rgba(255,255,255,0.12)',
                                                    background: 'rgba(255,255,255,0.04)',
                                                    color: 'rgba(255,255,255,0.9)',
                                                    textDecoration: 'none',
                                                    transition: 'all var(--motion-standard) var(--ease-out)',
                                                }}
                                                aria-label={social.name}
                                            >
                                                {getSocialIcon(social.name)}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </Reveal>
                        )}
                    </div>
                </div>
            </main>
        </PageFade>
    )
}
