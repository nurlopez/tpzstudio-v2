import { ReactNode } from 'react'
import { Reveal } from './Motion'

type Props = {
    title?: string
    children: ReactNode
    padding?: string
    maxWidth?: number | string
}

// Reusable text block with gentle reveal and consistent spacing.
export function TextSection({ title, children, padding = '32px 24px 12px', maxWidth = 940 }: Props) {
    const resolvedMaxWidth = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth

    return (
        <section style={{ padding }}>
            <div style={{ maxWidth: resolvedMaxWidth, margin: '0 auto' }}>
                <Reveal y={12}>
                    <div style={{ display: 'grid', gap: 8 }}>
                        {title ? (
                            <h2 style={{ margin: 0, fontSize: 24, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                                {title}
                            </h2>
                        ) : null}

                        <div style={{ fontSize: 17, lineHeight: 1.7, opacity: 0.9 }}>{children}</div>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}

