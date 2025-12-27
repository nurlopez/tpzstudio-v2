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
            <main style={{ padding: '28px 24px 72px' }}>
                <div style={{ maxWidth: 980, margin: '0 auto' }}>
                    <Reveal y={10}>
                        <div style={{ marginBottom: 14 }}>
                            <Link href="/proyectos" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
                                ← Volver a proyectos
                            </Link>
                        </div>
                    </Reveal>

                    <Reveal y={10}>
                        <div style={{ opacity: 0.7, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            Proyecto
                        </div>
                    </Reveal>

                    <Reveal delay={0.04} y={12}>
                        <h1 style={{ fontSize: 34, margin: '8px 0 0', letterSpacing: '-0.02em' }}>
                            {project.title}
                        </h1>
                    </Reveal>

                    {project.excerpt ? (
                        <Reveal delay={0.08} y={12}>
                            <p style={{ marginTop: 12, maxWidth: 760, opacity: 0.9, lineHeight: 1.65 }}>
                                {project.excerpt}
                            </p>
                        </Reveal>
                    ) : null}


                    {videoUrl ? (
                        <Reveal delay={0.12} y={12}>
                            <div
                                style={{
                                    marginTop: 18,
                                    borderRadius: 18,
                                    overflow: 'hidden',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    background: 'rgba(255,255,255,0.03)',
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
                        <Reveal delay={0.16} y={10}>
                            <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {project.categories.map((c: string) => (
                                    <span
                                        key={c}
                                        style={{
                                            fontSize: 12,
                                            padding: '6px 10px',
                                            borderRadius: 999,
                                            border: '1px solid rgba(255,255,255,0.12)',
                                            background: 'rgba(255,255,255,0.03)',
                                            opacity: 0.9,
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
