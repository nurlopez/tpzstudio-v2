'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useWorkspace } from './WorkspaceProvider'
import { WorkspaceObject } from './WorkspaceObject'
import { motion } from 'framer-motion'
import { WorkspaceObjectData, BackgroundConfig } from './types'
import { getWorkspaceObjects } from './lib/getWorkspaceObjects'
import { calculateWorkspaceLayout } from './lib/calculateOptimalLayout'

/**
 * Canvas
 * 
 * Canvas surface and object container.
 * 
 * Responsibilities:
 * - Renders canvas background (image, video, or solid color)
 * - Renders all WorkspaceObject components
 * - Manages object positioning (via CSS Grid, absolute positioning, or layout library)
 * - Handles canvas-level interactions (click outside to close panels)
 * - Applies canvas-level effects (dimming when panel open)
 * 
 * Does NOT:
 * - Manage object state (objects manage themselves)
 * - Fetch object data (receives objects array as prop or fetches via placeholder)
 * - Handle object clicks (delegates to objects)
 * - Render panels/overlays (delegates to WorkspaceRoot)
 * 
 * Props:
 * - objects: WorkspaceObject[] - Array of object data
 * - background?: BackgroundConfig - Background image/video config
 * - greeting?: string | null - CMS-editable greeting text for canvas
 */
interface CanvasProps {
  objects?: WorkspaceObjectData[]
  background?: BackgroundConfig
  greeting?: string | null
}

