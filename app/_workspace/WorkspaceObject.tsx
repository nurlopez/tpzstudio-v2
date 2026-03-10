'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useWorkspace } from './WorkspaceProvider'
import { ObjectType, WorkspaceObjectVisual } from './types'
import { getIcon } from '../_components/IconMap'

/**
 * WorkspaceObject
 * 
 * Individual interactive object.
 * 
 * Responsibilities:
 * - Renders object visual (SVG, image, or custom component)
 * - Manages local hover/focus state
 * - Handles click → navigates to object route
 * - Applies object-level animations (hover, focus, idle)
 * - Displays object label on hover
 * - Responds to global focus state (opacity, scale changes)
 * 
 * Does NOT:
 * - Fetch object content (receives data as prop)
 * - Render panel content (panel is separate component)
 * - Manage panel state (delegates to workspace state)
 * - Handle deep navigation (delegates to Next.js router)
 * 
 * Props:
 * - slug: string - Object identifier
 * - type: ObjectType - Object type (determines visual)
 * - position?: { x: number, y: number } - Canvas position
 * - title: string - Object title/label
 * - visual?: WorkspaceObjectVisual - Optional isometric/pseudo-3D visual
 * - isFocused: boolean - From global state
 * - onClick: () => void - Navigation handler
 */
interface WorkspaceObjectProps {
  slug: string
  type: ObjectType
  position?: { x: number; y: number }
  title: string
  visual?: WorkspaceObjectVisual
  isFocused: boolean
  onClick: () => void
  /** Stagger index for entrance animation */
  index?: number
}

/**
 * Map objectType from Sanity to icon name
 * Sanity objectType values: 'camera', 'waveform', 'blueprint', 'book', 'lightbulb', 'stack', 'envelope'
 * Legacy ObjectType values: 'film', 'voiceovers', 'branding', 'courses', 'strategy', 'projects', 'contact'
 */
function getObjectTypeIcon(objectType: ObjectType | string): React.ReactNode {
  // Map Sanity objectType to IconMap icon names
  const iconMap: Record<string, string> = {
    // Sanity schema values
    'camera': 'camera',
    'waveform': 'music',
    'blueprint': 'code',
    'book': 'graduation-cap',
    'lightbulb': 'lightbulb',
    'stack': 'cube',
    'envelope': 'users',
    // Legacy ObjectType values (for backward compatibility)
    'film': 'film',
    'voiceovers': 'music',
    'branding': 'palette',
    'courses': 'graduation-cap',
    'strategy': 'lightbulb',
    'projects': 'cube',
    'contact': 'users',
  }
  
  const iconName = iconMap[objectType] || 'cube'
  return getIcon(iconName)
}

/** Simple seeded random 0-1 for deterministic per-object values */
function seededRandom(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash) / 2147483647
}

