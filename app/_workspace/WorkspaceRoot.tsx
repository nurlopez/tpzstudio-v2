'use client'

import React, { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useWorkspace } from './WorkspaceProvider'
import { Canvas } from './Canvas'
import { Panel } from './Panel'
import { Overlay } from './Overlay'
import { Dock } from './Dock'
import { useWorkspaceRoute } from './hooks/useWorkspaceRoute'
import { WorkspaceObjectData } from './types'

/**
 * WorkspaceRoot
 * 
 * Top-level workspace container and state provider.
 * 
 * Responsibilities:
 * - Provides WorkspaceStateContext (via WorkspaceProvider in layout)
 * - Manages route synchronization (reads route, updates state)
 * - Handles keyboard events (ESC to close panels)
 * - Handles resize events (mobile detection - handled in provider)
 * - Renders Canvas and conditionally renders Panel / Overlay
 * 
 * Does NOT:
 * - Render individual objects (delegates to Canvas)
 * - Fetch content (receives data as props or children fetch their own)
 * - Handle object interactions (delegates to WorkspaceObject)
 * - Style objects (delegates to components)
 * 
 * Props:
 * - objects?: WorkspaceObjectData[] - Workspace objects fetched server-side
 * - children?: ReactNode - Page content
 */
export function WorkspaceRoot({ 
  children,
  objects,
}: { 
  children?: React.ReactNode
  objects?: WorkspaceObjectData[]
}) {
  const { state, actions } = useWorkspace()
  const pathname = usePathname()
  const router = useRouter()

  // Sync route with workspace state
  useWorkspaceRoute()

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (state.overlayOpen) {
          actions.closeOverlay()
          // TODO: Navigate to appropriate route when overlay closes
        } else if (state.panelOpen) {
          actions.closePanel()
          router.push('/workspace')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.overlayOpen, state.panelOpen, actions, router])

  // Mark canvas as ready after mount (only once)
  useEffect(() => {
    if (!state.canvasReady) {
      actions.setCanvasReady(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  return (
    <div 
      data-workspace-root
      className="fixed inset-0 w-screen h-screen overflow-hidden"
      style={{ touchAction: 'pan-y' }}
    >
      <Dock />
      <Canvas objects={objects} />
      
      {state.panelOpen && state.panelType && (
        <Panel
          isOpen={state.panelOpen}
          type={state.panelType}
          slug={state.panelSlug || undefined}
          onClose={() => {
            actions.closePanel()
            router.push('/workspace')
          }}
        >
          {children}
        </Panel>
      )}

      {state.overlayOpen && state.overlayType && (
        <Overlay
          isOpen={state.overlayOpen}
          type={state.overlayType}
          slug={state.overlaySlug || undefined}
          onClose={() => {
            actions.closeOverlay()
            // Navigate back to previous route or workspace home
            if (state.panelOpen) {
              // If panel was open before overlay, go back to panel route
              router.back()
            } else {
              router.push('/workspace')
            }
          }}
        >
          {children}
        </Overlay>
      )}
    </div>
  )
}
