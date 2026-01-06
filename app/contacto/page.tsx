import { client } from '@/sanity/lib/client'
import { contactPageQuery } from '@/sanity/lib/queries'
import { PageFade } from '@/app/_components/PageFade'
import { Reveal } from '@/app/_components/Motion'
import { getSocialIcon } from '@/app/_components/IconMap'
import Link from 'next/link'

export default async function ContactPage() {
    const contact = await client.fetch(contactPageQuery)

    if (!contact) {
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

                    <div style={{ marginTop: 48, display: 'grid', gap: 32 }}>
                        {/* Phone */}
                        {contact.phone?.number && (
                            <Reveal delay={0.2} y={16}>
                                <div style={{
                                    padding: '32px',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: 16,
                                    background: 'rgba(255,255,255,0.02)',
                                }}>
                                    <div style={{
                                        fontSize: 12,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        opacity: 0.65,
                                        marginBottom: 12,
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
                                                transition: 'opacity 0.3s ease',
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
                                    padding: '32px',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: 16,
                                    background: 'rgba(255,255,255,0.02)',
                                }}>
                                    <div style={{
                                        fontSize: 12,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        opacity: 0.65,
                                        marginBottom: 12,
                                        fontWeight: 500,
                                    }}>
                                        {contact.email.label || 'Email'}
                                    </div>
                                    <Link
                                        href={`mailto:${contact.email.address}`}
                                        style={{
                                            fontSize: 'clamp(18px, 2vw, 22px)',
                                            color: 'inherit',
                                            textDecoration: 'none',
                                            fontWeight: 400,
                                            transition: 'opacity 0.3s ease',
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
                                    padding: '32px',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: 16,
                                    background: 'rgba(255,255,255,0.02)',
                                }}>
                                    <div style={{
                                        fontSize: 12,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        opacity: 0.65,
                                        marginBottom: 24,
                                        fontWeight: 500,
                                    }}>
                                        Síguenos en nuestras redes sociales
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        gap: 20,
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
                                                    borderRadius: 12,
                                                    border: '1px solid rgba(255,255,255,0.12)',
                                                    background: 'rgba(255,255,255,0.04)',
                                                    color: 'rgba(255,255,255,0.9)',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
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
