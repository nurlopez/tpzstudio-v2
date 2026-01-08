'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useWorkspace } from './WorkspaceProvider'
import { WorkspaceObject } from './WorkspaceObject'
import { WorkspaceObjectData, BackgroundConfig, AmbientElement } from './types'
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
 * - ambientElements?: AmbientElement[] - Optional canvas elements (intro text, philosophy card)
 */
interface CanvasProps {
  objects?: WorkspaceObjectData[]
  background?: BackgroundConfig
  ambientElements?: AmbientElement[]
}

export function Canvas({ objects, background, ambientElements }: CanvasProps) {
  const { state, actions } = useWorkspace()
  
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
    // On mobile, use visualViewport if available for accurate dimensions
    // This accounts for browser chrome (address bar, etc.)
    const width = window.visualViewport?.width || window.innerWidth || 0
    const height = window.visualViewport?.height || window.innerHeight || 0
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
      console.log('[Canvas] Using objects from server-side:', objects.length)
      setWorkspaceObjects(objects)
      setObjectsLoaded(true)
      actions.setObjectsLoaded(true)
    } else {
      // No objects provided, fetch client-side as fallback
      console.log('[Canvas] No objects provided, attempting client-side fetch...')
      getWorkspaceObjects()
        .then((fetched) => {
          setWorkspaceObjects(fetched)
          setObjectsLoaded(true)
          actions.setObjectsLoaded(true)
        })
        .catch((error) => {
          console.error('[Canvas] Client-side fetch failed:', error)
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
    console.log('[Canvas] Rendering canvas with height:', optimalLayout.canvasHeight, 'px')
  }

  return (
    <div
      data-workspace-canvas
      data-dimmed={state.panelOpen || state.overlayOpen ? '' : undefined}
      onClick={handleCanvasClick}
      className="fixed inset-0 w-screen h-screen overflow-hidden"
      style={{
        background: 'var(--bg-canvas)',
        transition: 'opacity var(--motion-standard) var(--ease-out)',
        touchAction: 'none',
        overscrollBehavior: 'none',
      }}
    >
      {/* PERMANENT: Workspace objects container - this is the scrollable element */}
      <div
        data-workspace-objects-container
        className="absolute inset-0 w-full h-screen overflow-visible z-[1]"
        style={{
          '--object-size': optimalLayout ? `${optimalLayout.objectSize}px` : '120px',
        } as React.CSSProperties}
      >
        {/* Only render objects on client after layout is calculated to prevent hydration mismatch */}
        {isClient && optimalLayout && objectsWithOptimalPositions.map((object) => {
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
              onClick={() => {
                actions.setFocusedObject(object.slug)
                actions.openPanel('service', object.slug)
              }}
            />
          )
        })}
      </div>

      {/* Ambient elements */}
      {state.ambientElementsVisible && ambientElements && (
        <div data-workspace-ambient-elements>
          {/* TODO: Render ambient elements */}
        </div>
      )}
    </div>
  )
}
