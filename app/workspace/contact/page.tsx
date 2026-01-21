import { client } from '@/sanity/lib/client'
import { contactPageQuery } from '@/sanity/lib/queries'
import { getSocialIcon } from '@/app/_components/IconMap'
import { Metadata } from 'next'

/**
 * Contact Page
 * 
 * Route: /workspace/contact
 * 
 * This page is rendered when the contact panel is open.
 * The Panel component is rendered by WorkspaceRoot based on workspace state.
 * 
 * Fetches contact data from Sanity and renders it within the panel.
 */
export async function generateMetadata(): Promise<Metadata> {
  const contact = await client.fetch(contactPageQuery)
  
  const title = contact?.seo?.metaTitle || contact?.title || 'Contacto'
  const description = contact?.seo?.metaDescription || contact?.introText || 'Get in touch with TPZ Studio. Contact us for inquiries about our services in film, voiceovers, branding, and more.'

  return {
    title,
    description,
    openGraph: {
      title: `${title} | TPZ Studio`,
      description,
      url: '/workspace/contact',
    },
    twitter: {
      card: 'summary',
      title: `${title} | TPZ Studio`,
      description,
    },
  }
}

export default async function ContactPage() {
  try {
    const contact = await client.fetch(contactPageQuery)

    if (!contact) {
      return (
        <div data-contact-content style={{ padding: 'var(--space-xl)' }}>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--ink-muted)' }}>
            Contact information not available. Please check Sanity Studio.
          </p>
        </div>
      )
    }

    return (
      <div data-contact-content>
      {/* Header */}
      {contact.title && (
        <header
          style={{
            marginBottom: 'var(--space-2xl)',
          }}
        >
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--ink-primary)',
              marginBottom: contact.introText ? 'var(--space-md)' : 0,
              lineHeight: 'var(--line-height-tight)',
            }}
          >
            {contact.title}
          </h2>
          {contact.introText && (
            <p
              style={{
                fontSize: 'var(--font-size-md)',
                color: 'var(--ink-primary)',
                lineHeight: 'var(--line-height-relaxed)',
                marginBottom: 0,
              }}
            >
              {contact.introText}
            </p>
          )}
        </header>
      )}

      {/* Contact Information */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-xl)',
          marginBottom: contact.socialMedia ? 'var(--space-2xl)' : 0,
        }}
      >
        {/* Phone */}
        {contact.phone?.number && (
          <div>
            <h3
              style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--ink-secondary)',
                marginBottom: 'var(--space-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Teléfono
            </h3>
            {contact.phone.url ? (
              <a
                href={contact.phone.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 'var(--font-size-md)',
                  color: 'var(--ink-interactive)',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'text-decoration var(--motion-fast) var(--ease-out)',
                }}
                className="hover:underline"
              >
                {contact.phone.number}
              </a>
            ) : (
              <p
                style={{
                  fontSize: 'var(--font-size-md)',
                  color: 'var(--ink-primary)',
                  marginBottom: 0,
                }}
              >
                {contact.phone.number}
              </p>
            )}
          </div>
        )}

        {/* Email */}
        {contact.email?.address && (
          <div>
            <h3
              style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--ink-secondary)',
                marginBottom: 'var(--space-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Email
            </h3>
            <a
              href={`mailto:${contact.email.address}`}
              style={{
                fontSize: 'var(--font-size-md)',
                color: 'var(--ink-interactive)',
                textDecoration: 'none',
                display: 'inline-block',
                marginBottom: contact.email.label ? 'var(--space-xs)' : 0,
                transition: 'text-decoration var(--motion-fast) var(--ease-out)',
              }}
              className="hover:underline"
            >
              {contact.email.address}
            </a>
            {contact.email.label && (
              <p
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--ink-secondary)',
                  marginBottom: 0,
                }}
              >
                {contact.email.label}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Social Media */}
      {contact.socialMedia && (
        <div
          style={{
            marginTop: 'var(--space-2xl)',
            paddingTop: 'var(--space-xl)',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <h3
            style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--ink-secondary)',
              marginBottom: 'var(--space-md)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Redes Sociales
          </h3>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-md)',
            }}
          >
            {contact.socialMedia.instagram && (
              <a
                href={contact.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--ink-interactive)',
                  textDecoration: 'none',
                  transition: 'text-decoration var(--motion-fast) var(--ease-out)',
                }}
                className="hover:underline"
              >
                {getSocialIcon('instagram')}
                <span>Instagram</span>
              </a>
            )}
            {contact.socialMedia.vimeo && (
              <a
                href={contact.socialMedia.vimeo}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--ink-interactive)',
                  textDecoration: 'none',
                  transition: 'text-decoration var(--motion-fast) var(--ease-out)',
                }}
                className="hover:underline"
              >
                {getSocialIcon('vimeo')}
                <span>Vimeo</span>
              </a>
            )}
            {contact.socialMedia.youtube && (
              <a
                href={contact.socialMedia.youtube}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--ink-interactive)',
                  textDecoration: 'none',
                  transition: 'text-decoration var(--motion-fast) var(--ease-out)',
                }}
                className="hover:underline"
              >
                {getSocialIcon('youtube')}
                <span>YouTube</span>
              </a>
            )}
            {contact.socialMedia.tiktok && (
              <a
                href={contact.socialMedia.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--ink-interactive)',
                  textDecoration: 'none',
                  transition: 'text-decoration var(--motion-fast) var(--ease-out)',
                }}
                className="hover:underline"
              >
                {getSocialIcon('tiktok')}
                <span>TikTok</span>
              </a>
            )}
            {contact.socialMedia.linkedin && (
              <a
                href={contact.socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--ink-interactive)',
                  textDecoration: 'none',
                  transition: 'text-decoration var(--motion-fast) var(--ease-out)',
                }}
                className="hover:underline"
              >
                {getSocialIcon('linkedin')}
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>
      )}
      </div>
    )
  } catch (error) {
    console.error('[ContactPage] Error fetching contact data:', error)
    return (
      <div style={{ padding: 'var(--space-xl)' }}>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--ink-muted)' }}>
          Error loading contact information. Please try again later.
        </p>
      </div>
    )
  }
}
