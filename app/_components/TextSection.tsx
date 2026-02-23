import { ReactNode } from 'react'
import { Reveal } from './Motion'

type Props = {
    title?: string
    children: ReactNode
    padding?: string
    maxWidth?: number | string
}

// Reusable text block with film credit-style typography and sophisticated spacing.
export function TextSection({ title, children, padding = 'var(--space-2xl) var(--space-lg)', maxWidth = 1000 }: Props) {
    const resolvedMaxWidth = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth

    return (
        <section style={{ padding }}>
            <div style={{ maxWidth: resolvedMaxWidth, margin: '0 auto' }}>
                <Reveal y={16}>
                    <div style={{ display: 'grid', gap: 20 }}>
                        {title ? (
                            <h2 style={{ 
                                margin: 0, 
                                fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', 
                                lineHeight: 1.3, 
                                letterSpacing: '-0.02em',
                                fontWeight: 400,
                                fontFamily: 'var(--font-lacquer), cursive',
                                opacity: 0.95,
                            }}>
                                {title}
                            </h2>
                        ) : null}

                        <div style={{ 
                            fontSize: 'clamp(16px, 1.8vw, 18px)', 
                            lineHeight: 1.75, 
                            opacity: 0.88,
                            fontWeight: 300,
                            letterSpacing: '0.01em',
                        }}>
                            {children}
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}
