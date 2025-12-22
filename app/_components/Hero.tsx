import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

type HeroBg =
    | { mode?: 'image'; image?: any; videoUrl?: string }
    | { mode?: 'videoUrl'; image?: any; videoUrl?: string }

type Props = {
    headline?: string
    subheadline?: string
    ctaLabel?: string
    ctaUrl?: string
    background?: HeroBg
}

function isMp4(url: string) {
    return /\.mp4(\?.*)?$/i.test(url)
}


function isYouTube(url: string) {
    return /youtube\.com|youtu\.be/.test(url)
}

function isVimeo(url: string) {
    return /vimeo\.com/.test(url)
}

function toEmbedUrl(url: string) {
    // YouTube
    if (isYouTube(url)) {
        const m =
            url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/) ||
            url.match(/[?&]v=([a-zA-Z0-9_-]+)/)
        const id = m?.[1]
        return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1` : url
    }

    // Vimeo
    if (isVimeo(url)) {
        const m = url.match(/vimeo\.com\/(\d+)/)
        const id = m?.[1]
        return id ? `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&background=1&loop=1` : url
    }

    return url
}

export function Hero({ headline, subheadline, ctaLabel, ctaUrl, background }: Props) {
    const mode = background?.mode ?? 'image'
    const hasImage = !!background?.image
    const hasVideo = !!background?.videoUrl

    const embedUrl = hasVideo && background?.videoUrl ? toEmbedUrl(background.videoUrl) : null

    return (
        <section style={{ position: 'relative', minHeight: 520, overflow: 'hidden' }}>
            {/* Background layer */}
            <div aria-hidden style={{ position: 'absolute', inset: 0 }}>
                {mode === 'image' && hasImage ? (
                    <Image
                        src={urlFor(background?.image).width(2000).height(1200).quality(80).url()}
                        alt=""
                        fill
                        priority
                        style={{ objectFit: 'cover', filter: 'saturate(0.9) contrast(1.05)' }}
                    />
                ) : null}

                {mode === 'videoUrl' && hasVideo && background?.videoUrl ? (
                    isMp4(background.videoUrl) ? (
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transform: 'scale(1.08)',
                                filter: 'saturate(0.9) contrast(1.05)',
                            }}
                        >
                            <source src={background.videoUrl} type="video/mp4" />
                        </video>
                    ) : embedUrl ? (
                        <iframe
                            src={embedUrl}
                            title="Hero video"
                            allow="autoplay; fullscreen; picture-in-picture"
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 0,
                                transform: 'scale(1.12)',
                            }}
                        />
                    ) : null
                ) : null}

            </div>

            {/* Overlays (cinema) */}
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        'radial-gradient(1000px 600px at 20% 15%, rgba(255,255,255,0.10), transparent 60%), linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.92))',
                }}
            />

            {/* “Grain” suave (CSS only) */}
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.08,
                    backgroundImage:
                        'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2780%27 height=%2780%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%2780%27 height=%2780%27 filter=%27url(%23n)%27 opacity=%270.4%27/%3E%3C/svg%3E")',
                    mixBlendMode: 'overlay',
                    pointerEvents: 'none',
                }}
            />

            {/* Content */}
            <div style={{ position: 'relative', padding: '88px 24px 56px' }}>
                <div style={{ maxWidth: 980, margin: '0 auto' }}>
                    <h1 style={{ fontSize: 46, lineHeight: 1.03, margin: 0, letterSpacing: '-0.02em' }}>
                        {headline}
                    </h1>

                    {subheadline ? (
                        <p style={{ marginTop: 14, maxWidth: 720, fontSize: 16, lineHeight: 1.65, opacity: 0.9 }}>
                            {subheadline}
                        </p>
                    ) : null}

                    {ctaLabel && ctaUrl ? (
                        <div style={{ marginTop: 18 }}>
                            <a
                                href={ctaUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    display: 'inline-block',
                                    padding: '12px 16px',
                                    borderRadius: 999,
                                    background: 'rgba(255,255,255,0.92)',
                                    color: '#0b0b0b',
                                    textDecoration: 'none',
                                    fontWeight: 650,
                                }}
                            >
                                {ctaLabel}
                            </a>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    )
}
