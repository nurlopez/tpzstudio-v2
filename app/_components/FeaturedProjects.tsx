type Project = {
    _id: string
    title?: string
    excerpt?: string
    video?: { url?: string }
}

export function FeaturedProjects({ title, items }: { title?: string; items: Project[] }) {
    return (
        <section style={{ padding: '28px 24px 64px' }}>
            <div style={{ maxWidth: 980, margin: '0 auto' }}>
                <h2 style={{ fontSize: 22, margin: 0, letterSpacing: '-0.01em' }}>{title}</h2>

                <div style={{ marginTop: 14, display: 'grid', gap: 14 }}>
                    {items.map((p) => (
                        <article
                            key={p._id}
                            style={{
                                border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: 16,
                                padding: 16,
                                background: 'rgba(255,255,255,0.03)',
                            }}
                        >
                            <div style={{ fontWeight: 700 }}>{p.title}</div>
                            {p.excerpt ? <p style={{ marginTop: 8, marginBottom: 0, opacity: 0.85 }}>{p.excerpt}</p> : null}
                            {p.video?.url ? (
                                <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
                                    Video: {p.video.url}
                                </div>
                            ) : null}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
