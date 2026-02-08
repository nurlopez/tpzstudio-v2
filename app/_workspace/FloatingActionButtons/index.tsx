'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { FABButton } from './FABButton'
import { FABDrawer } from './FABDrawer'
import { FABDrawerContent } from './FABDrawerContent'

/**
 * FloatingActionButtons
 *
 * Container for FAB buttons and drawer management.
 * Includes audio play/pause control.
 */

type DrawerType = 'contact' | 'about' | null

// Icons
const EnvelopeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const PersonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
)

const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
)

const PauseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
)

export function FloatingActionButtons() {
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null)

  // Audio state
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Fetch audio URL on mount
  useEffect(() => {
    fetch('/api/fab-content/audio')
      .then(res => res.json())
      .then(data => {
        if (data.audioUrl) {
          setAudioUrl(data.audioUrl)
        }
      })
      .catch(err => {
        console.error('[FAB] Error fetching audio URL:', err)
      })
  }, [])

  // Create audio instance when URL is available
  useEffect(() => {
    if (!audioUrl) return

    // Create single audio instance
    const audio = new Audio(audioUrl)
    audio.loop = true
    audio.preload = 'none' // Don't preload until user interaction
    audioRef.current = audio

    // Sync state with actual audio events
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    // Cleanup on unmount
    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.pause()
      audioRef.current = null
    }
  }, [audioUrl])

  // Toggle audio play/pause
  const handleAudioToggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(err => {
        console.error('[FAB] Audio play failed:', err)
      })
    }
  }, [isPlaying])

  const handleDrawerToggle = (type: DrawerType) => {
    setActiveDrawer(current => current === type ? null : type)
  }

  const handleClose = () => {
    setActiveDrawer(null)
  }

  return (
    <>
      {/* FAB Container - Bottom right vertical stack */}
      <div
        data-fab-container
        className="fixed bottom-6 right-6 z-[1000] flex flex-col-reverse gap-3
          md:bottom-6 md:right-6
          max-md:bottom-4 max-md:right-4"
      >
        {/* Contact FAB */}
        <FABButton
          label="Abrir contacto"
          icon={<EnvelopeIcon />}
          isActive={activeDrawer === 'contact'}
          onClick={() => handleDrawerToggle('contact')}
          index={0}
          controlsId="fab-drawer-contact"
        />

        {/* About FAB */}
        <FABButton
          label="Abrir sobre mí"
          icon={<PersonIcon />}
          isActive={activeDrawer === 'about'}
          onClick={() => handleDrawerToggle('about')}
          index={1}
          controlsId="fab-drawer-about"
        />

        {/* Audio FAB - only render if audio URL exists */}
        {audioUrl && (
          <FABButton
            label={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
            icon={isPlaying ? <PauseIcon /> : <PlayIcon />}
            isActive={isPlaying}
            onClick={handleAudioToggle}
            index={2}
            controlsId="fab-audio-control"
          />
        )}
      </div>

      {/* Contact Drawer */}
      <FABDrawer
        isOpen={activeDrawer === 'contact'}
        onClose={handleClose}
        title="Contacto"
        id="fab-drawer-contact"
      >
        <FABDrawerContent type="contact" />
      </FABDrawer>

      {/* About Drawer */}
      <FABDrawer
        isOpen={activeDrawer === 'about'}
        onClose={handleClose}
        title="Sobre mí"
        id="fab-drawer-about"
      >
        <FABDrawerContent type="about" />
      </FABDrawer>
    </>
  )
}
