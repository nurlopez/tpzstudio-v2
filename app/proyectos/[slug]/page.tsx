import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { PageFade } from '@/app/_components/PageFade'
import { Reveal } from '@/app/_components/Motion'
import Link from 'next/link'



const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0]{
    title,
    excerpt,
    "slug": slug.current,
    "videoUrl": video.url,
    categories,
    body
  }
`

function isYouTube(url: string) {
    return /youtube\.com|youtu\.be/.test(url)
}
function isVimeo(url: string) {
    return /vimeo\.com/.test(url)
}
function isMp4(url: string) {
    return /\.mp4(\?.*)?$/i.test(url)
}
function toEmbedUrl(url: string) {
    if (isYouTube(url)) {
        const m = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]v=([a-zA-Z0-9_-]+)/)
        const id = m?.[1]
        return id
            ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&mute=0&controls=1&playsinline=1`
            : url
    }
    if (isVimeo(url)) {
        const m = url.match(/vimeo\.com\/(\d+)/)
        const id = m?.[1]
        return id ? `https://player.vimeo.com/video/${id}` : url
    }
    return url
}

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    if (!slug) {
        return <main style={{ padding: 24 }}>Missing slug.</main>
    }

    const project = await client.fetch(projectBySlugQuery, { slug })

    if (!project) {
        return <main style={{ padding: 24 }}>No existe este proyecto.</main>
    }

    const videoUrl: string | undefined = project?.videoUrl

    const embedUrl = videoUrl && !isMp4(videoUrl) ? toEmbedUrl(videoUrl) : null

    return (
        <PageFade>
            <main style={{ padding: '48px 24px 96px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <Reveal y={16}>
                        <div style={{ marginBottom: 24 }}>
                            <Link 
                                href="/proyectos" 
                                className="project-back-link"
                                style={{ 
                                    color: 'rgba(255,255,255,0.75)', 
                                    textDecoration: 'none',
                                    fontSize: 14,
                                    fontWeight: 500,
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                ← Volver a proyectos
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
                            Proyecto
                        </div>
                    </Reveal>

                    <Reveal delay={0.06} y={16}>
                        <h1 style={{ 
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
                            margin: '0 0 16px', 
                            letterSpacing: '-0.04em',
                            fontWeight: 400,
                            fontFamily: 'var(--font-serif), Georgia, serif',
                        }}>
                            {project.title}
                        </h1>
                    </Reveal>

                    {project.excerpt ? (
                        <Reveal delay={0.12} y={16}>
                            <p style={{ 
                                marginTop: 16, 
                                maxWidth: 800, 
                                opacity: 0.88, 
                                lineHeight: 1.75,
                                fontSize: 'clamp(16px, 1.8vw, 18px)',
                                fontWeight: 300,
                            }}>
                                {project.excerpt}
                            </p>
                        </Reveal>
                    ) : null}


                    {videoUrl ? (
                        <Reveal delay={0.18} y={16}>
                            <div
                                style={{
                                    marginTop: 32,
                                    borderRadius: 12,
                                    overflow: 'hidden',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    background: 'rgba(255,255,255,0.02)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                                }}
                            >
                                <div style={{ position: 'relative', aspectRatio: '16 / 9' }}>
                                    {isMp4(videoUrl) ? (
                                        <video controls playsInline preload="metadata" style={{ width: '100%', height: '100%' }}>
                                            <source src={videoUrl} type="video/mp4" />
                                        </video>
                                    ) : (
                                        <iframe
                                            src={embedUrl ?? videoUrl}
                                            title={project.title ?? 'Video'}
                                            allow="autoplay; fullscreen; picture-in-picture"
                                            style={{ width: '100%', height: '100%', border: 0 }}
                                        />
                                    )}
                                </div>
                            </div>
                        </Reveal>
                    ) : null}

                    {Array.isArray(project.categories) && project.categories.length ? (
                        <Reveal delay={0.24} y={16}>
                            <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                {project.categories.map((c: string) => (
                                    <span
                                        key={c}
                                        className="project-category-tag"
                                        style={{
                                            fontSize: 12,
                                            padding: '8px 14px',
                                            borderRadius: 6,
                                            border: '1px solid rgba(255,255,255,0.12)',
                                            background: 'rgba(255,255,255,0.04)',
                                            opacity: 0.85,
                                            fontWeight: 500,
                                            letterSpacing: '0.02em',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </Reveal>
                    ) : null}
                </div>
            </main>
        </PageFade>
    )
}
