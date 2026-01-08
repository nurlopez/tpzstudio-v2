/**
 * Workspace Type Definitions
 * 
 * Core types for workspace state, objects, and components.
 */

export type ObjectType = 'film' | 'voiceovers' | 'branding' | 'courses' | 'strategy' | 'projects' | 'contact'

export type PanelType = 'service' | 'archive' | 'contact'

export type OverlayType = 'project' | 'about'

export type ViewMode = 'canvas' | 'focused'

export type DeviceType = 'desktop' | 'mobile'

/**
 * Workspace State
 * 
 * Global state managed by WorkspaceProvider.
 */
export interface WorkspaceState {
  // Canvas state
  canvasReady: boolean
  objectsLoaded: boolean
  
  // Focus state
  focusedObject: string | null        // Object slug or null
  hoveredObject: string | null
  
  // Panel state
  panelOpen: boolean
  panelType: PanelType | null
  panelSlug: string | null
  
  // Overlay state
  overlayOpen: boolean
  overlayType: OverlayType | null
  overlaySlug: string | null
  
  // Mobile state
  isMobile: boolean
  touchEnabled: boolean
  
  // Ambient elements
  ambientElementsVisible: boolean
}

/**
 * Workspace Actions
 * 
 * Functions to update workspace state.
 */
export interface WorkspaceActions {
  setFocusedObject: (slug: string | null) => void
  setHoveredObject: (slug: string | null) => void
  openPanel: (type: PanelType, slug?: string) => void
  closePanel: () => void
  openOverlay: (type: OverlayType, slug?: string) => void
  closeOverlay: () => void
  setCanvasReady: (ready: boolean) => void
  setObjectsLoaded: (loaded: boolean) => void
  setAmbientElementsVisible: (visible: boolean) => void
}

/**
 * Workspace Object Visual
 * 
 * Optional visual image for object (isometric/pseudo-3D)
 */
export interface WorkspaceObjectVisual {
  url: string
  alt?: string
}

/**
 * Workspace Object Data
 * 
 * Data structure for workspace objects.
 */
export interface WorkspaceObjectData {
  id: string
  slug: string
  type: ObjectType
  title: string
  position?: {
    x: number
    y: number
  }
  visual?: WorkspaceObjectVisual
  // TODO: Add service data structure when Sanity is integrated
}

/**
 * Background Configuration
 * 
 * Canvas background settings.
 */
export interface BackgroundConfig {
  type: 'image' | 'video' | 'solid'
  image?: string
  videoUrl?: string
  color?: string
}

/**
 * Ambient Element
 * 
 * Optional canvas elements (intro text, philosophy card, etc.)
 */
export interface AmbientElement {
  id: string
  type: 'text' | 'card'
  content: string
  position?: {
    x: number
    y: number
  }
}