export function WorkspaceObject({
  slug,
  type,
  position,
  title,
  visual,
  isFocused,
  onClick,
  index = 0,
}: WorkspaceObjectProps) {
  const { state, actions } = useWorkspace()
  const [isHovered, setIsHovered] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)

  // Entrance delay: objects appear after logo (0.3s) + greeting (~0.8s)
  const entranceDelay = 1.0 + index * 0.12

  // Entrance direction — each object flies in from a different angle
  const entranceAngle = seededRandom(`${slug}-angle`) * Math.PI * 2
  const entranceDistance = 30 + seededRandom(`${slug}-entrance`) * 20
  const entranceX = Math.cos(entranceAngle) * entranceDistance
  const entranceY = Math.sin(entranceAngle) * entranceDistance

  // Per-object idle float parameters (deterministic from slug, ~3s)
  const floatDuration = 2.5 + seededRandom(slug) * 1
  const floatDistance = 3 + seededRandom(`${slug}-dist`) * 3

  const handleMouseEnter = () => {
    // Only handle hover if not on touch device (desktop only)
    if (!state.touchEnabled) {
      setIsHovered(true)
      // Only update global state if not already set
      if (state.hoveredObject !== slug) {
        actions.setHoveredObject(slug)
      }
    }
  }

  const handleMouseLeave = () => {
    // Only handle hover if not on touch device (desktop only)
    if (!state.touchEnabled) {
      setIsHovered(false)
      // Only clear if this object was the hovered one
      if (state.hoveredObject === slug) {
        actions.setHoveredObject(null)
      }
    }
  }

  const handleClick = () => {
    // onClick handler - delay logic is handled in Canvas component
    onClick()
  }

  // Determine object state for data attribute
  const objectState = isFocused
    ? 'focused'
    : state.focusedObject && state.focusedObject !== slug
    ? 'muted'
    : isHovered
    ? 'hovered'
    : 'default'

  // Position style
  // PERMANENT: Positions are calculated deterministically based on object slug
  // Objects appear in consistent locations across reloads
  const positionStyle: React.CSSProperties = position
    ? {
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }
    : {}

  return (
    <div
      data-position-x={position?.x}
      data-position-y={position?.y}
      style={positionStyle}
      className="absolute"
    >
      <motion.div
        data-workspace-object
        data-object-slug={slug}
        data-object-type={type}
        data-state={objectState}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        initial={{ opacity: 0, x: entranceX, y: entranceY, scale: 0.85 }}
        animate={hasEntered
          ? { opacity: 1, x: 0, y: [0, -floatDistance, 0], scale: 1 }
          : { opacity: 1, x: 0, y: 0, scale: 1 }
        }
        transition={hasEntered
          ? {
              y: { duration: floatDuration, repeat: Infinity, ease: 'easeInOut' },
              x: { duration: 0 },
              opacity: { duration: 0 },
              scale: { duration: 0 },
            }
          : {
              duration: 0.6,
              delay: entranceDelay,
              ease: [0.22, 1, 0.36, 1],
            }
        }
        onAnimationComplete={() => {
          if (!hasEntered) setHasEntered(true)
        }}
        className="cursor-pointer will-change-[transform,opacity] touch-auto pointer-events-auto"
      >
      {/* Object visual */}
      <div 
        data-workspace-object-visual
        className="flex items-center justify-center relative"
        style={{
          minWidth: 'var(--object-size, 120px)',
          maxWidth: 'var(--object-size, 180px)',
          width: 'auto',
          height: 'auto',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--ink-secondary)',
        }}
      >
        {visual ? (
          /* Visual image - fills container naturally, respects min/max width, natural height */
          /* Visual scales with object (hover/focus) but never animates independently */
          <div
            className="relative flex items-center justify-center"
            style={{
              width: '100%',
              height: 'auto',
              minWidth: 'var(--object-size, 120px)',
              maxWidth: 'var(--object-size, 180px)',
            }}
            aria-hidden={visual.alt ? undefined : 'true'}
          >
            <Image
              src={visual.url}
              alt={visual.alt || ''}
              width={180}
              height={180}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
              }}
              sizes="(max-width: 768px) 120px, 180px"
              unoptimized={visual.url.endsWith('.svg')}
              priority={false}
            />
          </div>
        ) : (
          /* Icon fallback - use objectType to get icon when no visual */
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              minHeight: 'var(--object-size, 120px)',
              color: 'var(--ink-secondary)',
            }}
            aria-hidden="true"
          >
            {getObjectTypeIcon(type)}
          </div>
        )}
      </div>

      {/* Object label (shown on hover or tap) */}
      <div 
        data-workspace-object-label
        className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-10"
        style={{
          marginTop: 'var(--space-sm)',
          padding: 'var(--space-xs) var(--space-sm)',
          backgroundColor: 'transparent',
          background: 'transparent',
          boxShadow: 'none',
          textShadow: 'none',
          fontFamily: 'var(--font-lacquer), sans-serif',
          color: 'var(--paper-ink-primary)',
          fontSize: 'var(--font-size-sm)',
          opacity: (isHovered || isFocused) ? 1 : 0,
          transition: 'opacity var(--motion-fast) var(--ease-out)',
        }}
      >
        {title}
      </div>
      </motion.div>
    </div>
  )
}