export function Canvas({ objects, background, greeting }: CanvasProps) {
  const { state, actions } = useWorkspace()
  const router = useRouter()
  
  // Initialize state with objects prop (from server-side fetch)
  // If objects are provided, use them directly; otherwise start empty
  const [workspaceObjects, setWorkspaceObjects] = useState<WorkspaceObjectData[]>(objects || [])
  const [objectsLoaded, setObjectsLoaded] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  // Track if we're on the client to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Initialize viewport size - start with 0 on server to match initial render
  // This prevents hydration mismatch
  const getViewportSize = () => {
    if (typeof window === 'undefined') {
      return { width: 0, height: 0 }
    }
    // Use innerWidth/innerHeight — matches CSS layout reference frame for fixed/absolute positioning
    const width = window.innerWidth || 0
    const height = window.innerHeight || 0
    return { width, height }
  }
  
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 })
  
  // Update viewport size on mount and resize (only on client)
  useEffect(() => {
    if (!isClient) return
    
    const updateViewportSize = () => {
      const newSize = getViewportSize()
      setViewportSize((prev) => {
        // Only update if size actually changed (prevents unnecessary re-renders)
        if (prev.width !== newSize.width || prev.height !== newSize.height) {
          console.log('[Canvas] Viewport size updated:', newSize)
          return newSize
        }
        return prev
      })
    }
    
    // Update immediately on client mount
    updateViewportSize()
    
    // Listen to both resize and visualViewport resize (for mobile)
    window.addEventListener('resize', updateViewportSize)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewportSize)
      window.visualViewport.addEventListener('scroll', updateViewportSize)
    }
    
    return () => {
      window.removeEventListener('resize', updateViewportSize)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewportSize)
        window.visualViewport.removeEventListener('scroll', updateViewportSize)
      }
    }
  }, [isClient])
  
  // PERMANENT: Calculate workspace layout (vertical scrolling model)
  // Canvas height may exceed viewport - users scroll to explore
  const optimalLayout = useMemo(() => {
    if (viewportSize.width === 0 || viewportSize.height === 0 || workspaceObjects.length === 0) {
      return null
    }
    const layout = calculateWorkspaceLayout(workspaceObjects, viewportSize.width, viewportSize.height)
    console.log('[Canvas] Workspace layout calculated:', { 
      viewport: viewportSize, 
      objectCount: workspaceObjects.length,
      canvasHeight: layout.canvasHeight,
      viewportHeight: viewportSize.height,
      willScroll: layout.canvasHeight > viewportSize.height
    })
    return layout
  }, [workspaceObjects, viewportSize])
  
  // Merge layout positions with objects
  const objectsWithOptimalPositions = useMemo(() => {
    if (!optimalLayout) {
      return workspaceObjects.map(obj => ({ ...obj, position: undefined }))
    }
    
    return workspaceObjects.map((obj) => {
      const layoutPos = optimalLayout.positions.find((p) => p.id === obj.id)
      return {
        ...obj,
        position: layoutPos
          ? { x: layoutPos.x, y: layoutPos.y }
          : undefined,
      }
    })
  }, [workspaceObjects, optimalLayout])

  // Initialize: Use server-side objects or fetch client-side
  useEffect(() => {
    if (objects && objects.length > 0) {
      // Objects provided from server-side
      console.log('[Canvas] Usando objetos desde el servidor:', objects.length)
      setWorkspaceObjects(objects)
      setObjectsLoaded(true)
      actions.setObjectsLoaded(true)
    } else {
      // No objects provided, fetch client-side as fallback
      console.log('[Canvas] No hay objetos, intentando carga en cliente...')
      getWorkspaceObjects()
        .then((fetched) => {
          setWorkspaceObjects(fetched)
          setObjectsLoaded(true)
          actions.setObjectsLoaded(true)
        })
        .catch((error) => {
          console.error('[Canvas] Falló la carga en cliente:', error)
          setWorkspaceObjects([])
          setObjectsLoaded(true)
          actions.setObjectsLoaded(true)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount - objects prop is stable from server

  // Handle canvas click (close panels if clicking outside)
  // Don't prevent default or stop propagation - allow scrolling to work
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on canvas, not on objects
    if (e.target === e.currentTarget && state.panelOpen) {
      actions.closePanel()
    }
    // Don't prevent default - allow scroll events to work
  }

  // Debug: Log canvas height
  if (optimalLayout) {
    console.log('[Canvas] Renderizando canvas con altura:', optimalLayout.canvasHeight, 'px')
  }

  return (
    <div
      data-workspace-canvas
      data-dimmed={state.panelOpen || state.overlayOpen ? '' : undefined}
      onClick={handleCanvasClick}
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{
        transition: 'opacity var(--motion-standard) var(--ease-out)',
        touchAction: 'none',
        overscrollBehavior: 'none',
      }}
    >
      {/* PERMANENT: Workspace objects container - this is the scrollable element */}
      <div
        data-workspace-objects-container
        className="absolute inset-0 w-full h-full overflow-visible z-[1]"
        style={{
          '--object-size': optimalLayout ? `${optimalLayout.objectSize}px` : '120px',
        } as React.CSSProperties}
      >
        {/* Only render objects on client after layout is calculated to prevent hydration mismatch */}
        {isClient && optimalLayout && objectsWithOptimalPositions.map((object, index) => {
          // Only render if object has a position
          if (!object.position) return null
          
          return (
            <WorkspaceObject
              key={object.id}
              slug={object.slug}
              type={object.type}
              position={object.position}
              title={object.title}
              visual={object.visual}
              isFocused={state.focusedObject === object.slug}
              index={index}
              onClick={() => {
                // Set focused state immediately (for red tint and label)
                actions.setFocusedObject(object.slug)

                // Special handling for blog objects - navigate to blog listing page
                if (object.slug === 'blog-noticias' || object.slug === 'blog' || object.slug === 'noticias') {
                  if (state.touchEnabled) {
                    // Mobile: delay navigation by 1500ms
                    setTimeout(() => {
                      router.push('/blog')
                    }, 1500)
                  } else {
                    // Desktop: immediate navigation
                    router.push('/blog')
                  }
                  return
                }
                
                // Regular workspace objects
                // Mobile: delay panel opening by 1500ms
                // Desktop: open panel immediately
                if (state.touchEnabled) {
                  setTimeout(() => {
                    actions.openPanel('service', object.slug)
                    router.push(`/${object.slug}`)
                  }, 1500)
                } else {
                  // Desktop: immediate panel opening
                  actions.openPanel('service', object.slug)
                  router.push(`/${object.slug}`)
                }
              }}
            />
          )
        })}
      </div>

      {/* Greeting — word-by-word reveal */}
      {greeting && (
        <div
          data-workspace-greeting
          className="absolute top-[8%] left-1/2 -translate-x-1/2 z-0
                     text-center pointer-events-none select-none
                     max-w-[500px] px-4"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            color: 'var(--paper-ink-primary)',
            letterSpacing: '0.02em',
          }}
        >
          {greeting.split(' ').map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.5 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ display: 'inline-block', marginRight: '0.25em' }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  )
}
