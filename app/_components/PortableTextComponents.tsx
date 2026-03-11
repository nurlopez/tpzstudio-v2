import Image from 'next/image'

/**
 * Video URL utilities for embed detection and conversion
 */
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

/**
 * Shared PortableText custom components for rendering inline images and videos
 * in blog posts and project body content.
 */
export const portableTextComponents = {
  types: {
    image: ({ value }: { value: { asset?: { url?: string }; alt?: string; caption?: string } }) => {
      if (!value?.asset?.url) return null
      return (
        <figure style={{ margin: '2em 0' }}>
          <div
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <Image
              src={value.asset.url}
              alt={value.alt || ''}
              width={1200}
              height={675}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {value.alt && (
            <figcaption
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--paper-ink-muted)',
                marginTop: 'var(--space-sm)',
                textAlign: 'center',
              }}
            >
              {value.alt}
            </figcaption>
          )}
        </figure>
      )
    },
    video: ({ value }: { value: { url?: string; caption?: string } }) => {
      if (!value?.url) return null

      const url = value.url
      const embedUrl = !isMp4(url) ? toEmbedUrl(url) : null

      return (
        <figure style={{ margin: '2em 0' }}>
          <div
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <div style={{ position: 'relative', aspectRatio: '16 / 9' }}>
              {isMp4(url) ? (
                <video
                  controls
                  playsInline
                  preload="metadata"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                >
                  <source src={url} type="video/mp4" />
                </video>
              ) : (
                <iframe
                  src={embedUrl ?? url}
                  title={value.caption || 'Vídeo'}
                  allow="autoplay; fullscreen; picture-in-picture"
                  style={{ width: '100%', height: '100%', border: 0 }}
                />
              )}
            </div>
          </div>
          {value.caption && (
            <figcaption
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--paper-ink-muted)',
                marginTop: 'var(--space-sm)',
                textAlign: 'center',
              }}
            >
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}
