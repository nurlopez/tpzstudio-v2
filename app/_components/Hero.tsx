'use client'

import Image from 'next/image'
import { Reveal } from './Motion'

import { urlFor } from '@/sanity/lib/image'
import { BreathingOverlay } from './BreathingOverlay'

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
    const mode = background?.mode ?? (background?.videoUrl ? 'videoUrl' : 'image')

    const hasImage = !!background?.image
    const hasVideo = !!background?.videoUrl

    const embedUrl = hasVideo && background?.videoUrl ? toEmbedUrl(background.videoUrl) : null

    return (
        <section style={{ 
            position: 'relative', 
            minHeight: 'calc(100vh - 72px)',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
        }}>
            {/* Cinematic letterboxing bars (optional, can be toggled) */}
            <div 
                aria-hidden 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4%',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
                    zIndex: 5,
                    pointerEvents: 'none',
                }}
            />
            <div 
                aria-hidden 
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '4%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                    zIndex: 5,
                    pointerEvents: 'none',
                }}
            />
            
            {/* Background layer */}
            <div aria-hidden style={{ position: 'absolute', inset: 0 }}>
                {mode === 'image' && hasImage ? (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                        className="hero-image-wrapper"
                    >
                        <Image
                            src={urlFor(background?.image).width(2000).height(1200).quality(80).url()}
                            alt=""
                            fill
                            priority
                            style={{ 
                                objectFit: 'cover', 
                                filter: 'saturate(0.85) contrast(1.1) brightness(0.95)',
                            }}
                        />
                    </div>
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
                                transform: 'scale(1.1)',
                                filter: 'saturate(0.85) contrast(1.1) brightness(0.95)',
                                transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
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
                                transform: 'scale(1.15)',
                                filter: 'brightness(0.95)',
                            }}
                        />
                    ) : null
                ) : null}

            </div>

            {/* Overlays (cinema) */}
            <BreathingOverlay />

            {/* Enhanced film grain texture - more realistic */}
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.12,
                    backgroundImage:
                        'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%27100%27%3E%3Cfilter id=%27grain%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3CfeColorMatrix values=%270 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0%27/%3E%3C/filter%3E%3Crect width=%27100%27 height=%27100%27 filter=%27url(%23grain)%27/%3E%3C/svg%3E")',
                    mixBlendMode: 'overlay',
                    pointerEvents: 'none',
                    zIndex: 2,
                }}
            />
            
            {/* Additional color grading overlay for cinematic look */}
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255,240,200,0.03) 0%, transparent 70%)',
                    mixBlendMode: 'soft-light',
                    pointerEvents: 'none',
                    zIndex: 3,
                }}
            />

            {/* Content */}
            <div style={{ 
                position: 'relative', 
                padding: '48px 24px',
                width: '100%',
                zIndex: 4,
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <Reveal y={20}>
                        <h1 style={{ 
                            fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
                            lineHeight: 1.05, 
                            margin: 0, 
                            letterSpacing: '-0.04em',
                            fontWeight: 400,
                            fontFamily: 'var(--font-serif), Georgia, serif',
                            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                        }}>
                            {headline}
                        </h1>
                    </Reveal>

                    {subheadline ? (
                        <Reveal delay={0.08} y={20}>
                            <p style={{ 
                                marginTop: 20, 
                                maxWidth: 760, 
                                fontSize: 'clamp(16px, 2vw, 18px)', 
                                lineHeight: 1.7, 
                                opacity: 0.92,
                                fontWeight: 300,
                                letterSpacing: '0.01em',
                                textShadow: '0 1px 10px rgba(0,0,0,0.4)',
                            }}>
                                {subheadline}
                            </p>
                        </Reveal>
                    ) : null}

                    {ctaLabel && ctaUrl ? (
                        <Reveal delay={0.16} y={20}>
                            <div style={{ marginTop: 32 }}>
                                <a
                                    href={ctaUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hero-cta"
                                    style={{
                                        display: 'inline-block',
                                        padding: '14px 28px',
                                        borderRadius: 8,
                                        background: 'rgba(255,255,255,0.95)',
                                        color: '#0a0a0a',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        fontSize: 14,
                                        letterSpacing: '0.02em',
                                        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                                    }}
                                >
                                    {ctaLabel}
                                </a>
                            </div>
                        </Reveal>
                    ) : null}

                </div>
            </div>
        </section>
    )
}
