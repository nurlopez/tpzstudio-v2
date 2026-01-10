import Link from 'next/link'
import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { PageFade } from '@/app/_components/PageFade'
import { Reveal, HoverLift } from '@/app/_components/Motion'
import { getIcon } from '@/app/_components/IconMap'

const servicesIndexQuery = groq`
  *[_type == "service"] | order(order asc, _createdAt desc){
    _id,
    title,
    slug,
    icon,
    shortDescription,
    order
  }
`

export default async function ServicesPage() {
    const services = await client.fetch(servicesIndexQuery)

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
                            Servicios
                        </h1>
                    </Reveal>

                    <div style={{ marginTop: 48 }}>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: 24,
                        }}>
                            {services.map((service: any, index: number) => {
                                if (!service.slug?.current) return null
                                const href = `/servicios/${service.slug.current}`

                                return (
                                    <Reveal key={service._id} delay={Math.min(index * 0.1, 0.3)} y={20}>
                                        <HoverLift>
                                            <Link
                                                href={href}
                                                style={{
                                                    display: 'block',
                                                    textDecoration: 'none',
                                                    color: 'inherit',
                                                    padding: '32px 28px',
                                                    border: '1px solid rgba(255,255,255,0.12)',
                                                    borderRadius: 16,
                                                    background: 'rgba(255,255,255,0.02)',
                                                    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {/* Subtle gradient overlay */}
                                                <div
                                                    aria-hidden
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        height: '1px',
                                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                                                    }}
                                                />

                                                {/* Icon */}
                                                <div
                                                    style={{
                                                        width: 56,
                                                        height: 56,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginBottom: 24,
                                                        color: 'rgba(255,255,255,0.9)',
                                                        opacity: 0.95,
                                                    }}
                                                >
                                                    {getIcon(service.icon)}
                                                </div>

                                                {/* Title */}
                                                <h3
                                                    style={{
                                                        fontSize: 'clamp(18px, 2vw, 20px)',
                                                        fontWeight: 500,
                                                        letterSpacing: '0.02em',
                                                        margin: '0 0 12px 0',
                                                        lineHeight: 1.3,
                                                        fontFamily: 'var(--font-sans), system-ui, sans-serif',
                                                        textTransform: 'uppercase',
                                                        opacity: 0.95,
                                                    }}
                                                >
                                                    {service.title}
                                                </h3>

                                                {/* Description */}
                                                {service.shortDescription ? (
                                                    <p
                                                        style={{
                                                            fontSize: 'clamp(14px, 1.5vw, 16px)',
                                                            lineHeight: 1.6,
                                                            opacity: 0.75,
                                                            fontWeight: 300,
                                                            margin: 0,
                                                            letterSpacing: '0.01em',
                                                        }}
                                                    >
                                                        {service.shortDescription}
                                                    </p>
                                                ) : null}
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
