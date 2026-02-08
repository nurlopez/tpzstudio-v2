'use client'

import React, { useEffect, useState } from 'react'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'

/**
 * FABDrawerContent
 *
 * Fetches and renders contact or about content from Sanity.
 * Uses client-side fetch to API routes for fresh data.
 */

interface ContactData {
  title?: string
  introText?: string
  phone?: {
    number?: string
    url?: string
  }
  email?: {
    address?: string
    label?: string
  }
  socialMedia?: {
    instagram?: string
    vimeo?: string
    youtube?: string
    tiktok?: string
    linkedin?: string
  }
}

interface AboutData {
  title?: string
  body?: any[]
  image?: {
    asset?: {
      url?: string
    }
    alt?: string
  }
  cta?: {
    text?: string
    url?: string
  }
}

interface FABDrawerContentProps {
  type: 'contact' | 'about'
}

// Simple social icon component
function SocialIcon({ name }: { name: string }) {
  const iconPaths: Record<string, string> = {
    instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
    vimeo: 'M22.875 10.063c-2.442 5.217-8.337 12.319-12.063 12.319-3.672 0-4.203-7.831-6.208-13.043-.987-2.565-1.624-1.976-3.474-.681l-1.13-1.455c2.698-2.372 5.398-5.127 7.057-5.28 1.868-.179 3.018 1.098 3.448 3.832.568 3.593 1.362 9.17 2.748 9.17 1.08 0 3.741-4.424 3.878-6.006.243-2.316-1.703-2.386-3.392-1.663 2.673-8.754 13.793-7.142 9.136 2.807z',
    youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    tiktok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
    linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  }

  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d={iconPaths[name] || ''} />
    </svg>
  )
}

// Contact form component
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar')
      }

      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Error al enviar el mensaje')
    }
  }

  const inputStyles = `
    w-full px-3 py-2
    border border-black/15 rounded-md
    text-black/85 text-sm
    placeholder:text-black/40
    focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30
    transition-colors duration-150
  `

  if (status === 'success') {
    return (
      <div className="py-4 text-center">
        <p className="text-base text-black/85 mb-2">¡Mensaje enviado!</p>
        <p className="text-sm text-black/60">Te responderemos pronto.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm text-black/60 underline"
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contact-name" className="block text-xs font-medium text-black/50 uppercase tracking-wider mb-2">
          Nombre
        </label>
        <input
          type="text"
          id="contact-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={status === 'sending'}
          className={inputStyles}
          placeholder="Tu nombre"
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-xs font-medium text-black/50 uppercase tracking-wider mb-2">
          Email
        </label>
        <input
          type="email"
          id="contact-email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={status === 'sending'}
          className={inputStyles}
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-xs font-medium text-black/50 uppercase tracking-wider mb-2">
          Mensaje
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          disabled={status === 'sending'}
          rows={4}
          className={`${inputStyles} resize-none`}
          placeholder="Tu mensaje..."
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-2.5 px-4
          bg-black text-white text-sm font-medium
          rounded-md
          hover:bg-black/85
          disabled:bg-black/50 disabled:cursor-not-allowed
          focus:outline-none
          transition-colors duration-150"
      >
        {status === 'sending' ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  )
}

export function FABDrawerContent({ type }: FABDrawerContentProps) {
  const [data, setData] = useState<ContactData | AboutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const endpoint = type === 'contact' ? '/api/fab-content/contact' : '/api/fab-content/about'
        const response = await fetch(endpoint)

        if (!response.ok) {
          throw new Error('Failed to fetch content')
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        console.error(`[FABDrawerContent] Error fetching ${type} data:`, err)
        setError('Error loading content')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [type])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <p className="text-sm text-black/50">
        {error || 'Content not available'}
      </p>
    )
  }

  if (type === 'contact') {
    const contact = data as ContactData

    return (
      <div className="space-y-6">
        {/* Intro Text */}
        {contact.introText && (
          <p className="text-base text-black/75 leading-relaxed">
            {contact.introText}
          </p>
        )}

        {/* Contact Form */}
        <ContactForm />

        {/* Phone (after form) */}
        {contact.phone?.number && (
          <div className="pt-4 border-t border-black/10">
            <h3 className="text-xs font-medium text-black/50 uppercase tracking-wider mb-2">
              Teléfono
            </h3>
            {contact.phone.url ? (
              <a
                href={contact.phone.url}
                className="text-base text-black/85 hover:underline"
              >
                {contact.phone.number}
              </a>
            ) : (
              <p className="text-base text-black/85">{contact.phone.number}</p>
            )}
          </div>
        )}

        {/* Social Media */}
        {contact.socialMedia && (
          <div className="pt-4 border-t border-black/10">
            <h3 className="text-xs font-medium text-black/50 uppercase tracking-wider mb-3">
              Redes Sociales
            </h3>
            <div className="flex flex-wrap gap-3">
              {contact.socialMedia.instagram && (
                <a
                  href={contact.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-black/75 hover:text-black"
                >
                  <SocialIcon name="instagram" />
                  <span>Instagram</span>
                </a>
              )}
              {contact.socialMedia.vimeo && (
                <a
                  href={contact.socialMedia.vimeo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-black/75 hover:text-black"
                >
                  <SocialIcon name="vimeo" />
                  <span>Vimeo</span>
                </a>
              )}
              {contact.socialMedia.youtube && (
                <a
                  href={contact.socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-black/75 hover:text-black"
                >
                  <SocialIcon name="youtube" />
                  <span>YouTube</span>
                </a>
              )}
              {contact.socialMedia.tiktok && (
                <a
                  href={contact.socialMedia.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-black/75 hover:text-black"
                >
                  <SocialIcon name="tiktok" />
                  <span>TikTok</span>
                </a>
              )}
              {contact.socialMedia.linkedin && (
                <a
                  href={contact.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-black/75 hover:text-black"
                >
                  <SocialIcon name="linkedin" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // About content
  const about = data as AboutData
  return (
    <div className="space-y-6">
      {/* Image */}
      {about.image?.asset?.url && (
        <div className="rounded-lg overflow-hidden border border-black/10">
          <Image
            src={about.image.asset.url}
            alt={about.image.alt || about.title || 'About'}
            width={320}
            height={240}
            className="w-full h-auto"
            sizes="320px"
          />
        </div>
      )}

      {/* Body Content */}
      {about.body && Array.isArray(about.body) && about.body.length > 0 && (
        <div className="text-base text-black/75 leading-relaxed portable-text-fab">
          <PortableText value={about.body} />
        </div>
      )}

      {/* CTA */}
      {about.cta?.text && about.cta?.url && (
        <div className="pt-4 border-t border-black/10">
          <a
            href={about.cta.url}
            className="inline-block text-sm font-medium text-black/75 hover:text-black
              px-4 py-2 border border-black/15 rounded-md
              hover:border-black/25 transition-colors duration-150"
          >
            {about.cta.text}
          </a>
        </div>
      )}
    </div>
  )
}
