'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useWorkspace } from './WorkspaceProvider'
import { ObjectType, WorkspaceObjectVisual } from './types'

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
}

export function WorkspaceObject({
  slug,
  type,
  position,
  title,
  visual,
  isFocused,
  onClick,
}: WorkspaceObjectProps) {
  const { state, actions } = useWorkspace()
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    // Only handle hover if not on touch device
    if (!state.touchEnabled) {
      setIsHovered(true)
      // Only update global state if not already set
      if (state.hoveredObject !== slug) {
        actions.setHoveredObject(slug)
      }
    }
  }

  const handleMouseLeave = () => {
    if (!state.touchEnabled) {
      setIsHovered(false)
      // Only clear if this object was the hovered one
      if (state.hoveredObject === slug) {
        actions.setHoveredObject(null)
      }
    }
  }

  const handleClick = () => {
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
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        transition: 'opacity var(--motion-standard) var(--ease-in-out), transform var(--motion-standard) var(--ease-in-out)',
      }
    : {
        transition: 'opacity var(--motion-standard) var(--ease-in-out), transform var(--motion-standard) var(--ease-in-out)',
      }

  return (
    <div
      data-workspace-object
      data-object-slug={slug}
      data-object-type={type}
      data-state={objectState}
      data-debug="true"
      data-position-x={position?.x}
      data-position-y={position?.y}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={positionStyle}
      className="absolute cursor-pointer will-change-[transform,opacity] touch-auto pointer-events-auto"
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
          /* Text fallback - primary when no visual */
          <span>{type}</span>
        )}
      </div>

      {/* Object label (shown on hover) */}
      <div 
        data-workspace-object-label
        className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 pointer-events-none z-10 rounded"
        style={{
          marginTop: 'var(--space-sm)',
          padding: 'var(--space-xs) var(--space-sm)',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          color: 'var(--ink-primary)',
          fontSize: 'var(--font-size-xs)',
          transition: 'opacity var(--motion-fast) var(--ease-out)',
        }}
      >
        {title}
      </div>
    </div>
  )
}
