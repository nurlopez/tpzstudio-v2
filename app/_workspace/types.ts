/**
 * Workspace Type Definitions
 * 
 * Core types for workspace state, objects, and components.
 */

export type ObjectType = 'film' | 'voiceovers' | 'branding' | 'courses' | 'strategy' | 'projects' | 'contact'

export type PanelType = 'service' | 'archive' | 'contact' | 'about'

export type OverlayType = 'project' | 'about'


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
  // Detailed content (description, capabilities, etc.) is fetched on-demand
  // via /api/workspace-object/[slug]. This interface stays minimal for canvas rendering.
}

