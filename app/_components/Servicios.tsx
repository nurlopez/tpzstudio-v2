import Link from 'next/link'
import { Reveal, HoverLift } from './Motion'
import { getIcon } from './IconMap'

type Service = {
    _id?: string
    title?: string
    slug?: { current?: string }
    icon?: string
    shortDescription?: string
    order?: number
}

type Props = {
    title?: string
    items?: Service[]
}

export function Servicios({ title, items = [] }: Props) {
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
                        marginBottom: 48,
                    }}>
                        {title}
                    </h2>
                </Reveal>

                {items.length > 0 ? (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 24,
                        marginTop: 32,
                    }}>
                        {items
                            .sort((a, b) => (a.order || 0) - (b.order || 0))
                            .map((service, index) => {
                                if (!service.slug?.current) return null
                                const href = `/servicios/${service.slug.current}`
                                
                                return (
                                    <Reveal key={service._id || index} delay={Math.min(index * 0.1, 0.3)} y={20}>
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
                                            </Link>
                                        </HoverLift>
                                    </Reveal>
                                )
                            })}
                    </div>
                ) : null}
            </div>
        </section>
    )
}

