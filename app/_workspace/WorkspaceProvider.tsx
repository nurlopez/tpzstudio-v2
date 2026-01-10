'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { WorkspaceState, WorkspaceActions, PanelType, OverlayType } from './types'

/**
 * Workspace State Context
 * 
 * Provides global workspace state and actions to all workspace components.
 */
interface WorkspaceContextValue {
  state: WorkspaceState
  actions: WorkspaceActions
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

/**
 * WorkspaceProvider
 * 
 * Manages global workspace state and provides it via context.
 * 
 * Responsibilities:
 * - Initializes workspace state
 * - Detects mobile/touch devices
 * - Provides state update functions
 * - Handles resize events for mobile detection
 */
export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WorkspaceState>({
    canvasReady: false,
    objectsLoaded: false,
    focusedObject: null,
    hoveredObject: null,
    panelOpen: false,
    panelType: null,
    panelSlug: null,
    overlayOpen: false,
    overlayType: null,
    overlaySlug: null,
    isMobile: false,
    touchEnabled: false,
    ambientElementsVisible: true,
  })

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches
      const touchEnabled = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      setState(prev => ({
        ...prev,
        isMobile,
        touchEnabled,
      }))
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Actions
  const setFocusedObject = useCallback((slug: string | null) => {
    setState(prev => ({ ...prev, focusedObject: slug }))
  }, [])

  const setHoveredObject = useCallback((slug: string | null) => {
    setState(prev => ({ ...prev, hoveredObject: slug }))
  }, [])

  const openPanel = useCallback((type: PanelType, slug?: string) => {
    setState(prev => ({
      ...prev,
      panelOpen: true,
      panelType: type,
      panelSlug: slug || null,
    }))
  }, [])

  const closePanel = useCallback(() => {
    setState(prev => ({
      ...prev,
      panelOpen: false,
      panelType: null,
      panelSlug: null,
      focusedObject: null,
    }))
  }, [])

  const openOverlay = useCallback((type: OverlayType, slug?: string) => {
    setState(prev => ({
      ...prev,
      overlayOpen: true,
      overlayType: type,
      overlaySlug: slug || null,
    }))
  }, [])

  const closeOverlay = useCallback(() => {
    setState(prev => ({
      ...prev,
      overlayOpen: false,
      overlayType: null,
      overlaySlug: null,
    }))
  }, [])

  const setCanvasReady = useCallback((ready: boolean) => {
    setState(prev => ({ ...prev, canvasReady: ready }))
  }, [])

  const setObjectsLoaded = useCallback((loaded: boolean) => {
    setState(prev => ({ ...prev, objectsLoaded: loaded }))
  }, [])

  const setAmbientElementsVisible = useCallback((visible: boolean) => {
    setState(prev => ({ ...prev, ambientElementsVisible: visible }))
  }, [])

  const actions: WorkspaceActions = {
    setFocusedObject,
    setHoveredObject,
    openPanel,
    closePanel,
    openOverlay,
    closeOverlay,
    setCanvasReady,
    setObjectsLoaded,
    setAmbientElementsVisible,
  }

  return (
    <WorkspaceContext.Provider value={{ state, actions }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

/**
 * useWorkspace Hook
 * 
 * Access workspace state and actions.
 * 
 * @throws Error if used outside WorkspaceProvider
 */
export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider')
  }
  return context
}
